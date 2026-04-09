import { RoleHealthState, RoleMetrics, RoleRulesConfig } from "./types";

export const DEFAULT_ROLE_RULES: RoleRulesConfig = {
  shortlistTarget: 5,
  qualifiedTarget24h: 5,
  atRiskNoActivityHours: 48,
  staleNoShortlistUpdateHours: 72,
  responseRateFloorPercent: 10,
  maxOutreachAttemptsPerCandidate: 3,
  outreachCadenceHours: [0, 24, 72],
  requiresHumanApprovalForMessaging: false,
};

export function evaluateRoleHealth(metrics: RoleMetrics, rules: RoleRulesConfig): RoleHealthState {
  if (metrics.hoursSinceShortlistUpdate >= rules.staleNoShortlistUpdateHours) {
    return "stale";
  }

  if (metrics.hoursSinceCandidateActivity >= rules.atRiskNoActivityHours) {
    return "at_risk";
  }

  if (metrics.qualifiedApplications < rules.qualifiedTarget24h && metrics.hoursSinceRoleCreation >= 24) {
    return "weak_pipeline";
  }

  if (metrics.shortlistSize >= rules.shortlistTarget) {
    return "healthy";
  }

  if (
    metrics.sourcedCandidatesContacted > 0 &&
    metrics.outreachResponseRatePercent < rules.responseRateFloorPercent
  ) {
    return "at_risk";
  }

  return "weak_pipeline";
}

export function needsExtraSourcing(metrics: RoleMetrics, rules: RoleRulesConfig): boolean {
  const qualifiedBelowTarget = metrics.qualifiedApplications < rules.qualifiedTarget24h;
  const shortlistBelowTarget = metrics.shortlistSize < rules.shortlistTarget;
  return qualifiedBelowTarget || shortlistBelowTarget;
}
