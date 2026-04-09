# Simple steps for you (non-technical)

You are checking **three** things so the **Access Platform** and **Market Intelligence** work:

1. **Netlify** is pointed at the right code and settings.  
2. **Netlify** has the **passwords/keys** the app needs (stored safely there, not in email).  
3. **Supabase** (your database) is healthy — if it isn’t, lists of candidates/roles will still break until someone fixes the database.

**I (Cursor / the AI) cannot log into Netlify or Supabase for you.** Only you (or someone with your logins) can do that in the browser. This page is your checklist.

---

## Part A — Netlify (about 15–20 minutes)

### Step 1: Open the right website

1. Go to [app.netlify.com](https://app.netlify.com) and sign in.  
2. Click the site that runs your **real app** — often named something like **uphiresystem** or the site whose URL you use for the hiring tool.

### Step 2: Make sure Netlify is building the **UPhire** folder

1. Click **Site configuration** (or **Site settings**).  
2. Open **Build & deploy** → **Continuous deployment** (or **Build settings**).  
3. Find **Base directory**.  
   - **Set it to:** `uphire`  
   - (That tells Netlify: “the important config and API code live inside the `uphire` folder.”)  
4. **Save** if you changed anything.

**Why:** If this is wrong, the site may look fine but **`/api/...` links fail** and Market Intelligence can’t load job data.

### Step 3: Check that a recent deploy **succeeded**

1. Open **Deploys** (left menu).  
2. The **top** deploy should say **Published** and **Success** (green).  
3. If it says **Failed**, click it and scroll to the error — often it’s a missing setting or typo. You may need a developer to read the log, or use **“Retry deploy”** after fixing Part A Step 2.

### Step 4: Add the “secret keys” (environment variables)

1. Go to **Site configuration** → **Environment variables** (or **Build & deploy** → **Environment**).  
2. Check **Production** (and **Deploy Previews** if your team uses them).  
3. You don’t need to understand each one; your developer or `env.example` in the project lists the names. Important names often include:

   - **`VITE_SUPABASE_URL`** and **`VITE_SUPABASE_ANON_KEY`** — so the app can talk to the database.  
   - **`ADZUNA_APP_ID`** and **`ADZUNA_APP_KEY`** — UK job/salary search in Market Intelligence.  
   - **`GROK_API_KEY`** — AI part of market / screening (if you use it).  
   - **`RAPIDAPI_KEY`** — extra salary source (if you subscribed on RapidAPI).  
   - Email keys if you send mail from the app (`EMAIL_SERVICE_API_KEY`, etc.).

4. **Never** paste these keys in a public chat or email. Type them only in Netlify (or your password manager to copy).

5. After **adding or changing** variables, trigger a new deploy: **Deploys** → **Trigger deploy** → **Clear cache and deploy site**.

### Step 5: Quick “did it work?” test (in your normal browser)

Replace `YOUR-SITE` with your real Netlify address (example: `uphiresystem.netlify.app`).

1. Open: `https://YOUR-SITE/.netlify/functions/health`  
   - **Good:** You see a short JSON message (not a blank error page).  
2. Open: `https://YOUR-SITE/api/health`  
   - **Good:** Same kind of JSON (not “Page not found”).  
   - **Bad:** If the **first** link works but the **second** fails, Netlify routing is still wrong — double-check **Base directory = `uphire`**, redeploy, and ask a developer to confirm `netlify.toml` and build output are on the branch you deploy.

**Update from your developers:** The app can be changed so that on addresses ending in **`.netlify.app`** it talks to the API using a path that often works even when `/api/…` does not. Ask them to **merge and redeploy** the latest code; after that, **Market Intelligence** may work on `yoursite.netlify.app` without you changing Netlify again. If you use a **custom domain** (e.g. `uphireiq.com`) and `/api/health` still fails, they may need to set a build variable **`VITE_NETLIFY_FUNCTIONS_URL=1`** in Netlify, then redeploy.

---

## Part B — Supabase (database errors)

If you still see errors about **500** or **Supabase** when opening candidates, roles, or documents:

1. Go to [supabase.com](https://supabase.com) → your project.  
2. Open **Logs** → look for **API** or **Postgres** errors around the time you used the app.  
3. **This is not fixed inside Netlify.** Someone with SQL/access needs to fix tables, permissions, or run **migrations** (your repo may have a `migrate` script — a developer runs that with the database password).

**You can still do:** confirm the **URL** and **anon key** in Netlify **exactly** match **Project Settings → API** in Supabase (one typo breaks everything).

---

## Part C — Git / “is my live site using the latest code?”

If your developer pushes fixes to **GitHub**:

1. In Netlify → **Deploys**, check which **branch** is connected (often `main`).  
2. Ask: “Is the fix merged into that branch?” If not, the live site won’t have it until it is.  
3. You can click **Trigger deploy** to force a fresh build after the code is merged.

**(Cursor / AI in your project)** can help edit code and files on your computer, but **only you** can click Publish in Netlify and paste keys in the Netlify website.

---

## One-page checklist (print or tick in the browser)

- [ ] Netlify **Base directory** = `uphire`  
- [ ] Latest deploy = **Success**  
- [ ] **Environment variables** set for Supabase + any APIs you pay for  
- [ ] **Clear cache and deploy** after changing variables  
- [ ] `https://YOUR-SITE/.netlify/functions/health` works  
- [ ] `https://YOUR-SITE/api/health` works  
- [ ] If database errors persist: Supabase **Logs** + keys match Netlify  

For more detail (second Netlify site, DNS, staff emails), see **`OPERATOR_HANDOFF_TASKS.md`** in this same folder.
