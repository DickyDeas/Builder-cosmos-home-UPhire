import { SourceConnectorRegistry } from "./connectors";
import { canRunConnectorActions } from "./connectors";
import { runRoleOrchestratorTick } from "./orchestrator";
import { ActiveSearchRepository } from "./repository";
import { OrchestratorDeps, RoleRulesConfig } from "./types";

function readRoleRuleOverrides(input?: Record<string, unknown>): Partial<RoleRulesConfig> {
  if (!input) return {};
  return {
    shortlistTarget: typeof input.shortlistTarget === "number" ? input.shortlistTarget : undefined,
    qualifiedTarget24h: typeof input.qualifiedTarget24h === "number" ? input.qualifiedTarget24h : undefined,
    atRiskNoActivityHours:
      typeof input.atRiskNoActivityHours === "number" ? input.atRiskNoActivityHours : undefined,
    staleNoShortlistUpdateHours:
      typeof input.staleNoShortlistUpdateHours === "number" ? input.staleNoShortlistUpdateHours : undefined,
    responseRateFloorPercent:
      typeof input.responseRateFloorPercent === "number" ? input.responseRateFloorPercent : undefined,
    maxOutreachAttemptsPerCandidate:
      typeof input.maxOutreachAttemptsPerCandidate === "number"
        ? input.maxOutreachAttemptsPerCandidate
        : undefined,
    outreachCadenceHours: Array.isArray(input.outreachCadenceHours)
      ? (input.outreachCadenceHours as number[])
      : undefined,
    requiresHumanApprovalForMessaging:
      typeof input.requiresHumanApprovalForMessaging === "boolean"
        ? input.requiresHumanApprovalForMessaging
        : undefined,
  };
}

export async function runActiveSearchSweep(
  repository: ActiveSearchRepository,
  connectors: SourceConnectorRegistry
): Promise<{ processed: number }> {
  const roles = await repository.getActiveRoles();
  return runRoles(roles, repository, connectors);
}

export async function runActiveSearchSweepForRole(
  roleId: string,
  repository: ActiveSearchRepository,
  connectors: SourceConnectorRegistry
): Promise<{ processed: number }> {
  const roles = await repository.getActiveRoles();
  const filtered = roles.filter((role) => role.id === roleId);
  return runRoles(filtered, repository, connectors);
}

async function runRoles(
  roles: Awaited<ReturnType<ActiveSearchRepository["getActiveRoles"]>>,
  repository: ActiveSearchRepository,
  connectors: SourceConnectorRegistry
): Promise<{ processed: number }> {
  for (const role of roles) {
    const deps: OrchestratorDeps = {
      ingestInbound: repository.ingestInbound,
      screenUnscreened: repository.screenUnscreened,
      scoreCandidates: repository.scoreCandidates,
      refreshShortlist: repository.refreshShortlist,
      getRoleMetrics: repository.getRoleMetrics,
      getAuthorizedConnectorNames: repository.getAuthorizedConnectorNames,
      runSourcing: async (roleId: string, connectorName: string) => {
        const connector = connectors.get(connectorName);
        if (!connector) {
          await repository.emitAudit(roleId, "sourcing_skipped_connector_missing", { connectorName });
          return;
        }

        const access = await canRunConnectorActions(connector, role.clientId);
        if (!access.allowed) {
          await repository.emitAudit(roleId, "sourcing_skipped_access_or_capability", {
            connectorName,
            reason: access.reason ?? "Unknown reason",
          });
          return;
        }

        const roleSpec = await repository.getRoleSpec(roleId);
        const sourced = await connector.searchCandidates(roleSpec);
        const importedCount = await repository.upsertSourcedCandidates(roleId, connectorName, sourced);

        await repository.emitAudit(roleId, "sourcing_import_completed", {
          connectorName,
          discoveredCount: sourced.length,
          importedCount,
        });
      },
      runOutreach: repository.runOutreach,
      syncReplies: async (roleId: string) => {
        const connectorNames = await repository.getAuthorizedConnectorNames(role.clientId);
        for (const connectorName of connectorNames) {
          const connector = connectors.get(connectorName);
          if (!connector) continue;
          const capabilities = await connector.getCapabilities().catch(() => null);
          if (!capabilities?.canSyncResponses) continue;
          const replies = await connector.syncReplies(roleId).catch(() => []);
          if (!replies.length) continue;
          const persisted = await repository.upsertInboundReplies(roleId, replies);
          await repository.emitAudit(roleId, "connector_replies_synced", {
            connectorName,
            receivedCount: replies.length,
            persistedCount: persisted,
          });
        }
        await repository.syncReplies(roleId);
      },
      updateHealth: repository.setRoleHealth,
      alertIfRequired: repository.alertIfRequired,
      emitAudit: repository.emitAudit,
    };

    await runRoleOrchestratorTick(role, deps, connectors, {
      paused: role.orchestratorPaused ?? false,
      rules: readRoleRuleOverrides(role.rulesJson),
    });

    const recommendation = await repository.generateRoleRecommendation(
      role.id,
      "Summarize next best action for role command centre."
    );
    await repository.emitAudit(role.id, "role_recommendation_generated", {
      recommendation,
    });
  }

  return { processed: roles.length };
}
