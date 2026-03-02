# UPhire Launch To-Do List

**For detailed instructions, see [LAUNCH_BRIEF.md](LAUNCH_BRIEF.md).**

---

## Phase 1: Environment & Core Services

### Step 1.1 – Create environment file
1. Run: `npm run setup:env` (or copy `env.example` to `.env`)
2. Open `.env` and fill in values

### Step 1.2 – Supabase setup
1. Create project at [supabase.com](https://supabase.com)
2. Copy Project URL, anon key, service_role key → `.env`
3. Run migrations: `npm run migrate` (add DATABASE_URL first) or run SQL files manually in Supabase SQL Editor

### Step 1.3 – Email service (Brevo)
1. Log in to Brevo (same account as your website)
2. Get API key from SMTP & API → API Keys
3. Add to `.env`: `VITE_EMAIL_SERVICE_API_KEY`, `VITE_EMAIL_SERVICE_URL=https://api.brevo.com`, `VITE_FROM_EMAIL`

### Step 1.4 – Contact details
Set in `.env`: VITE_SUPPORT_EMAIL, VITE_LEGAL_EMAIL, VITE_PRIVACY_EMAIL, VITE_SALES_EMAIL, VITE_BILLING_EMAIL, VITE_FROM_EMAIL

---

## Phase 2: Job Boards

**Client credentials:** Each client adds their own job board credentials in Tenant Management → Job Board Licenses. No global API keys.

### Apply URL
Set `VITE_APPLY_BASE_URL` and `VITE_APP_URL` in `.env` (e.g. https://uphireiq.com)

---

## Phase 3: Deployment

### Build
1. `npm install`
2. `npm run pre-deploy` (typecheck, build, tests)
3. Fix any errors

### Deploy (Netlify)
1. Push to GitHub
2. Add new site → Import project → Connect GitHub
3. Build: `npm run build`, Publish: `dist`
4. Add all `.env` variables in Netlify
5. Deploy site

### Custom domain
Add domain in Netlify, configure DNS, SSL is automatic

---

## Phase 4: Post-Launch

1. Smoke test: sign up, log in, create role, add candidate
2. Enable Supabase backups
3. Optional: UptimeRobot for monitoring

---

## Payments (External)

Payments are on your main website (Builder.ai). No Stripe in UPhire. Update `profiles.subscription_plan` in Supabase when users subscribe externally.

---

**Estimated time:** 1–2 weeks from setup to go-live
