# UPhire Launch Brief – Go Live Checklist

**Build status:** Run `npm run pre-deploy` to verify typecheck, build, and tests pass.

---

## Steps Overview

- [ ] **1. Supabase** – Create database, run migrations, add API keys to .env
- [ ] **2. Contact emails** – Set your support, legal, sales emails in .env
- [ ] **3. Apply URLs** – Set VITE_APPLY_BASE_URL and VITE_APP_URL in .env
- [ ] **4. Email service** (Brevo) – Use same Brevo account as your website
- [ ] **5. Deploy** – Push to Netlify and add env vars
- [ ] **6. Custom domain** – Connect your domain
- [ ] **7. Post-launch** – Smoke test, enable Supabase backups, set up monitoring

**Payments:** Handled on [uphireiq.com/products#pricing](https://uphireiq.com/products#pricing). No Stripe setup in UPhire.

---

## Detailed Steps

### Step 1: Supabase Setup

**Time:** ~20 minutes

1. Go to **https://supabase.com** and create a project
2. In **Settings** → **API**, copy Project URL, anon key, and service_role key
3. Add to `.env`: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
4. **Run migrations:**
   - **Option A:** Add `DATABASE_URL` to .env (from Supabase → Settings → Database → Connection string), then run `npm run migrate`
   - **Option B:** In Supabase SQL Editor, run each file in `supabase/migrations/` in order (001 through 006)

### Step 2: Contact Emails

**Time:** ~5 minutes

Set in `.env`:
```
VITE_SUPPORT_EMAIL=support@uphireiq.com
VITE_LEGAL_EMAIL=legal@uphireiq.com
VITE_PRIVACY_EMAIL=privacy@uphireiq.com
VITE_SALES_EMAIL=sales@uphireiq.com
VITE_BILLING_EMAIL=billing@uphireiq.com
VITE_FROM_EMAIL=noreply@uphireiq.com
```

### Step 3: Apply URLs

**Time:** ~2 minutes

Set in `.env`:
```
VITE_APPLY_BASE_URL=https://uphireiq.com
VITE_APP_URL=https://uphireiq.com
```

### Step 4: Email Service (Brevo)

**Time:** ~5 minutes

1. Log in to **Brevo** (https://app.brevo.com)
2. Go to **SMTP & API** → **API Keys**, create or copy an API key
3. Add to `.env`:
```
VITE_EMAIL_SERVICE_API_KEY=xkeysib-your_brevo_api_key_here
VITE_EMAIL_SERVICE_URL=https://api.brevo.com
VITE_FROM_EMAIL=noreply@uphireiq.com
```

### Step 5: Deploy to Netlify

**Time:** ~15 minutes

1. Push code to GitHub
2. In Netlify: **Add new site** → **Import an existing project** → Connect to GitHub
3. **Build:** `npm run build`, **Publish:** `dist`, **Base directory:** `uphire` (if app is in subfolder)
4. Add all `.env` variables in Netlify (Site settings → Environment variables)
5. Deploy site

### Step 6: Custom Domain

1. In Netlify: Domain settings → Add custom domain
2. Add DNS records at your registrar as instructed
3. SSL is automatic

### Step 7: Post-Launch

1. Smoke test: sign up, log in (admin: demo@google / 123456), create role, add candidate
2. Enable Supabase backups (Settings → Database)
3. Optional: UptimeRobot for monitoring

---

## Quick Reference: .env Variables

| Variable | Required? | Where to get it |
|----------|-----------|-----------------|
| VITE_SUPABASE_URL | Yes | Supabase → Settings → API |
| VITE_SUPABASE_ANON_KEY | Yes | Supabase → Settings → API |
| SUPABASE_SERVICE_ROLE_KEY | Yes | Supabase → Settings → API |
| VITE_SUPPORT_EMAIL | Yes | Your support email |
| VITE_LEGAL_EMAIL | Yes | Your legal email |
| VITE_PRIVACY_EMAIL | Yes | Your privacy email |
| VITE_SALES_EMAIL | Yes | Your sales email |
| VITE_BILLING_EMAIL | Yes | Your billing email |
| VITE_FROM_EMAIL | Yes | e.g. noreply@uphireiq.com |
| VITE_APPLY_BASE_URL | Yes | Your live site URL |
| VITE_APP_URL | Yes | Same as above |
| VITE_EMAIL_SERVICE_API_KEY | No | Brevo (api.brevo.com) |
| DATABASE_URL | For migrate | Supabase → Settings → Database |

---

**Estimated time to go live:** 1–2 hours
