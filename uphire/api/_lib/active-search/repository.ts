import { createDefaultAiProvider } from "./ai";
import { AiProvider, Role, RoleHealthState, RoleMetrics, RoleSpec, SourcedCandidateProfile } from "./types";

export interface RoleRecord extends Role {
  rulesJson?: Record<string, unknown>;
  orchestratorPaused?: boolean;
}

export interface ActiveSearchRepository {
  getActiveRoles: () => Promise<RoleRecord[]>;
  getRoleMetrics: (roleId: string) => Promise<RoleMetrics>;
  getAuthorizedConnectorNames: (clientId: string) => Promise<string[]>;
  setRoleHealth: (roleId: string, state: RoleHealthState, reason: string, metrics: RoleMetrics) => Promise<void>;
  emitAudit: (roleId: string, action: string, payload: Record<string, unknown>) => Promise<void>;
  ingestInbound: (roleId: string) => Promise<void>;
  screenUnscreened: (roleId: string) => Promise<void>;
  scoreCandidates: (roleId: string) => Promise<void>;
  refreshShortlist: (roleId: string) => Promise<void>;
  runSourcing: (roleId: string, connectorName: string) => Promise<void>;
  getRoleSpec: (roleId: string) => Promise<RoleSpec>;
  upsertSourcedCandidates: (
    roleId: string,
    connectorName: string,
    candidates: SourcedCandidateProfile[]
  ) => Promise<number>;
  runOutreach: (roleId: string) => Promise<void>;
  syncReplies: (roleId: string) => Promise<void>;
  alertIfRequired: (roleId: string, health: RoleHealthState) => Promise<void>;
  generateRoleRecommendation: (roleId: string, promptContext: string) => Promise<string>;
  getRoleCommandCentre: (roleId: string) => Promise<Record<string, unknown>>;
  upsertRoleOrchestratorConfig: (
    roleId: string,
    patch: {
      paused?: boolean;
      mode?: "manual_assist" | "semi_automated" | "fully_automated";
      rulesJson?: Record<string, unknown>;
    }
  ) => Promise<void>;
  upsertInboundReplies: (
    roleId: string,
    replies: Array<{ candidateRef: string; message: string; receivedAt: string }>
  ) => Promise<number>;
  getPortfolioHealthSummary: (clientId?: string) => Promise<Record<string, unknown>>;
}

export class InMemoryActiveSearchRepository implements ActiveSearchRepository {
  constructor(
    private readonly roles: RoleRecord[] = [],
    private readonly aiProvider: AiProvider = createDefaultAiProvider()
  ) {}

  async getActiveRoles(): Promise<RoleRecord[]> {
    return this.roles.filter((role) => role.status === "active");
  }

  async getRoleMetrics(): Promise<RoleMetrics> {
    return {
      totalApplications: 0,
      qualifiedApplications: 0,
      sourcedCandidatesContacted: 0,
      outreachResponseRatePercent: 0,
      shortlistSize: 0,
      hoursSinceCandidateActivity: 0,
      hoursSinceRoleCreation: 0,
      hoursSinceShortlistUpdate: 0,
    };
  }

  async getAuthorizedConnectorNames(): Promise<string[]> {
    return [];
  }

  async setRoleHealth(): Promise<void> {}
  async emitAudit(): Promise<void> {}
  async ingestInbound(): Promise<void> {}
  async screenUnscreened(): Promise<void> {}
  async scoreCandidates(): Promise<void> {}
  async refreshShortlist(): Promise<void> {}
  async runSourcing(): Promise<void> {}
  async getRoleSpec(): Promise<RoleSpec> {
    return {
      title: "Unknown role",
      mustHaves: [],
      dealBreakers: [],
    };
  }
  async upsertSourcedCandidates(): Promise<number> {
    return 0;
  }
  async runOutreach(): Promise<void> {}
  async syncReplies(): Promise<void> {}
  async alertIfRequired(): Promise<void> {}
  async generateRoleRecommendation(_roleId: string, promptContext: string): Promise<string> {
    const result = await this.aiProvider.generate({
      task: "fit_rationale",
      messages: [
        {
          role: "system",
          content:
            "You are an operational hiring assistant. Provide one concise next action recommendation.",
        },
        { role: "user", content: promptContext },
      ],
      temperature: 0.2,
      maxTokens: 120,
    });
    return result.text;
  }
  async getRoleCommandCentre(roleId: string): Promise<Record<string, unknown>> {
    return {
      roleId,
      status: "active",
      healthState: "weak_pipeline",
      recommendedAction: "Connect data source and run first sweep.",
    };
  }
  async upsertRoleOrchestratorConfig(): Promise<void> {}
  async upsertInboundReplies(): Promise<number> {
    return 0;
  }
  async getPortfolioHealthSummary(clientId?: string): Promise<Record<string, unknown>> {
    return {
      clientId: clientId ?? null,
      totalActiveRoles: 0,
      healthy: 0,
      weakPipeline: 0,
      atRisk: 0,
      stale: 0,
      escalated: 0,
      touchedWithinSlaPercent: 0,
    };
  }
}
