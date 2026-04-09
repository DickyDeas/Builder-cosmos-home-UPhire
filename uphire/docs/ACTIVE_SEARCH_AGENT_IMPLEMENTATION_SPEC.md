# UPhire IQ Active Search

## Implementation Spec (V1)

**Status:** Ready for implementation  
**Purpose:** Add Active Search as an orchestration extension of the existing role workflow.

---

## 1. Product Outcome

Every live role is continuously worked until filled through:

- inbound applicant screening
- connected-source sourcing (where authorized)
- policy-bounded outreach
- continuous shortlist refresh
- role health monitoring and anti-stale escalation

This is implemented as a deterministic workflow system, not a standalone chatbot.

---

## 2. Scope Boundaries

### In scope (V1)

- role intake and normalized job spec generation
- JD drafting/refinement and advert publishing trigger
- inbound application ingestion + AI-assisted screening
- one-source connector end-to-end (search/import/message where allowed)
- sourced + inbound unified shortlist
- role health states, alerts, and escalation
- human approval controls and full audit feed

### Out of scope (V1)

- autonomous hiring decisioning
- compensation negotiation, offer, and contract lifecycle
- unsupported scraping-based automation as a hard dependency
- opaque AI-only state transitions with no structured persistence

---

## 3. Core Architecture

### 3.1 Control plane

One `role_orchestrator` loop per active role runs every 5-15 minutes:

1. ingest inbound updates
2. screen unscreened candidates
3. score and re-rank
4. refresh shortlist
5. evaluate role health
6. trigger sourcing if thresholds fail
7. send outreach where policy allows
8. sync replies and continue screening
9. emit alerts and audit events

### 3.2 Service boundaries

Use explicit service contracts. Suggested modules:

- `role_service`
- `job_spec_service`
- `publishing_service`
- `candidate_service`
- `source_connector_service`
- `outreach_service`
- `screening_service`
- `scoring_service`
- `shortlist_service`
- `role_health_service`
- `notification_service`
- `audit_service`

### 3.3 AI usage policy

AI may generate and classify content but cannot be source-of-truth for:

- permissions
- source capabilities
- final workflow state
- compliance/audit records

All AI outputs must be versioned and stored as structured artifacts.

---

## 4. Data Model (Minimum V1)

Use the following core tables and enforce tenant scoping + RLS:

- `roles`
- `job_specs`
- `candidates`
- `role_candidates`
- `conversations`
- `screening_results`
- `shortlist_entries`
- `role_health_events`
- `audit_events`
- `source_capabilities`

### Required enum-like states

- `roles.status`: `draft | active | paused | closed | filled`
- `roles.health_state`: `healthy | weak_pipeline | at_risk | stale | paused | escalated`
- `role_candidates.stage`: `new | screening | qualified | borderline | rejected | shortlisted | interviewing`
- `role_candidates.knockout_status`: `pending | pass | fail`
- `shortlist_entries.shortlist_bucket`: `qualified | borderline | rejected`

### Indexing essentials

- `role_candidates(role_id, updated_at desc)`
- `role_candidates(role_id, fit_score desc)`
- `screening_results(role_candidate_id, created_at desc)`
- `conversations(role_candidate_id, created_at desc)`
- `role_health_events(role_id, created_at desc)`
- unique dedupe key on role candidate identity fingerprint (email/phone/source_ref strategy)

---

## 5. Connector Capability Contract

Each source connector must expose:

- `searchCandidates(roleSpec, filters)`
- `importCandidate(sourceRef)`
- `sendMessage(candidateRef, message)`
- `syncReplies(roleId)`
- `getCapabilities()`
- `validateAccess(clientId)`

Persist per-source capability flags:

- `can_search_profiles`
- `can_import_profiles`
- `can_message_candidates`
- `can_sync_responses`
- `can_view_contact_details`
- `rate_limit_json`
- `policy_json`

The orchestrator must check capability and client entitlement before each source action.

---

## 6. Rules Engine (Configurable)

Store client-level rules in DB config (JSON) with defaults by sector.

### Example default config

```json
{
  "shortlist_target": 5,
  "qualified_target_24h": 5,
  "at_risk_no_activity_hours": 48,
  "stale_no_shortlist_update_hours": 72,
  "response_rate_floor_percent": 10,
  "max_outreach_attempts_per_candidate": 3,
  "outreach_cadence_hours": [0, 24, 72],
  "requires_human_approval_for_messaging": false
}
```

### Rule examples

- If qualified count < target after 24h, widen source search.
- If response rate < floor after 2 cycles, recommend JD/outreach refinement.
- If no meaningful candidate activity for threshold window, mark `at_risk`.
- If no shortlist update for threshold window, mark `stale` and notify owner.

---

## 7. Orchestrator Decision Logic

### 7.1 Role initialization

- On role activation, create `job_spec`, screening profile, and orchestration record.
- Trigger advert publish via existing flow.
- Trigger initial source search if source is connected and enabled.
- Emit audit event chain.

### 7.2 Periodic loop pseudocode

