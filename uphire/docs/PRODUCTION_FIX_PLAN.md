# Production fix plan — API 404 + Supabase 500

Work in order. **Phase A** fixes `/api/*` and Market Intelligence. **Phase B** fixes database/API errors. **Phase C** verifies.

---

## Phase A — Same origin for SPA and `/api/*` (Netlify + marketing)

| Step | Owner | Action |
|------|--------|--------|
| A1 | Developer | Ensure every user hits the **app** deploy: **https://uphiresystem.netlify.app/app** (or custom domain attached to **that** Netlify site). |
| A2 | Marketing / Netlify | **Access Platform** link = absolute URL above (not `/app` on `uphireiq.com` unless that host serves the app build). |
| A3 | Netlify (marketing site) | Optional: add redirects so `https://uphireiq.com/app` → `https://uphiresystem.netlify.app/app` (preserve path). Copy from `MARKETING_NETLIFY_REDIRECTS.example` in this folder. |
| A4 | Netlify (app site **uphiresystem**) | Confirm env: `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `GROK_API_KEY`, all `VITE_*` used at build time. **Redeploy** after changes. |
| A5 | Build (only if app must stay on `uphireiq.com` for URLs) | Set `VITE_API_ORIGIN=https://uphiresystem.netlify.app` and deploy a **new** SPA build to the host users use; then `/api` calls cross-origin to working functions. |

**Done when:** Browser on app URL shows Network → `/api/health` = **200 JSON**.

---

## Phase B — Supabase 500 (`roles`, `candidates`, `tenant_users`, `documents`)

| Step | Owner | Action |
|------|--------|--------|
| B1 | Supabase | **Dashboard → Logs → Postgres** (and **API**): reproduce error; read message (often RLS, missing function, or type error). |
| B2 | Supabase | Confirm project **not paused**; **Settings → API** URL matches app `VITE_SUPABASE_URL`. |
| B3 | Supabase SQL | Verify helpers exist: `SELECT is_uphire_staff();` — policies in migration `024` use `is_uphire_staff()`, `tenant_id`, `tenant_users`. If a migration was skipped, run pending migrations (`npm run migrate` with `DATABASE_URL`). |
| B4 | Supabase | **Table editor:** confirm `roles.tenant_id`, `tenant_users` rows for your admin `user_id`. |
| B5 | If 500 persists | Temporarily **disable RLS** on one table in a dev branch to isolate (re-enable after); or fix policy per log hint. |

**Done when:** Same requests return **200** and data in DevTools (not 500).

---

## Phase C — Verification

- [ ] Log in on **app URL** (Phase A).
- [ ] **Market Intelligence** search → `/api/adzuna-proxy` not 404.
- [ ] **Roles / candidates** load without 500.
- [ ] **Optional:** `SMOKE_BASE_URL=https://uphiresystem.netlify.app npm run smoke:api` from `uphire/`.

---

## What repo / IDE changes already cover (no duplicate work)

- `apiUrl()` + optional `VITE_API_ORIGIN`
- Safe JSON parsing for Grok + role flags + `useIsStaff` (after deploy)
- Operator checklists: `OPERATOR_HANDOFF_TASKS.md`, `AGENT_TASK_PROMPT.md`, `AGENT_PROMPT_ACCESS_PLATFORM_OPTION2.md`

---

## Summary

| Symptom | Primary fix |
|---------|-------------|
| `/api/*` **404**, HTML in responses | **Phase A** — wrong Netlify host for SPA. |
| **Supabase 500** | **Phase B** — logs + RLS/schema/migrations. |

Both can be true at once; fix **A** first so Market Intel works, then **B** so data loads.
