# Prompt: GitHub + Netlify only (no Supabase / DNS tools)

Copy everything below the dashed line into your agent.

---

**Role:** You are an operations agent with access **only** to **GitHub** (read/write repos the user authorized) and **Netlify** (sites, deploys, env vars, domains, redirects). You **do not** have Supabase, registrar DNS, or Cloudflare.

**Context:**  
UPhire is a Vite/React app under **`uphire/`** with Netlify Functions in **`uphire/api/*.js`**. The **marketing** site is often a **separate** repo/site. Production domain **`uphireiq.com`** may be on the marketing Netlify site, which does **not** deploy those functions—so **`/api/*`** returns **404** and Market Intelligence fails. The working app is on **`https://uphiresystem.netlify.app`** (repo e.g. **Builder-cosmos-home-UPhire**, branch **master**).

**Goal:** Use **Netlify** and **GitHub** so users hit a deploy where **`/api/*`** works and optional redirects fix old links. **Supabase 500 errors** are **out of scope** for you—note them for the user only.

---

## Tasks (do in order)

### 1. Netlify — identify sites

- List sites; confirm which is **`uphiresystem`** (or similar) linked to **`Builder-cosmos-home-UPhire`** (or the repo containing **`uphire/netlify.toml`** and **`uphire/api/`**).
- Confirm which site serves **`uphireiq.com`** (marketing).

### 2. Verify app site build

- Open the **app** site → **Deploys** → latest production → confirm **success**.
- **Site settings → Build:** base directory **`uphire`**, build **`npm run build`**, publish **`dist`** if `netlify.toml` lives under `uphire/`.
- **Functions** tab: must show **`health`**, **`adzuna-proxy`**, **`grok-proxy`**, **`itjobswatch-proxy`**, **`is-staff`**, etc.

### 3. Netlify — environment variables (app site only)

- On the **app** site, verify (or add) production env:  
  `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `GROK_API_KEY`, `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `VITE_APP_URL`, `VITE_APPLY_BASE_URL`, and any others referenced in **`uphire/env.example`**.  
- **Trigger redeploy** after changes.

### 4. Smoke test (no login required)

- Open in browser or curl: **`https://uphiresystem.netlify.app/api/health`** (use the app site’s primary URL). Expect **JSON** `{"status":"ok",...}`.  
- If **404** or HTML, fix build/repo linkage (steps 2–3) before continuing.

### 5. GitHub — marketing repo (e.g. **UPHire-20IQ-20Website**)

- Find **“Access Platform”** (or equivalent) link target.
- Change **`href`** to the **canonical app URL**:  
  **`https://uphiresystem.netlify.app/app`**  
  (or the app site’s custom domain + **`/app`** if the user attached one to the **app** site).  
- Commit and push; ensure **marketing** Netlify site deploys from this change.

### 6. Netlify — redirects on **marketing** site (recommended)

- Add redirects so **`/app`** and **`/app/*`** on **`uphireiq.com`** go to **`https://uphiresystem.netlify.app/app`** and **`.../app/:splat`** respectively (use **302** for testing, **301** when stable).  
- Implement via **`public/_redirects`** in the marketing repo **or** **Netlify UI → Domain management / Redirects**.  
- Reference pattern:

```text
/app   https://uphiresystem.netlify.app/app   302!
/app/* https://uphiresystem.netlify.app/app/:splat 302!
```

(Adjust target if the user’s app URL differs.)

### 7. Optional — single domain (only if user requests)

- Move custom domain **`uphireiq.com`** from **marketing** site to **app** site **or** add **`app.`** subdomain on app site. **Warn** user that marketing must move to **`www`** or another hostname. **Do not** delete sites without explicit user confirmation.

---

## Deliverables

1. Short **table**: Netlify site name → GitHub repo@branch → `/api/health` pass/fail on app URL.  
2. **PR/commit links** for marketing URL change + redirect commits.  
3. **Explicit note:** If the user still sees **Supabase** `*.supabase.co` **500** errors in the browser, that requires **Supabase dashboard / SQL / RLS** — **not** fixable with GitHub+Netlify only.

## Constraints

- Do **not** print or store secrets; confirm env **names** only.  
- Do **not** merge unrelated large refactors.  
- Prefer **minimal** changes: correct **links** + **redirects** + **app site** env/deploy.

---

_End of prompt._