```text
for role in active_roles:
  ingestInbound(role)
  screenUnscreened(role)
  scoreCandidates(role)
  refreshShortlist(role)

  health = evaluateHealth(role.metrics)
  persistHealth(role, health)

  if needsMoreQualifiedCandidates(role, health):
    for source in authorizedSources(role.client_id):
      if source.can_search_profiles and accessValid(source, role.client_id):
        candidates = source.searchCandidates(role.spec, role.filters)
        importAndDedupe(role, candidates)

  if outreachAllowed(role):
    sendOutreachForEligibleCandidates(role)

  syncSourceReplies(role)
  classifyRepliesAndRescreen(role)

  maybeEscalate(role, health)
  emitAuditSummary(role)
```

### 7.3 Human-in-the-loop gates

Require approval where configured for:

- outbound messaging on sensitive sources
- rejection pathways requiring manual review
- final shortlist progression policies
- client/source automation mode changes

---

## 8. Screening + Scoring Standard

Screen both inbound and sourced candidate responses using one pipeline.

For each candidate, persist:

- `knockout_pass_fail`
- `weighted_fit_score`
- `strengths_summary`
- `concerns_summary`
- `recommended_next_step`
- `rationale_text`
- `confidence_score`

Scoring must expose reason codes (not just one opaque number).

---

## 9. Role Command Centre (UI)

Evolve Search into a role-centric command centre.

### Required panels

- Overview
- Applicants
- Sourced
- Screening
- Shortlist
- Activity Log
- Settings

### Required role-level widgets

- role summary + current JD + advert status
- inbound count, qualified count, sourced count
- outreach response rate
- shortlist size and freshness
- current health state
- recommended next action
- live activity feed

### Candidate card contract

- candidate name
- source
- fit score
- screening status
- availability
- pay alignment
- location fit
- rationale snippet
- last contact event
- next recommended action

---

## 10. Notifications and Escalation

Notify role owners when:

- inbound is weak
- outreach underperforms
- shortlist reaches target readiness
- role is at risk or stale
- human intervention is required

Escalation reasons must be explicit and auditable.

---

## 11. Compliance and Safety

Mandatory controls:

- tenant-aware RBAC + RLS
- source-level permissions and policy checks
- per-role and per-client kill switch
- opt-out and communication preference enforcement
- immutable audit event logging for every major action

No outbound message is sent without passing:

1. source capability check
2. client entitlement check
3. policy/rate-limit check
4. approval check (if required by mode)

---

## 12. API/Event Contract (Suggested)

### Internal commands

- `RoleActivated`
- `AdvertPublished`
- `InboundApplicationReceived`
- `CandidateScreeningRequested`
- `CandidateScreeningCompleted`
- `ShortlistRefreshed`
- `RoleHealthEvaluated`
- `SourcingRunRequested`
- `OutreachRunRequested`
- `OutreachMessageSent`
- `SourceReplySynced`
- `RoleEscalated`

### Read models for UI

- `GET /roles/:roleId/command-centre`
- `GET /roles/:roleId/candidates?pool=inbound|sourced|all`
- `GET /roles/:roleId/shortlist`
- `GET /roles/:roleId/activity-feed`
- `GET /roles/:roleId/health`
- `POST /roles/:roleId/pause-agent`
- `POST /roles/:roleId/resume-agent`
- `POST /roles/:roleId/adjust-intensity`

---

## 13. Delivery Plan

### Phase 1 (inbound-first momentum)

- structured role intake + job spec persistence
- JD workflow integration + advert trigger
- inbound ingestion + screening pipeline
- shortlist engine + health scoring + stale alerts
- command centre overview + activity feed

### Phase 2 (connected sourcing)

- source connector abstraction
- one approved connector end-to-end
- import + dedupe + outreach + response sync
- unified inbound + sourced ranking

### Phase 3 (adaptive optimization)

- dynamic sourcing intensity
- recommendation engine tuning
- channel/source optimization
- sector rule presets

---

## 14. V1 Acceptance Checklist

- [ ] Role can be created with structured job spec and JD.
- [ ] Existing publishing flow is triggered and tracked.
- [ ] Inbound applications ingest automatically.
- [ ] New applicants screen automatically.
- [ ] Shortlist is auto-generated and continuously refreshed.
- [ ] Role health updates continuously and marks weak/stale reliably.
- [ ] At least one authorized source supports search/import.
- [ ] Outreach is sent only where capability and policy allow.
- [ ] Sourced and inbound candidates share one workflow.
- [ ] All orchestrator actions appear in visible activity log.
- [ ] Users can pause/override/approve key automation actions.

---

## 15. Build Order (Engineering)

1. schema + enums + indexes + RLS updates
2. orchestrator loop + scheduling framework
3. intake/JD/publishing integration points
4. inbound ingestion + screening/scoring + shortlist
5. role health engine + anti-stale logic
6. command centre read model + UI panels
7. first source connector (full lifecycle)
8. outreach + reply sync + escalation
9. hardening (audit, approvals, rate limits, kill switches)

Primary standard: no live role should sit idle.
