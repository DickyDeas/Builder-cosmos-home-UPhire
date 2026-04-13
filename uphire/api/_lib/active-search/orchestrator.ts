import { SourceConnectorRegistry } from "./connectors";
import { DEFAULT_ROLE_RULES, evaluateRoleHealth, needsExtraSourcing } from "./rules";
import { OrchestratorDeps, Role, RoleRulesConfig } from "./types";

export interface RoleOrchestratorConfig {
  rules?: Partial<RoleRulesConfig>;
  paused?: boolean;
}

function mergeRules(overrides?: Partial<RoleRulesConfig>): RoleRulesConfig {
  return {
    ...DEFAULT_ROLE_RULES,
    ...(overrides ?? {}),
  };
}

export async function runRoleOrchestratorTick(
  role: Role,
  deps: OrchestratorDeps,
  connectors: SourceConnectorRegistry,
  config?: RoleOrchestratorConfig
): Promise<void> {
  if (role.status !== "active" || config?.paused) {
    return;
  }

  const rules = mergeRules(config?.rules);

  await deps.ingestInbound(role.id);
  await deps.screenUnscreened(role.id);
  await deps.scoreCandidates(role.id);
  await deps.refreshShortlist(role.id);

  const metrics = await deps.getRoleMetrics(role.id);
  const health = evaluateRoleHealth(metrics, rules);
  await deps.updateHealth(role.id, health, "Periodic role orchestration tick", metrics);

  if (needsExtraSourcing(metrics, rules)) {
    const connectorNames = await deps.getAuthorizedConnectorNames(role.clientId);
    for (const name of connectorNames) {
      const connector = connectors.get(name);
      if (!connector) continue;
      await deps.runSourcing(role.id, connector.name);
    }
  }

  if (!rules.requiresHumanApprovalForMessaging) {
    await deps.runOutreach(role.id);
  }

  await deps.syncReplies(role.id);
  await deps.alertIfRequired(role.id, health);
  await deps.emitAudit(role.id, "role_orchestrator_tick_completed", {
    health,
    rulesApplied: rules,
  });
}
