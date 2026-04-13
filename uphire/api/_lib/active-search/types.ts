export type RoleHealthState =
  | "healthy"
  | "weak_pipeline"
  | "at_risk"
  | "stale"
  | "paused"
  | "escalated";

export type RoleCandidateStage =
  | "new"
  | "screening"
  | "qualified"
  | "borderline"
  | "rejected"
  | "shortlisted"
  | "interviewing";

export type KnockoutStatus = "pending" | "pass" | "fail";

export type ShortlistBucket = "qualified" | "borderline" | "rejected";

export interface Role {
  id: string;
  clientId: string;
  status: "draft" | "active" | "paused" | "closed" | "filled";
  healthState: RoleHealthState;
  title: string;
  location?: string;
  createdAt: string;
}

export interface RoleMetrics {
  totalApplications: number;
  qualifiedApplications: number;
  sourcedCandidatesContacted: number;
  outreachResponseRatePercent: number;
  shortlistSize: number;
  hoursSinceCandidateActivity: number;
  hoursSinceRoleCreation: number;
  hoursSinceShortlistUpdate: number;
}

export interface RoleRulesConfig {
  shortlistTarget: number;
  qualifiedTarget24h: number;
  atRiskNoActivityHours: number;
  staleNoShortlistUpdateHours: number;
  responseRateFloorPercent: number;
  maxOutreachAttemptsPerCandidate: number;
  outreachCadenceHours: number[];
  requiresHumanApprovalForMessaging: boolean;
}

export interface CandidateScreeningResult {
  knockoutStatus: KnockoutStatus;
  weightedFitScore: number;
  strengthsSummary: string;
  concernsSummary: string;
  recommendedNextStep: string;
  rationaleText: string;
  confidenceScore: number;
}

export interface AiMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AiGenerateRequest {
  task:
    | "job_spec_normalization"
    | "jd_refinement"
    | "screening_questions"
    | "candidate_screening_summary"
    | "outreach_draft"
    | "reply_classification"
    | "fit_rationale";
  messages: AiMessage[];
  temperature?: number;
  maxTokens?: number;
}

export interface AiGenerateResponse {
  text: string;
  model: string;
}

export interface AiProvider {
  generate: (request: AiGenerateRequest) => Promise<AiGenerateResponse>;
}

export interface SourceCapabilities {
  sourceName: string;
  canSearchProfiles: boolean;
  canImportProfiles: boolean;
  canMessageCandidates: boolean;
  canSyncResponses: boolean;
  canViewContactDetails: boolean;
  rateLimits: Record<string, unknown>;
  complianceRules: Record<string, unknown>;
}

export interface SourcedCandidateProfile {
  sourceRef: string;
  fullName: string;
  email?: string;
  phone?: string;
  location?: string;
  profile: Record<string, unknown>;
}

export interface RoleSpec {
  title: string;
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  contractType?: string;
  shiftPattern?: string;
  mustHaves: string[];
  dealBreakers: string[];
}

export interface OrchestratorDeps {
  ingestInbound: (roleId: string) => Promise<void>;
  screenUnscreened: (roleId: string) => Promise<void>;
  scoreCandidates: (roleId: string) => Promise<void>;
  refreshShortlist: (roleId: string) => Promise<void>;
  getRoleMetrics: (roleId: string) => Promise<RoleMetrics>;
  getAuthorizedConnectorNames: (clientId: string) => Promise<string[]>;
  runSourcing: (roleId: string, connectorName: string) => Promise<void>;
  runOutreach: (roleId: string) => Promise<void>;
  syncReplies: (roleId: string) => Promise<void>;
  updateHealth: (roleId: string, state: RoleHealthState, reason: string, metrics: RoleMetrics) => Promise<void>;
  alertIfRequired: (roleId: string, health: RoleHealthState) => Promise<void>;
  emitAudit: (roleId: string, action: string, payload: Record<string, unknown>) => Promise<void>;
}
