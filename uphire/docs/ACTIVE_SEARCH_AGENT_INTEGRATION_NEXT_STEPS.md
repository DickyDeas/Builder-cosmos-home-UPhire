# Active Search Integration Next Steps

This checklist maps your existing integrations into the new Active Search runtime.

## 1) Grok integration hardening

- [ ] Confirm `GROK_API_KEY` is set in production runtime.
- [ ] Optionally set `GROK_MODEL` and `GROK_API_URL`.
- [ ] Add retry + timeout controls in `api/_lib/active-search/ai.ts` if required by SLA.
- [ ] Add prompt templates per task type (`jd_refinement`, `screening`, `outreach_draft`).

## 2) Source connector binding

- [ ] Point `ACTIVE_SOURCE_BASE_URL` to your approved source integration API.
- [ ] Set `ACTIVE_SOURCE_NAME` and `ACTIVE_SOURCE_API_KEY`.
- [ ] Confirm external API supports these endpoints:
  - `POST /validate-access`
  - `POST /search`
  - `POST /import`
  - `POST /message` (if messaging supported)
  - `GET /replies?roleId=...` (if reply sync supported)
- [ ] Set `ACTIVE_SOURCE_CAN_*` capability vars to match licence/policy reality.

## 3) Data persistence completion

- [x] Replace core audit-only stubs in `SupabaseActiveSearchRepository` with screening/scoring/shortlist writes.
- [x] Implement dedupe fingerprint generation and upsert into `role_candidates` for sourced import path.
- [x] Store outreach/replies handling paths in `conversations`.
- [x] Store screening outputs in `screening_results`.

## 4) Role Command Centre wiring

- [ ] Build role dashboard read model endpoint from `roles`, `role_candidates`, `role_health_events`, `audit_events`.
- [ ] Render recommendation text generated each sweep.
- [ ] Expose pause/resume/intensity controls through `role_orchestrator_configs`.

## 5) Launch readiness

- [ ] Schedule `active-search-tick` at 5-15 min cadence.
- [ ] Run one pilot tenant/client with controlled permissions.
- [ ] Validate health transitions and stale escalations over 7 days.
- [ ] Enable additional connector capabilities gradually.

## 6) Current repo completion status

- Active Search loop now covers: role polling, screening, scoring, shortlist refresh, sourcing import, outreach logging, reply classification, health updates, recommendations, and audit trail writes.
- Active Search ops endpoints now cover status, role control, and manual single-role execution.
- Remaining work is environment/runtime dependent: real source endpoint contracts, credentials, production scheduler settings, UI exposure, and pilot-go-live validation.
