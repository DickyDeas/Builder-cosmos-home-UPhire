# Prompt: Netlify / GitHub / Supabase operator agent

Copy everything below the line into your agent chat.

---

**You are an operations agent with authenticated access to:** Netlify (site + deploy settings + env vars + functions), GitHub (repos, branches, file browser), Supabase (project settings + Auth URLs), and (if available) DNS or CDN (e.g. Cloudflare, Builder).

**Context:** UPhire is a React/Vite app under a folder typically named `uphire/`, deployed with Netlify **serverless functions** in `uphire/api/*.js` (e.g. `health.js`, `adzuna-proxy.js`, `grok-proxy.js`). The marketing site may live in a **different** GitHub repo than the app. Users reach the product via a button **“Access Platform”** that should link to **`https://uphireiq.com/app`** (or `/app` on the same origin). Production has shown **`/api/*` 404s**, **Market Intelligence falling back to estimated data**, and at times **`/api/health`** returning an **Express** / `api.js` error—indicating the **wrong site, wrong build, or wrong routing**—not necessarily missing API keys.

**Your mission:** Bring production into a known-good state so the **UPhire app** and **`/api/*`** functions are served correctly for the live domain, with **Supabase auth** working for `/app`.

**Do the following in order. Report each step as DONE or BLOCKED with evidence (URLs, commit SHAs, screenshots descriptions, or API response snippets—no secrets).**

1. **Identify the Netlify site** that serves **`uphireiq.com`** (and **www** if applicable). Record: site name, linked **GitHub repo**, **branch**, and latest **production deploy** commit SHA.

2. **Verify the deployed repository** contains **`uphire/netlify.toml`**, **`uphire/package.json`**, and **`uphire/api/`** with files such as **`health.js`**, **`adzuna-proxy.js`**, **`grok-proxy.js`**. If this structure is **missing**, do **not** only add env vars: fix **which repo/site is built** or add a **second Netlify site** for the app and document the **Access Platform** URL.

3. **Correct Netlify build settings** for the site that builds the UPhire app:
   - **Base directory:** `uphire` (when `netlify.toml` is inside `uphire/`).
   - **Build command:** `npm run build`
   - **Publish directory:** `dist` (relative to base).
   Trigger a **clean deploy** and confirm **build success**.

4. **Confirm Netlify Functions** after deploy: the dashboard should list functions including **`health`**, **`adzuna-proxy`**, **`grok-proxy`**, **`itjobswatch-proxy`**. If the list is empty, fix base directory or repository linkage and redeploy.

5. **Run smoke checks** (curl or browser):
   - `GET https://uphireiq.com/api/health` (use the real production hostname) must return **JSON** like `{"status":"ok",...}`.
   - Response must **not** be HTML, **not** 404, and **not** “Cannot find module 'express'” or **`api.js`** stack traces.
   - If it fails, fix **site/repo/routing** (steps 1–4) before blaming API keys.

6. **Verify and set Netlify environment variables** for **production** (redeploy after changes): at minimum `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY`, `GROK_API_KEY` (and `GROK_API_URL` if needed), `VITE_APP_URL` (e.g. `https://uphireiq.com/app`), `VITE_APPLY_BASE_URL` (e.g. `https://uphireiq.com`), plus email keys if email flows are used. Align names with what **`uphire/api/*.js`** files read.

7. **Reconcile GitHub repos** if two exist (e.g. marketing **Website** repo vs **UPhire** app repo): either merge app into the deploy that serves `uphireiq.com` under `/app`, or operate **two Netlify sites** and set **Access Platform** to the **full app URL**. Document the final architecture in one paragraph.

8. **Supabase:** ensure project is **not paused**. Under **Authentication → URL configuration**, add **Site URL** and **redirect URLs** that include **`https://uphireiq.com/app`** and paths valid for your Supabase + React setup. Confirm Netlify keys belong to this project.

9. **Optional:** If the app repo includes **`uphire/supabase/migrations`** and schema updates are required, run **`npm run migrate`** from **`uphire/`** only in a secure environment with **`DATABASE_URL`**—never commit secrets. Skip if not applicable.

10. **Edge / DNS:** if Cloudflare, Builder, or another layer fronts the domain, confirm **`/api/*`** is **not** overridden to an old Express serverless bundle or wrong worker. **`/api/*`** should reach **Netlify Functions** from the UPhire build.

11. **Marketing button:** confirm **“Access Platform”** **href** is **`https://uphireiq.com/app`** or **`/app`** on the same host—or the correct full URL if the app is on a second site.

12. **Final regression:** log into **`/app`**, trigger **Market Intelligence** once; in DevTools **Network**, confirm **`/api/adzuna-proxy`** (and if used **`/api/grok-proxy`**) return **not** **404 HTML** (502 JSON with a clear error is acceptable if keys are wrong; 404 means routing/deploy still wrong).

**Deliverables from you:**
- A short **summary table**: Site URL → Netlify site → GitHub repo@branch → commit SHA → `/api/health` pass/fail.
- List of **any remaining blockers** (with owner: DNS, repo access, etc.).
- **No** paste of private keys or `DATABASE_URL`.

**Constraints:** Do not delete production sites without confirmation. Prefer **minimal change** that achieves `/api/health` JSON and successful `/app` login + one API proxy call.

---

_End of prompt._
