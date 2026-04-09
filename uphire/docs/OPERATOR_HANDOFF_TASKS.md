# Operator handoff — tasks that must be done outside the codebase

**Non-technical step-by-step:** see **`SIMPLE_STEPS_NETLIFY_AND_APP.md`** in this folder first.

Use this list with a human or another AI agent that has access to **GitHub**, **Netlify**, **Supabase**, and **DNS**. The development environment (Cursor/IDE) cannot log into these services.

---

## 1. Netlify — site that serves **uphireiq.com** (or your production domain)

### 1.1 Confirm which Git repository is connected

- [ ] Open **Netlify → Site → Site settings → Build & deploy → Continuous deployment**.
- [ ] Record: **Repository** name (e.g. `DickyDeas/UPHire-20IQ-20Website` vs `DickyDeas/Builder-cosmos-home-UPhire`).
- [ ] Record: **Branch** (e.g. `main`).
- [ ] **Decision:** The UPhire **Vite app** + **`api/*.js`** functions must come from a deploy that **includes** the `uphire/` folder with `netlify.toml` and `api/`. If the connected repo is **only** the marketing site with no `uphire/` build, either:
  - **Option A:** Change the connected repo/branch to one that contains the full `uphire` app, **or**
  - **Option B:** Add a **second Netlify site** for the UPhire app and point **Access Platform** to that site’s URL (see section 5).

### 1.2 Build settings (critical)

For the site that builds the **UPhire** app, set (if `netlify.toml` lives in `uphire/`):

| Setting | Typical value |
|---------|----------------|
| **Base directory** | `uphire` |
| **Build command** | `npm run build` |
| **Publish directory** | `dist` (relative to base) |

- [ ] Verify **Functions** are detected: **Site → Functions** should list `health`, `adzuna-proxy`, `grok-proxy`, `itjobswatch-proxy`, etc., after a successful deploy.
- [ ] If **Functions** is empty, the **base directory** or **repo** is wrong, or the build failed.

### 1.3 Environment variables (Netlify UI)

- [ ] **Site → Environment variables:** ensure production has at least:

  - `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
  - `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` (for market intel; can be server-only names if your build injects them — match what `api/adzuna-proxy.js` reads)
  - `GROK_API_KEY` (and `GROK_API_URL` if non-default)
  - `EMAIL_SERVICE_API_KEY`, `EMAIL_SERVICE_URL`, `FROM_EMAIL` (if email is used)
  - `VITE_APP_URL` = `https://uphireiq.com/app` (or your real app URL)
  - `VITE_APPLY_BASE_URL` = site origin used for apply API (often `https://uphireiq.com`)

- [ ] **Redeploy** after changing variables (Deploys → Trigger deploy).

### 1.4 Custom domain

- [ ] **Domain management:** confirm **uphireiq.com** (and **www** if used) is attached to the **same** Netlify site that serves the **UPhire app** at `/app` and **`/api/*`**.
- [ ] If marketing and app are **two** Netlify sites, document which hostname serves **which** and set the **Access Platform** button to the app URL (section 5).

### 1.5 Smoke test (browser or curl)

- [ ] `GET https://<your-production-domain>/api/health` → expect JSON like `{"status":"ok",...}` **not** HTML error page **not** “Cannot find module 'express'”.
- [ ] If you see **Express** or **api.js** errors, the deployed **functions bundle** does not match the **UPhire** repo’s plain `api/*.js` handlers — fix repo/build (section 1.1–1.2).

---

## 2. GitHub — repository alignment

- [ ] Confirm **which** repo contains **`uphire/package.json`**, **`uphire/netlify.toml`**, and **`uphire/api/*.js`** at the commit you intend to ship.
- [ ] If **two repos** exist (e.g. **Website** vs **Builder-cosmos-home-UPhire**), decide:
  - **Merge** app into the website repo’s deploy pipeline, **or**
  - **Two sites:** marketing repo + app repo with separate URLs.
- [ ] Ensure **`main`/`master`** branch policies allow merges and that production tracks the intended commit.

*(Automated agents cannot push without credentials — a human must approve merges/PRs.)*

---

## 3. Supabase

- [ ] Project is **not paused**.
- [ ] **Authentication → URL configuration:** add site URL `https://uphireiq.com` and redirect URLs including `https://uphireiq.com/app/**` and login callback paths as required by Supabase docs.
- [ ] **API keys** in Netlify match this project (anon + service role only where needed for serverless).
- [ ] **Optional:** run SQL migrations from the app repo: set `DATABASE_URL` in a **secure** environment (CI or local with `.env`), run `npm run migrate` from `uphire/` — **never** commit `DATABASE_URL` to Git.

---

## 4. DNS / hosting outside Netlify

- [ ] If **Cloudflare**, **Builder**, or another layer sits in front of Netlify, confirm it does **not** override **`/api/*`** to a broken or Express-based handler. The **Express** error seen on `/api/health` suggests a **wrong function** or **wrong site** — fix routing so `/api/*` hits Netlify Functions from the **UPhire** build.

---

## 5. Marketing website — “Access Platform” button

- [ ] Button label can stay **Access Platform**.
- [ ] **href** must target the live app:
  - Same host: `/app` or `https://uphireiq.com/app`
  - Different host: full URL of the Netlify app site (e.g. `https://xxxx.netlify.app/app` until custom domain is wired).
- [ ] **No code change in IDE is required** for the button to “work” — only correct **URL** + **deploy** behind it.

Reference in repo: `uphire/SUBPATH_INTEGRATION.md`.

---

## 6. Post-fix verification checklist

- [ ] Log in at `https://uphireiq.com/app` (or your app URL).
- [ ] Open **Market Intelligence**, run a search — note whether live sources load or “estimated” fallback (fallback is OK if keys missing; **404** on `/api/*` is not OK).
- [ ] Open DevTools **Network**: `/api/adzuna-proxy`, `/api/grok-proxy` return **200** or **502 JSON**, not **404 HTML**.
- [ ] Optional: from `uphire/` run `SMOKE_BASE_URL=https://uphireiq.com npm run smoke:api` (requires Node).

---

## 7. What the codebase already addressed (no duplicate work)

These are **already implemented** in the app repo (do not re-do unless regressing):

- ITJobsWatch URL encoding fixes; optional `VITE_API_ORIGIN`; `apiUrl()` for API calls; `docs/DEMO_PREP.md`; smoke script `npm run smoke:api`.

---

## Summary for your agent

**You cannot fix production by editing only local files.** Complete **sections 1–4** in **Netlify**, **GitHub**, **Supabase**, and **DNS** so that:

1. The **correct repo** builds with **base `uphire`**.
2. **`/api/health`** returns JSON from **`api/health.js`**, not Express errors.
3. **Domains** point to that site.
4. **Supabase** auth URLs match the live app.

Then verify with **section 6**.
