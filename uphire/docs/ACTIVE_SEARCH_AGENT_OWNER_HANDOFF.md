# Active Search Owner Handoff

This is the final handoff split between actions the AI agent can do in code and actions only the owner/team can do in external systems.

## A) Actions already handled by AI (in repository)

- Active Search schema and migration scaffold
- Orchestrator loop, rules engine, and role health logic
- Grok AI provider integration (with fallback)
- Source connector abstraction and HTTP connector implementation
- Supabase-backed repository with screening/scoring/shortlist persistence
- Outreach and reply processing paths with opt-out/cadence controls
- Operational Netlify endpoints:
  - `active-search-tick`
  - `active-search-status`
  - `active-search-role-control`
  - `active-search-run-role`
  - `active-search-health-summary`
- Ops runbook, SOP, commercial readiness checklists

## B) Actions owner/team must complete (external systems)

1. Netlify setup
- Set base directory/build settings to deploy `uphire`.
- Set all production environment variables.
- Enable scheduler for `active-search-tick`.

2. Supabase setup
- Execute migration SQL in your live Supabase project.
- Confirm RLS policies are production-safe (tenant/client scoped).
- Validate indexes and constraints are present.

3. Real source integration
- Provide valid source API endpoint and credentials.
- Confirm source policy/licensing permissions.
- Validate connector endpoints return expected payloads.

4. Operational launch
- Configure alerts and on-call response.
- Run pilot with one tenant/client.
- Track KPI deltas for 2+ weeks.

5. Commercial rollout
- Approve go/no-go criteria.
- Expand gradually from pilot to broader tenant set.

## C) Final verification sequence (owner-run)

1. `GET /.netlify/functions/active-search-health-summary` returns `ok: true`.
2. `POST /.netlify/functions/active-search-run-role` with a live role ID processes role.
3. `GET /.netlify/functions/active-search-status?roleId=<id>` returns role metrics + recommendation.
4. `POST /.netlify/functions/active-search-role-control` successfully pauses/resumes a role.
5. Audit records update in DB (`audit_events`, `role_health_events`, `conversations`, `screening_results`).

If all five checks pass in production, the system is operationally ready for controlled rollout.
