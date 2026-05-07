# UPhire Production Deploy Checklist

Use this checklist before and after every production deploy.

## 1) Known-Good Netlify Settings

- Repository: `DickyDeas/Builder-cosmos-home-UPhire`
- Branch: `restore/full-system-20260411` (or your approved production branch)
- Base directory: `uphire`
- Build command: `npm run build`
- Publish directory: `dist` (relative to base directory)
- Functions directory: `api` (relative to base directory)

Important:
- Treat `uphire/netlify.toml` as the source of truth.
- Avoid conflicting UI overrides in Netlify build settings.

## 2) Routing Expectations

- App is served under `/app`
- Root `/` redirects to `/app`
- SPA fallback routes `/app/*` to `/app/index.html`
- API routes map to `/.netlify/functions/:splat`

If you see CSS/JS MIME errors, first validate publish path and app asset routing.

## 3) Required Environment Variables

Minimum required:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `ADZUNA_APP_ID`
- `ADZUNA_APP_KEY`
- `GROK_API_KEY`

Optional:
- `GROK_API_URL` (if using a non-default endpoint)

After any env var change, trigger a new deploy.

## 4) Deploy Procedure (Safe)

1. Confirm branch and settings.
2. Trigger **Clear cache and deploy site**.
3. Wait for status: **Site is live**.
4. Test in an incognito window first.

## 5) 2-Minute Smoke Test

Check these URLs:
- `https://<site>/app`
- `https://<site>/api/health`

Then verify network calls in the app:
- `/api/adzuna-proxy`
- `/api/itjobswatch-proxy`
- `/api/grok-proxy`

Expected:
- No 404 HTML for API routes
- JSON responses (200 or controlled 502 for provider failures)

## 6) Demo Data Readiness

For demos, confirm:
- Roles have non-zero candidate and shortlist counts where expected
- Candidate and shortlist counts are consistent
- At least one `Offer Made` candidate exists
- Demo rows have valid tenant/user linkage for visibility

## 7) 60-Second Rollback Playbook

If production looks wrong:
1. Go to Netlify **Deploys**
2. Open the last known good deploy
3. Click **Publish deploy**
4. Verify:
   - `/app` loads correct UI
   - `/api/health` returns JSON

If rollback works on deploy URL but not custom domain, inspect domain mapping.

## 8) Common Failure Signals and Fixes

- Symptom: Old MVP UI appears
  - Likely cause: wrong site/repo/branch/base directory
- Symptom: CSS/JS MIME type `text/html`
  - Likely cause: bad publish root or SPA fallback intercepting asset paths
- Symptom: API 404
  - Likely cause: missing function mapping or wrong functions directory
- Symptom: Data missing in UI but present in DB
  - Likely cause: tenant/profile visibility mismatch or stale frontend data source

