# Active Search Agent - Phase Execution Tracker

This tracker marks implementation status in this repository and the remaining production integration work.

## What is completed in-repo

### Phase 1 foundation (completed)

- [x] Architecture spec created: `docs/ACTIVE_SEARCH_AGENT_IMPLEMENTATION_SPEC.md`
- [x] V1 data model migration scaffold created: `supabase/migrations/20260408_active_search_v1.sql`
- [x] Core orchestration contracts created:
  - `api/_lib/active-search/types.ts`
  - `api/_lib/active-search/rules.ts`
  - `api/_lib/active-search/orchestrator.ts`
- [x] Source connector abstraction created: `api/_lib/active-search/connectors.ts`
- [x] Single import/export barrel created: `api/_lib/active-search/index.ts`
- [x] Orchestrator sweep runner created: `api/_lib/active-search/runner.ts`
- [x] Repository contract + runnable in-memory implementation created: `api/_lib/active-search/repository.ts`
- [x] Scheduled execution entrypoint created: `netlify/functions/active-search-tick.ts`

### Phase 2 scaffolding (completed)

- [x] Source capability contract included in schema and TypeScript interfaces
- [x] Authorization/capability gate helper added (`canRunConnectorActions`)
- [x] Orchestrator flow includes authorized connector iteration + sourcing hook

### Phase 3 scaffolding (completed)

- [x] Rules engine default model implemented
- [x] Health evaluation and adaptive sourcing trigger logic implemented
- [x] Configurable override path provided via `RoleOrchestratorConfig.rules`
- [x] Operations runbook added: `docs/ACTIVE_SEARCH_AGENT_OPERATIONS_RUNBOOK.md`

## Remaining integration tasks (environment-specific)

These tasks depend on external credentials/runtime services and are not blocked by repository structure.

1. Wire Supabase migration execution in deployment pipeline.
2. Replace in-memory repository with production DB-backed repository implementation.
3. Add scheduled runner (Netlify scheduled function, cron worker, or queue worker).
4. Implement at least one real source connector against a licensed API.
5. Add outreach transport adapters (SMS/WhatsApp/email/platform message) with policy checks.
6. Build Role Command Centre UI read models and components.
7. Add admin controls for pause/resume/intensity and mode selection.
8. Add audit feed UI backed by `audit_events`.
9. Add end-to-end tests for role health transitions and escalation.

## Definition of done (all phases)

The Active Search initiative is considered finished when all criteria below are true in production:

- Every new active role is picked up by orchestration without manual trigger.
- Inbound applicants are screened automatically and visible in shortlist buckets.
- At least one approved source can supply candidates to the same workflow.
- Outreach is policy-bounded, auditable, and stoppable per role/client.
- Role health transitions (`healthy`, `weak_pipeline`, `at_risk`, `stale`) are reliable.
- Users can pause/override major automation actions.
- Activity feed provides clear traceability of agent actions.
- No live role can remain untouched beyond the configured stale threshold.
