import { createDefaultAiProvider } from "./ai";
import { ActiveSearchRepository, RoleRecord } from "./repository";
import { AiProvider, RoleHealthState, RoleMetrics, RoleSpec, SourcedCandidateProfile } from "./types";
import { DEFAULT_ROLE_RULES } from "./rules";
import { classifyReplyText, parseScreeningText } from "./parsing";

type Json = Record<string, unknown>;

interface SupabaseRepositoryConfig {
  supabaseUrl?: string;
  serviceRoleKey?: string;
  aiProvider?: AiProvider;
}

function must(value: string | undefined, name: string): string {
  if (!value) throw new Error(`${name} is required for Supabase repository.`);
  return value;
}

export class SupabaseActiveSearchRepository implements ActiveSearchRepository {
  private readonly supabaseUrl: string;
  private readonly serviceRoleKey: string;
  private readonly aiProvider: AiProvider;

  constructor(config?: SupabaseRepositoryConfig) {
    this.supabaseUrl = must(config?.supabaseUrl ?? process.env.VITE_SUPABASE_URL, "VITE_SUPABASE_URL");
    this.serviceRoleKey = must(
      config?.serviceRoleKey ?? process.env.SUPABASE_SERVICE_ROLE_KEY,
      "SUPABASE_SERVICE_ROLE_KEY"
    );
    this.aiProvider = config?.aiProvider ?? createDefaultAiProvider();
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.supabaseUrl}/rest/v1/${path}`, {
      ...init,
      headers: {
        apikey: this.serviceRoleKey,
        authorization: `Bearer ${this.serviceRoleKey}`,
        "content-type": "application/json",
        ...(init?.headers ?? {}),
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Supabase request failed ${response.status}: ${text}`);
    }

    if (response.status === 204) return [] as unknown as T;
    return (await response.json()) as T;
  }

  async getActiveRoles(): Promise<RoleRecord[]> {
    const roles = await this.request<
      Array<{ id: string; client_id: string; status: string; health_state: string; title: string; location?: string; created_at: string }>
    >("roles?select=id,client_id,status,health_state,title,location,created_at&status=eq.active");

    const configs = await this.request<Array<{ role_id: string; rules_json?: Json; paused?: boolean }>>(
      "role_orchestrator_configs?select=role_id,rules_json,paused"
    );
    const configByRoleId = new Map(configs.map((config) => [config.role_id, config]));

    return roles.map((role) => {
      const cfg = configByRoleId.get(role.id);
      return {
        id: role.id,
        clientId: role.client_id,
        status: role.status as RoleRecord["status"],
        healthState: role.health_state as RoleRecord["healthState"],
        title: role.title,
        location: role.location,
        createdAt: role.created_at,
        rulesJson: cfg?.rules_json,
        orchestratorPaused: cfg?.paused ?? false,
      };
    });
  }

  async getRoleMetrics(roleId: string): Promise<RoleMetrics> {
    const roleCandidates = await this.request<
      Array<{ id: string; stage: string; knockout_status: string; created_at: string; last_activity_at?: string; updated_at: string }>
    >(`role_candidates?select=id,stage,knockout_status,created_at,last_activity_at,updated_at&role_id=eq.${roleId}`);

    const roleCandidateIds = roleCandidates.map((row) => row.id).filter(Boolean);
    const conversations =
      roleCandidateIds.length > 0
        ? await this.request<Array<{ direction: string; created_at: string }>>(
            `conversations?select=direction,created_at&role_candidate_id=in.(${roleCandidateIds.join(",")})`
          ).catch(() => [])
        : [];

    const totalApplications = roleCandidates.length;
    const qualifiedApplications = roleCandidates.filter(
      (row) => row.knockout_status === "pass" || row.stage === "qualified" || row.stage === "shortlisted"
    ).length;
    const shortlistSize = roleCandidates.filter((row) => row.stage === "shortlisted").length;
    const outboundCount = conversations.filter((row) => row.direction === "outbound").length;
    const inboundCount = conversations.filter((row) => row.direction === "inbound").length;
    const outreachResponseRatePercent = outboundCount > 0 ? (inboundCount / outboundCount) * 100 : 0;

    const now = Date.now();
    const lastCandidateActivity = roleCandidates
      .map((row) => new Date(row.last_activity_at ?? row.updated_at).getTime())
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => b - a)[0];
    const lastShortlistUpdate = roleCandidates
      .filter((row) => row.stage === "shortlisted")
      .map((row) => new Date(row.updated_at).getTime())
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => b - a)[0];
    const roleCreatedAt = roleCandidates
      .map((row) => new Date(row.created_at).getTime())
      .filter((value) => Number.isFinite(value))
      .sort((a, b) => a - b)[0];

    return {
      totalApplications,
      qualifiedApplications,
      sourcedCandidatesContacted: outboundCount,
      outreachResponseRatePercent,
      shortlistSize,
      hoursSinceCandidateActivity: lastCandidateActivity ? (now - lastCandidateActivity) / 36e5 : 999,
      hoursSinceRoleCreation: roleCreatedAt ? (now - roleCreatedAt) / 36e5 : 0,
      hoursSinceShortlistUpdate: lastShortlistUpdate ? (now - lastShortlistUpdate) / 36e5 : 999,
    };
  }

  async getAuthorizedConnectorNames(_clientId: string): Promise<string[]> {
    const capabilities = await this.request<Array<{ source_name: string; active: boolean }>>(
      "source_capabilities?select=source_name,active&active=is.true"
    );
    return capabilities.filter((entry) => entry.active).map((entry) => entry.source_name);
  }

  async setRoleHealth(roleId: string, state: RoleHealthState, reason: string, metrics: RoleMetrics): Promise<void> {
    const previous = await this.request<Array<{ health_state: RoleHealthState }>>(
      `roles?select=health_state&id=eq.${roleId}&limit=1`
    );
    const previousState = previous[0]?.health_state ?? "healthy";

    await this.request(
      `roles?id=eq.${roleId}`,
      {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          health_state: state,
          updated_at: new Date().toISOString(),
        }),
      }
    );

    await this.request("role_health_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        role_id: roleId,
        previous_state: previousState,
        new_state: state,
        trigger_reason: reason,
        metrics_snapshot_json: metrics,
      }),
    });
  }

  async emitAudit(roleId: string, action: string, payload: Record<string, unknown>): Promise<void> {
    await this.request("audit_events", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        actor_type: "system",
        actor_id: "active-search-orchestrator",
        entity_type: "role",
        entity_id: roleId,
        action,
        payload_json: payload,
      }),
    });
  }

  async ingestInbound(roleId: string): Promise<void> {
    await this.emitAudit(roleId, "ingest_inbound_triggered", { mode: "poll" });
  }
  async screenUnscreened(roleId: string): Promise<void> {
    const pending = await this.request<
      Array<{
        id: string;
        candidate_id: string;
        source_channel: string;
        stage: string;
        knockout_status: string;
      }>
    >(
      `role_candidates?select=id,candidate_id,source_channel,stage,knockout_status&role_id=eq.${roleId}&knockout_status=eq.pending&limit=50`
    );
    if (!pending.length) {
      await this.emitAudit(roleId, "screen_unscreened_skipped", { reason: "no_pending_candidates" });
      return;
    }

    const roleSpec = await this.getRoleSpec(roleId);

    for (const row of pending) {
      const candidate = await this.request<Array<{ full_name: string; parsed_profile_json: Json }>>(
        `candidates?select=full_name,parsed_profile_json&id=eq.${row.candidate_id}&limit=1`
      );

      const candidateName = candidate[0]?.full_name ?? "Candidate";
      const profileJson = candidate[0]?.parsed_profile_json ?? {};

      const aiText = await this.aiProvider.generate({
        task: "candidate_screening_summary",
        messages: [
          {
            role: "system",
            content:
              "Screen this candidate for the role. Return concise plain text with: score(0-100), knockout(pass/fail), strengths, concerns, next_step.",
          },
          {
            role: "user",
            content: JSON.stringify({
              roleSpec,
              candidateName,
              profile: profileJson,
            }),
          },
        ],
        temperature: 0.1,
        maxTokens: 220,
      });

      const parsed = parseScreeningText(aiText.text);
      const knockoutStatus = parsed.knockoutStatus;
      const fitScore = parsed.fitScore;
      const stage = parsed.stage;

      await this.request("screening_results", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          role_candidate_id: row.id,
          answers_json: {},
          screening_summary: aiText.text.slice(0, 6000),
          confidence_score: 0.75,
          fit_score: fitScore,
          knockout_status: knockoutStatus,
          rationale: aiText.text.slice(0, 6000),
        }),
      });

      await this.request(`role_candidates?id=eq.${row.id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          stage,
          knockout_status: knockoutStatus,
          fit_score: fitScore,
          last_activity_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });
    }

    await this.emitAudit(roleId, "screen_unscreened_completed", {
      screenedCount: pending.length,
    });
  }
  async scoreCandidates(roleId: string): Promise<void> {
    const candidates = await this.request<
      Array<{ id: string; stage: string; knockout_status: string; fit_score: number }>
    >(`role_candidates?select=id,stage,knockout_status,fit_score&role_id=eq.${roleId}&limit=200`);

    for (const row of candidates) {
      const nextStage =
        row.knockout_status === "fail"
          ? "rejected"
          : row.fit_score >= 75
            ? "qualified"
            : row.fit_score >= 55
              ? "borderline"
              : "rejected";

      if (nextStage !== row.stage) {
        await this.request(`role_candidates?id=eq.${row.id}`, {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({
            stage: nextStage,
            updated_at: new Date().toISOString(),
          }),
        });
      }
    }

    await this.emitAudit(roleId, "score_candidates_completed", {
      candidateCount: candidates.length,
    });
  }
  async refreshShortlist(roleId: string): Promise<void> {
    const ranked = await this.request<
      Array<{ id: string; fit_score: number; stage: string; knockout_status: string }>
    >(
      `role_candidates?select=id,fit_score,stage,knockout_status&role_id=eq.${roleId}&order=fit_score.desc&limit=300`
    );

    const target = DEFAULT_ROLE_RULES.shortlistTarget;
    const qualified = ranked.filter((row) => row.knockout_status === "pass" && row.fit_score >= 70);
    const shortlist = qualified.slice(0, target);

    for (let i = 0; i < shortlist.length; i += 1) {
      const row = shortlist[i];
      await this.request("shortlist_entries", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          role_candidate_id: row.id,
          rank: i + 1,
          shortlist_bucket: "qualified",
          explanation: `Auto-shortlisted by fit score ${row.fit_score}.`,
          approved_by_user: false,
          updated_at: new Date().toISOString(),
        }),
      }).catch(() => undefined);

      await this.request(`role_candidates?id=eq.${row.id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          stage: "shortlisted",
          shortlist_status: "qualified",
          updated_at: new Date().toISOString(),
        }),
      });
    }

    await this.emitAudit(roleId, "refresh_shortlist_completed", {
      shortlistSize: shortlist.length,
      target,
    });
  }
  async runSourcing(roleId: string, connectorName: string): Promise<void> {
    await this.emitAudit(roleId, "run_sourcing_triggered", { connectorName });
  }
  async getRoleSpec(roleId: string): Promise<RoleSpec> {
    const role = await this.request<
      Array<{
        title: string;
        location?: string;
        salary_min?: number;
        salary_max?: number;
        contract_type?: string;
        shift_pattern?: string;
      }>
    >(
      `roles?select=title,location,salary_min,salary_max,contract_type,shift_pattern&id=eq.${roleId}&limit=1`
    );
    const spec = role[0];
    return {
      title: spec?.title ?? "Unknown role",
      location: spec?.location,
      salaryMin: spec?.salary_min,
      salaryMax: spec?.salary_max,
      contractType: spec?.contract_type,
      shiftPattern: spec?.shift_pattern,
      mustHaves: [],
      dealBreakers: [],
    };
  }

  private buildFingerprint(candidate: SourcedCandidateProfile): string {
    const email = candidate.email?.trim().toLowerCase() ?? "";
    const phone = candidate.phone?.replace(/\s+/g, "") ?? "";
    if (email) return `email:${email}`;
    if (phone) return `phone:${phone}`;
    return `source:${candidate.sourceRef}`;
  }

  async upsertSourcedCandidates(
    roleId: string,
    connectorName: string,
    candidates: SourcedCandidateProfile[]
  ): Promise<number> {
    if (!candidates.length) return 0;

    const role = await this.request<Array<{ client_id: string }>>(
      `roles?select=client_id&id=eq.${roleId}&limit=1`
    );
    const clientId = role[0]?.client_id;
    if (!clientId) return 0;

    let importedCount = 0;

    for (const candidate of candidates) {
      const fingerprint = this.buildFingerprint(candidate);
      const candidateRow = {
        client_id: clientId,
        full_name: candidate.fullName,
        email: candidate.email ?? null,
        phone: candidate.phone ?? null,
        location: candidate.location ?? null,
        parsed_profile_json: candidate.profile,
        source_type: connectorName,
        source_ref: candidate.sourceRef,
      };

      const inserted = await this.request<Array<{ id: string }>>("candidates?select=id", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=representation" },
        body: JSON.stringify(candidateRow),
      }).catch(async () => {
        const existing = await this.request<Array<{ id: string }>>(
          `candidates?select=id&source_type=eq.${encodeURIComponent(connectorName)}&source_ref=eq.${encodeURIComponent(
            candidate.sourceRef
          )}&limit=1`
        );
        return existing;
      });

      const candidateId = inserted[0]?.id;
      if (!candidateId) continue;

      await this.request("role_candidates", {
        method: "POST",
        headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
        body: JSON.stringify({
          role_id: roleId,
          candidate_id: candidateId,
          source_channel: connectorName,
          stage: "new",
          fit_score: 0,
          knockout_status: "pending",
          identity_fingerprint: fingerprint,
          outreach_attempts: 0,
          outreach_opt_out: false,
          last_activity_at: new Date().toISOString(),
        }),
      }).catch(() => undefined);

      importedCount += 1;
    }

    return importedCount;
  }
  async runOutreach(roleId: string): Promise<void> {
    const prospects = await this.request<
      Array<{
        id: string;
        source_channel: string;
        candidate_id: string;
        stage: string;
        outreach_attempts?: number;
        outreach_opt_out?: boolean;
        last_outreach_at?: string;
      }>
    >(
      `role_candidates?select=id,source_channel,candidate_id,stage,outreach_attempts,outreach_opt_out,last_outreach_at&role_id=eq.${roleId}&stage=in.(qualified,shortlisted)&limit=50`
    );
    const roleSpec = await this.getRoleSpec(roleId);
    const config = await this.request<Array<{ rules_json?: Json }>>(
      `role_orchestrator_configs?select=rules_json&role_id=eq.${roleId}&limit=1`
    ).catch(() => []);
    const rules = (config[0]?.rules_json ?? {}) as Record<string, unknown>;
    const maxAttempts =
      typeof rules.maxOutreachAttemptsPerCandidate === "number"
        ? rules.maxOutreachAttemptsPerCandidate
        : DEFAULT_ROLE_RULES.maxOutreachAttemptsPerCandidate;
    const cadenceHours = Array.isArray(rules.outreachCadenceHours)
      ? (rules.outreachCadenceHours as number[])
      : DEFAULT_ROLE_RULES.outreachCadenceHours;
    let sentCount = 0;

    for (const row of prospects) {
      if (row.outreach_opt_out) continue;
      const attempts = row.outreach_attempts ?? 0;
      if (attempts >= maxAttempts) continue;
      const priorOutbound = await this.request<Array<{ id: string }>>(
        `conversations?select=id&role_candidate_id=eq.${row.id}&direction=eq.outbound&limit=1`
      );
      const requiredGapHours = cadenceHours[Math.min(attempts, cadenceHours.length - 1)] ?? 24;
      if (row.last_outreach_at) {
        const lastOutreachAt = new Date(row.last_outreach_at).getTime();
        const hoursSince = (Date.now() - lastOutreachAt) / 36e5;
        if (hoursSince < requiredGapHours) continue;
      } else if (priorOutbound.length > 0 && attempts > 0) {
        continue;
      }

      const candidate = await this.request<Array<{ full_name: string }>>(
        `candidates?select=full_name&id=eq.${row.candidate_id}&limit=1`
      );
      const name = candidate[0]?.full_name ?? "there";

      const drafted = await this.aiProvider.generate({
        task: "outreach_draft",
        messages: [
          {
            role: "system",
            content:
              "Write a concise professional first-touch recruitment message for an operational hospitality role.",
          },
          {
            role: "user",
            content: JSON.stringify({
              candidateName: name,
              roleTitle: roleSpec.title,
              location: roleSpec.location,
              contractType: roleSpec.contractType,
            }),
          },
        ],
        temperature: 0.3,
        maxTokens: 180,
      });

      await this.request("conversations", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          role_candidate_id: row.id,
          channel: "platform",
          direction: "outbound",
          message_text: drafted.text.slice(0, 6000),
          delivered_at: new Date().toISOString(),
        }),
      });

      await this.request(`role_candidates?id=eq.${row.id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          outreach_attempts: attempts + 1,
          last_outreach_at: new Date().toISOString(),
          last_activity_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }),
      });

      sentCount += 1;
    }

    await this.emitAudit(roleId, "run_outreach_completed", { sentCount });
  }
  async syncReplies(roleId: string): Promise<void> {
    const roleCandidates = await this.request<Array<{ id: string }>>(
      `role_candidates?select=id&role_id=eq.${roleId}&limit=500`
    ).catch(() => []);
    const roleCandidateIds = roleCandidates.map((row) => row.id);
    if (!roleCandidateIds.length) {
      await this.emitAudit(roleId, "sync_replies_skipped", { reason: "no_role_candidates" });
      return;
    }

    const inbound = await this.request<
      Array<{ role_candidate_id: string; message_text: string; created_at: string }>
    >(
      `conversations?select=role_candidate_id,message_text,created_at,direction&direction=eq.inbound&role_candidate_id=in.(${roleCandidateIds.join(
        ","
      )})&limit=100`
    ).catch(() => []);

    for (const reply of inbound) {
      const classified = classifyReplyText(reply.message_text);
      const stage = classified.stage;
      const knockout = classified.knockoutStatus;
      const score = classified.fitScore;

      await this.request(`role_candidates?id=eq.${reply.role_candidate_id}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          stage,
          knockout_status: knockout,
          fit_score: score,
          outreach_opt_out: classified.optOut ? true : undefined,
          last_activity_at: reply.created_at,
          updated_at: new Date().toISOString(),
        }),
      }).catch(() => undefined);

      await this.request("screening_results", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          role_candidate_id: reply.role_candidate_id,
          answers_json: { reply: reply.message_text },
          screening_summary: `Reply classified as ${stage}`,
          confidence_score: 0.7,
          fit_score: score,
          knockout_status: knockout,
          rationale: `Inbound response classification from message text.`,
        }),
      }).catch(() => undefined);
    }

    await this.emitAudit(roleId, "sync_replies_completed", { classifiedCount: inbound.length });
  }
  async alertIfRequired(roleId: string, health: RoleHealthState): Promise<void> {
    if (health === "at_risk" || health === "stale" || health === "escalated") {
      await this.emitAudit(roleId, "role_alert_required", { health });
    }
  }

  async generateRoleRecommendation(_roleId: string, promptContext: string): Promise<string> {
    const response = await this.aiProvider.generate({
      task: "fit_rationale",
      messages: [
        {
          role: "system",
          content:
            "Return one concise and practical recommendation to improve role pipeline momentum for operational hiring.",
        },
        { role: "user", content: promptContext },
      ],
      temperature: 0.2,
      maxTokens: 120,
    });
    return response.text;
  }

  async getRoleCommandCentre(roleId: string): Promise<Record<string, unknown>> {
    const role = await this.request<
      Array<{ id: string; title: string; status: string; health_state: string; location?: string }>
    >(`roles?select=id,title,status,health_state,location&id=eq.${roleId}&limit=1`);
    if (!role.length) {
      return { roleId, notFound: true };
    }

    const metrics = await this.getRoleMetrics(roleId);
    const recommendation = await this.generateRoleRecommendation(
      roleId,
      "Summarize the highest-impact next action based on weak pipeline risks."
    );
    const recentActivity = await this.request<
      Array<{ action: string; created_at: string; payload_json: Json }>
    >(`audit_events?select=action,created_at,payload_json&entity_id=eq.${roleId}&order=created_at.desc&limit=25`);

    return {
      role: role[0],
      metrics,
      recommendedAction: recommendation,
      activityFeed: recentActivity,
    };
  }

  async upsertRoleOrchestratorConfig(
    roleId: string,
    patch: {
      paused?: boolean;
      mode?: "manual_assist" | "semi_automated" | "fully_automated";
      rulesJson?: Record<string, unknown>;
    }
  ): Promise<void> {
    const role = await this.request<Array<{ client_id: string }>>(
      `roles?select=client_id&id=eq.${roleId}&limit=1`
    );
    const clientId = role[0]?.client_id;
    if (!clientId) {
      throw new Error("Role not found for orchestrator config update.");
    }

    await this.request("role_orchestrator_configs", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        role_id: roleId,
        client_id: clientId,
        paused: patch.paused,
        mode: patch.mode,
        rules_json: patch.rulesJson,
        updated_at: new Date().toISOString(),
      }),
    });

    await this.emitAudit(roleId, "orchestrator_config_updated", {
      paused: patch.paused,
      mode: patch.mode,
      rulesUpdated: Boolean(patch.rulesJson),
    });
  }

  async upsertInboundReplies(
    roleId: string,
    replies: Array<{ candidateRef: string; message: string; receivedAt: string }>
  ): Promise<number> {
    if (!replies.length) return 0;
    const roleCandidates = await this.request<
      Array<{ id: string; candidate_id: string }>
    >(`role_candidates?select=id,candidate_id&role_id=eq.${roleId}&limit=500`);

    const candidateIds = roleCandidates.map((row) => row.candidate_id);
    if (!candidateIds.length) return 0;
    const candidateRows = await this.request<
      Array<{ id: string; source_ref?: string; email?: string; phone?: string }>
    >(`candidates?select=id,source_ref,email,phone&id=in.(${candidateIds.join(",")})`);

    const byRef = new Map<string, string>();
    for (const row of candidateRows) {
      if (row.source_ref) byRef.set(`source:${row.source_ref}`, row.id);
      if (row.email) byRef.set(`email:${row.email.toLowerCase()}`, row.id);
      if (row.phone) byRef.set(`phone:${row.phone.replace(/\s+/g, "")}`, row.id);
    }

    const roleCandidateByCandidateId = new Map(roleCandidates.map((row) => [row.candidate_id, row.id]));

    let persistedCount = 0;
    for (const reply of replies) {
      const norm = reply.candidateRef.trim();
      const candidateId =
        byRef.get(`source:${norm}`) ?? byRef.get(`email:${norm.toLowerCase()}`) ?? byRef.get(`phone:${norm}`);
      if (!candidateId) continue;
      const roleCandidateId = roleCandidateByCandidateId.get(candidateId);
      if (!roleCandidateId) continue;

      await this.request("conversations", {
        method: "POST",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          role_candidate_id: roleCandidateId,
          channel: "platform",
          direction: "inbound",
          message_text: reply.message.slice(0, 6000),
          received_at: reply.receivedAt,
          created_at: reply.receivedAt,
        }),
      }).catch(() => undefined);

      persistedCount += 1;
    }
    return persistedCount;
  }

  async getPortfolioHealthSummary(clientId?: string): Promise<Record<string, unknown>> {
    const query = clientId
      ? `roles?select=id,health_state,status,updated_at&status=eq.active&client_id=eq.${clientId}`
      : "roles?select=id,health_state,status,updated_at&status=eq.active";
    const activeRoles = await this.request<Array<{ id: string; health_state: RoleHealthState; updated_at: string }>>(
      query
    );
    const totalActiveRoles = activeRoles.length;
    const counts = {
      healthy: 0,
      weakPipeline: 0,
      atRisk: 0,
      stale: 0,
      escalated: 0,
    };
    const now = Date.now();
    let touchedWithinSla = 0;

    for (const role of activeRoles) {
      if (role.health_state === "healthy") counts.healthy += 1;
      if (role.health_state === "weak_pipeline") counts.weakPipeline += 1;
      if (role.health_state === "at_risk") counts.atRisk += 1;
      if (role.health_state === "stale") counts.stale += 1;
      if (role.health_state === "escalated") counts.escalated += 1;

      const updatedAt = new Date(role.updated_at).getTime();
      if (Number.isFinite(updatedAt) && (now - updatedAt) / 36e5 <= 1) {
        touchedWithinSla += 1;
      }
    }

    return {
      clientId: clientId ?? null,
      totalActiveRoles,
      ...counts,
      touchedWithinSlaPercent:
        totalActiveRoles > 0 ? Math.round((touchedWithinSla / totalActiveRoles) * 10000) / 100 : 0,
      generatedAt: new Date().toISOString(),
    };
  }
}
