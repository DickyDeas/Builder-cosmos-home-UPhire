# UPhire – Your Ordered To-Do List

Simple step-by-step instructions. For full details, see [LAUNCH_BRIEF.md](../LAUNCH_BRIEF.md).

---

## Phase 1: Environment (≈30 min)

### 1. Create `.env`
- Run: `npm run setup:env` (or copy `env.example` to `.env`)
- Open `.env` and fill in values

### 2. Supabase
1. Create project at [supabase.com](https://supabase.com)
2. Copy **Project URL**, **anon key**, **service_role key** → `.env`
3. Run migrations:
   - Add `DATABASE_URL` to `.env` (from Supabase → Settings → Database)
   - Run: `npm run migrate`
   - Or run each file in `supabase/migrations/` (001–006) in Supabase SQL Editor

### 3. Contact Emails
Set in `.env`:
```
VITE_SUPPORT_EMAIL=support@uphireiq.com
VITE_LEGAL_EMAIL=legal@uphireiq.com
VITE_PRIVACY_EMAIL=privacy@uphireiq.com
VITE_SALES_EMAIL=sales@uphireiq.com
VITE_BILLING_EMAIL=billing@uphireiq.com
VITE_FROM_EMAIL=noreply@uphireiq.com
```

### 4. Apply URLs
Set in `.env`:
```
VITE_APPLY_BASE_URL=https://uphireiq.com
VITE_APP_URL=https://uphireiq.com
```

### 5. Email (Brevo)
1. Log in to [Brevo](https://app.brevo.com)
2. Get API key from SMTP & API → API Keys
3. Add to `.env`: `VITE_EMAIL_SERVICE_API_KEY`, `VITE_EMAIL_SERVICE_URL=https://api.brevo.com`

---

## Phase 2: Job Boards (Client Credentials)

**No global API keys.** Each client adds their own job board credentials in Tenant Management → Job Board Licenses. The system posts to each client’s licensed boards and receives applications.

---

## Phase 3: Deploy (≈20 min)

### 1. Build
```bash
npm install
npm run pre-deploy
```

### 2. Netlify
1. Push to GitHub
2. Add new site → Import project → Connect GitHub
3. Build: `npm run build`, Publish: `dist`, Base: `uphire` (if in subfolder)
4. Add all `.env` variables in Netlify
5. Deploy

### 3. Custom Domain
- Add domain in Netlify
- Configure DNS at your registrar
- SSL is automatic

---

## Phase 4: Post-Launch

1. Smoke test: sign up, log in (or use admin bypass: demo@google / 123), create role, add candidate
2. Enable Supabase backups (Settings → Database)
3. Optional: UptimeRobot for monitoring

---

## Optional: Stress Test Applicants

See [STRESS_TEST_APPLICANTS.md](../STRESS_TEST_APPLICANTS.md) for bulk loading QlikView candidates.

```bash
npm run stress-test:applicants    # 100 candidates
npm run generate:qlikview-csv     # CSV for UI import
```

---

**Estimated time:** 1–2 weeks from setup to go-live
