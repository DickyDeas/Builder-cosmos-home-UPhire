# ChatGPT Agent Automation Runbook

## Purpose

Use this runbook when a ChatGPT agent has authenticated access to:

- GitHub repository
- Netlify site
- Supabase project

Goal: complete deployment and operational activation of Active Search with minimal human intervention.

---

## 1) Required permissions for the agent

### GitHub

- read/write repository contents
- create branches and PRs
- merge PRs
- view workflow/check statuses

### Netlify

- read/update site settings
- read/update environment variables
- trigger deployments
- configure scheduled functions
- read functions/deploy logs

### Supabase

- run SQL migrations
- manage tables/indexes/policies
- read project logs

---

## 2) Inputs the human must provide once

- `GITHUB_REPO` (owner/repo)
- `GITHUB_BASE_BRANCH` (usually `main`)
- `NETLIFY_SITE_ID` or site URL
- `SUPABASE_PROJECT_REF`
- Required secrets/keys:
  - `VITE_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `GROK_API_KEY`
  - optional: `GROK_API_URL`, `GROK_MODEL`
  - source integration: `ACTIVE_SOURCE_*`

---

## 3) End-to-end automated workflow

## Phase A: Repository + code readiness

1. Pull latest base branch.
2. Verify files exist:
   - `supabase/migrations/20260408_active_search_v1.sql`
   - `api/_lib/active-search/*`
   - `netlify/functions/active-search-*.ts`
3. Run static checks/lint where available.
4. If fixes are needed, create branch, commit, open PR, merge after checks pass.

Success criteria:

- no lint/type errors
- branch merged into base

---

## Phase B: Supabase migration + validation

1. Execute migration SQL:
   - `supabase/migrations/20260408_active_search_v1.sql`
2. Verify schema objects exist:
   - tables: `roles`, `job_specs`, `candidates`, `role_candidates`, `conversations`, `screening_results`, `shortlist_entries`, `role_health_events`, `audit_events`, `source_capabilities`, `role_orchestrator_configs`
   - indexes/uniques from migration
3. Verify outreach columns in `role_candidates`:
   - `outreach_attempts`
   - `outreach_opt_out`
   - `last_outreach_at`
4. Verify RLS enabled on all required tables.

Success criteria:

- migration applied without errors
- expected schema + indexes present

---

## Phase C: Netlify environment + deploy

1. Set/update environment variables on target site:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `GROK_API_KEY`
   - optional Grok/source vars
2. Trigger clean deploy.
3. Verify function detection for:
   - `active-search-tick`
   - `active-search-status`
   - `active-search-role-control`
   - `active-search-run-role`
   - `active-search-health-summary`
4. Configure scheduler for `active-search-tick` (start every 10-15 minutes).

Success criteria:

- deploy status green
- all required functions visible
- scheduler active

---

## Phase D: Smoke tests

Run and validate:

1. `GET /.netlify/functions/active-search-health-summary`
   - expect `ok: true`
2. `POST /.netlify/functions/active-search-run-role` with live role ID
   - expect `ok: true`
3. `GET /.netlify/functions/active-search-status?roleId=<id>`
   - expect role metrics + recommendation payload
4. `POST /.netlify/functions/active-search-role-control`
   - pause/unpause or mode update should return `ok: true`
5. Confirm DB writes appear in:
   - `audit_events`
   - `role_health_events`
   - `conversations`
   - `screening_results`

Success criteria:

- all endpoints pass
- expected records written

---

## Phase E: Pilot activation

1. Select one pilot tenant/client and a controlled role set.
2. Let orchestrator run for minimum 7-14 days.
3. Capture KPI trend:
   - time to first qualified candidate
   - time to first shortlist
   - outreach response rate
   - stale-role rate
   - roles touched within SLA
4. Tune `rulesJson` per role/client if needed through control endpoint.

Success criteria:

- measurable stale-role reduction
- stable operational behavior

---

## 4) Agent command template (for ChatGPT)

Use this exact instruction block in ChatGPT when connected to tools:

```text
You are the deployment operator for UPhire Active Search.

Execute these phases in order and do not stop unless blocked:
1) Validate repo readiness and fix any lint/build blockers.
2) Apply Supabase migration `20260408_active_search_v1.sql`.
3) Set required Netlify env vars and trigger a fresh deploy.
4) Ensure functions exist:
   - active-search-tick
   - active-search-status
   - active-search-role-control
   - active-search-run-role
   - active-search-health-summary
5) Configure scheduler for active-search-tick (10-15 min).
6) Run smoke tests against all endpoints.
7) Produce a final readiness report with:
   - pass/fail per phase
   - blocking issues
   - exact remedial actions

If any step fails, attempt one automatic fix and retry once.
If still failing, continue remaining non-blocked steps and report exact blocker.
```

---

## 5) Rollback procedure

If production instability occurs:

1. Pause impacted role automation:
   - `POST active-search-role-control` with `paused: true`
2. Disable scheduler temporarily.
3. Roll back to previous deploy in Netlify.
4. Revert latest DB changes only if required and validated.
5. Keep audit logs for incident review.

---

## 6) Human approval gates (must remain human)

- legal/compliance approval on messaging policy
- final go/no-go for general rollout
- commercial commitment and SLA sign-off

---

## 7) Final deliverable from agent

Agent should output:

- deployment summary by phase
- endpoint test results
- schema verification results
- known risks
- recommendation: `GO` or `NO-GO` with reasons
