# Active Search Agent Ops SOP

## Purpose

This SOP defines how Operations runs, monitors, and controls the UPhire IQ Active Search system in production.

Primary standard:

> No live role should sit idle.

---

## 1) Roles and responsibilities

### Ops Admin

- owns environment config, scheduler uptime, and production incident response
- validates migrations and function health after deployments
- controls global rollout and pilot progression

### Recruiter Lead

- monitors role-level health and shortlist velocity
- acts on recommendations for weak/at-risk/stale roles
- approves or adjusts automation settings where policy requires

### CSM / Account Owner

- aligns client-specific rules (cadence, approvals, sourcing intensity)
- monitors client-level KPI outcomes and escalations
- communicates corrective actions and value metrics to client stakeholders

---

## 2) System components (ops view)

- Scheduled orchestrator: `/.netlify/functions/active-search-tick`
- Role status endpoint: `/.netlify/functions/active-search-status?roleId=<id>`
- Role control endpoint: `/.netlify/functions/active-search-role-control`
- Manual role run endpoint: `/.netlify/functions/active-search-run-role`
- Portfolio summary endpoint: `/.netlify/functions/active-search-health-summary`

Data stores monitored:

- `roles`
- `role_candidates`
- `screening_results`
- `shortlist_entries`
- `conversations`
- `role_health_events`
- `audit_events`
- `role_orchestrator_configs`

---

## 3) Pre-go-live checklist (one-time)

- [ ] Supabase migration applied: `supabase/migrations/20260408_active_search_v1.sql`
- [ ] Netlify env vars set:
  - `VITE_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GROK_API_KEY` (plus optional `GROK_API_URL`, `GROK_MODEL`)
  - `ACTIVE_SOURCE_*` (if sourcing is enabled)
- [ ] Scheduled run cadence configured (start at every 10-15 min)
- [ ] First pilot tenant/client selected
- [ ] Alert channel set for failed runs and stale-role spikes
- [ ] Pause/override controls validated by Ops Admin

---

## 4) Daily runbook (Ops Admin + Recruiter Lead)

### Start-of-day (15 minutes)

1. Check scheduler execution health (last 24h).
2. Check portfolio summary:
   - `GET /.netlify/functions/active-search-health-summary`
3. Confirm stale and at-risk counts are within expected threshold.
4. Spot-check 3-5 active roles using status endpoint:
   - `GET /.netlify/functions/active-search-status?roleId=<id>`
5. Verify outreach compliance:
   - no sends to opted-out candidates
   - cadence and max attempts respected

### Mid-day check (10 minutes)

1. Re-check roles marked `at_risk` or `stale`.
2. For urgent roles, trigger single-role run:
   - `POST /.netlify/functions/active-search-run-role`
   - `{"roleId":"<id>"}`
3. If needed, tune automation per role:
   - `POST /.netlify/functions/active-search-role-control`
   - examples:
     - `{"roleId":"<id>","paused":true}`
     - `{"roleId":"<id>","mode":"semi_automated","rulesJson":{"shortlistTarget":7}}`

### End-of-day close (10 minutes)

1. Confirm all stale roles have owner action recorded.
2. Confirm no high-priority role remained untouched beyond SLA.
3. Log daily summary:
   - active roles
   - stale count
   - touched-within-SLA %
   - top 3 intervention actions taken

---

## 5) Weekly SOP (Ops + CSM)

1. Review KPI trend by tenant/client:
   - time to first qualified candidate
   - time to first shortlist
   - outreach response rate
   - stale-role rate
   - interview conversion
2. Review audit sample (10 roles):
   - confirm action traceability and rationale quality
3. Review connector performance:
   - discovery volume
   - import yield
   - reply sync quality
4. Tune rules per client where required:
   - `shortlistTarget`
   - `qualifiedTarget24h`
   - cadence and max outreach attempts
5. Produce commercial value snapshot:
   - role throughput gains
   - recruiter time saved estimate
   - at-risk/stale reduction vs prior baseline

---

## 6) Incident playbooks

### P1: Scheduler stopped / no role activity

Symptoms:

- no recent audit activity
- stale roles increase rapidly

Actions:

1. Check function deployment and scheduler config.
2. Trigger one role manually to validate runtime path.
3. Check env vars and Supabase connectivity.
4. If unresolved in 30 mins, pause outbound automation and escalate engineering.

### P1: Compliance risk (messaging breach)

Symptoms:

- sends observed after opt-out
- cadence/attempt policy violated

Actions:

1. Pause affected role(s) immediately via control endpoint.
2. Export affected audit/conversation records.
3. Notify compliance owner and account owner.
4. Apply corrective rule patch and validate before resuming.

### P2: Source connector degraded

Symptoms:

- search/import failures
- low reply sync rates

Actions:

1. Confirm source credentials and endpoint health.
2. Disable source capability flags temporarily if needed.
3. Continue inbound-only mode and notify Recruiter Lead.
4. Re-enable after verification on pilot role.

---

## 7) Change management

Before changing rules, models, or connector behavior:

1. Apply to pilot tenant first.
2. Observe for minimum 48h.
3. Verify no degradation in stale-role rate or outreach quality.
4. Promote gradually to additional tenants.

Rollback rule:

- any material KPI degradation or compliance risk -> revert to last known-good config and pause affected automation path.

---

## 8) Minimum SLA targets

- Orchestrator run success: >= 99%
- Active roles touched within 1 hour: >= 95%
- Stale-role rate: continuously trending down
- P1 acknowledgement: <= 15 minutes
- P1 mitigation start: <= 30 minutes

---

## 9) Commercial go/no-go criteria

Go for broader rollout only when:

- pilot tenant completes full lifecycle successfully
- stale-role rate improves vs baseline for 2 consecutive weeks
- no unresolved compliance incidents
- Recruiter Lead and CSM sign off on recommendation quality and operational usefulness

No-go if:

- scheduler reliability is unstable
- compliance controls are inconsistent
- source integration quality is unverified

---

## 10) Quick command reference

- Portfolio summary:
  - `GET /.netlify/functions/active-search-health-summary`
- Role status:
  - `GET /.netlify/functions/active-search-status?roleId=<id>`
- Role control:
  - `POST /.netlify/functions/active-search-role-control`
- Manual run:
  - `POST /.netlify/functions/active-search-run-role`

Keep this SOP versioned with release notes when changing automation behavior.
