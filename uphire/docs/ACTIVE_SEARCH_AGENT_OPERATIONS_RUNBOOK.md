# Active Search Agent Operations Runbook

## Objective

Run Active Search continuously so no active role goes cold.

## Runtime entrypoint

- Scheduled function: `netlify/functions/active-search-tick.ts`
- Status endpoint function: `netlify/functions/active-search-status.ts`
- Role control endpoint function: `netlify/functions/active-search-role-control.ts`
- Manual single-role run function: `netlify/functions/active-search-run-role.ts`
- Portfolio health summary function: `netlify/functions/active-search-health-summary.ts`
- Core runner: `api/_lib/active-search/runner.ts`
- Orchestration loop: `api/_lib/active-search/orchestrator.ts`
- Supabase repository (live mode): `api/_lib/active-search/supabase-repository.ts`

## Deployment checklist

1. Run migration:
   - `supabase/migrations/20260408_active_search_v1.sql`
2. Deploy API/function changes.
3. Configure scheduled execution (every 5-15 minutes).
4. Enable at least one authorized source capability record.
5. Validate role health transitions in staging before production enablement.
6. Confirm function is running in Supabase mode (not in-memory fallback).

## Required environment

- Supabase URL and service key for backend/serverless runtime.
- Source credentials for each connected provider.
- Notification provider credentials (email/SMS/etc).
- Grok configuration for AI tasks:
  - `GROK_API_KEY` (required for live AI calls)
  - `GROK_API_URL` (optional override)
  - `GROK_MODEL` (optional model override, default `grok-2-latest`)
- Optional HTTP source connector configuration:
  - `ACTIVE_SOURCE_NAME`
  - `ACTIVE_SOURCE_BASE_URL`
  - `ACTIVE_SOURCE_API_KEY`
  - `ACTIVE_SOURCE_CAN_SEARCH` (`true/false`)
  - `ACTIVE_SOURCE_CAN_IMPORT` (`true/false`)
  - `ACTIVE_SOURCE_CAN_MESSAGE` (`true/false`)
  - `ACTIVE_SOURCE_CAN_SYNC` (`true/false`)
  - `ACTIVE_SOURCE_CAN_VIEW_CONTACTS` (`true/false`)
  - `ACTIVE_SOURCE_RATE_LIMITS_JSON`
  - `ACTIVE_SOURCE_COMPLIANCE_JSON`

## AI provider wiring

- Active Search AI adapter: `api/_lib/active-search/ai.ts`
- Default behavior:
  - If `GROK_API_KEY` exists, Active Search uses Grok provider.
  - If not configured, it falls back to a deterministic placeholder provider.
- Current runner usage:
  - Generates a role-level recommended next action each sweep and logs it to `audit_events`.

## Repository mode selection

`active-search-tick` chooses repository mode automatically:

- **Supabase mode** when both are set:
  - `VITE_SUPABASE_URL`
  - `SUPABASE_SERVICE_ROLE_KEY`
- **In-memory fallback** when one or both are missing (safe for local/dev only).

## Connector registration

- Registry bootstrap: `api/_lib/active-search/connector-registry.ts`
- HTTP source connector: `api/_lib/active-search/connectors.http-source.ts`
- If `ACTIVE_SOURCE_*` vars are missing, no external connectors are registered.

## Schedule recommendation

- High urgency/high volume tenants: every 5 minutes
- Standard tenants: every 10-15 minutes
- Add jitter to avoid synchronized load spikes

## Safety controls

- Honor per-role pause state.
- Honor per-client/source messaging approval requirements.
- Enforce opt-out and message-rate thresholds before send.
- Log every major action in `audit_events`.

## Incident handling

### Symptom: roles not being touched

- Check function execution logs for `active-search-tick`.
- Verify active roles exist with status `active`.
- Verify schedule is enabled and not paused globally.

### Symptom: no sourcing activity

- Verify `source_capabilities.active = true`.
- Verify client authorization and connector access validation.
- Verify rules thresholds are actually breached.

### Symptom: no outreach sent

- Check `requiresHumanApprovalForMessaging` and mode settings.
- Confirm source `can_message_candidates = true`.
- Confirm candidate has not opted out and cadence limits are not exceeded.

### Symptom: incorrect health states

- Validate metric snapshots from `role_health_events`.
- Recompute expected state from configured rules and compare.
- Confirm activity and shortlist timestamps are updated correctly.

## API operations

- Command centre data:
  - `/.netlify/functions/active-search-status?roleId=<role-id>`
- Pause/resume or mode/rules updates:
  - `POST /.netlify/functions/active-search-role-control`
  - Body example:
    - `{"roleId":"<id>","paused":true}`
    - `{"roleId":"<id>","mode":"semi_automated","rulesJson":{"shortlistTarget":7}}`
- Trigger one role immediately:
  - `POST /.netlify/functions/active-search-run-role`
  - Body example:
    - `{"roleId":"<id>"}`
- Portfolio health summary:
  - `GET /.netlify/functions/active-search-health-summary`
  - Optional filter:
    - `GET /.netlify/functions/active-search-health-summary?clientId=<client-id>`

## Go-live sign-off

- [ ] Orchestrator sweep runs on schedule.
- [ ] At least one active role passes full inbound -> screen -> shortlist cycle.
- [ ] At least one role performs sourcing with approved connector.
- [ ] At least one outreach send and one response sync are visible.
- [ ] Role health transitions are visible and auditable.
- [ ] Pause/override controls verified by operations user.
