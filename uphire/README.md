# UPhire IQ

AI-powered recruitment platform for managing job roles, candidates, outreach, and market intelligence. Built with React, TypeScript, Vite, and Supabase.

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Set up environment
npm run setup:env
# Edit .env with your Supabase URL, anon key, and other values (see env.example)

# 3. Run development server
npm run dev
```

App runs at **http://localhost:8080/app**

---

## Local Setup

### Prerequisites

- **Node.js 18+**
- **npm** (or pnpm/yarn)

### Step 1: Environment

```bash
npm run setup:env
```

This copies `env.example` to `.env` if it doesn't exist. Edit `.env` with:

| Variable | Required | Description |
|----------|----------|-------------|
| `VITE_SUPABASE_URL` | Yes | Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | Yes | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Supabase service role key (server-side only) |
| `VITE_SUPPORT_EMAIL` | No | Support contact (defaults in config) |
| `VITE_APPLY_BASE_URL` | Yes | Base URL for apply API (e.g. `https://uphireiq.com`) |
| `VITE_APP_URL` | Yes | Full app URL (e.g. `https://uphireiq.com/app`) |
| `VITE_GROK_API_KEY` | No | Grok API for AI screening (uses mock if missing) |
| `VITE_EMAIL_SERVICE_API_KEY` | No | Brevo API for emails (uses mock if missing) |

See `env.example` for the full list.

### Step 2: Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Copy **Project URL**, **anon key**, **service_role key** into `.env`
3. Run migrations:
   - **Option A:** Add `DATABASE_URL` to `.env` (Supabase → Settings → Database → Connection string), then:
     ```bash
     npm run migrate
     ```
   - **Option B:** Run each file in `supabase/migrations/` (001–006) in the Supabase SQL Editor

### Step 3: Run

```bash
npm run dev
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server (port 8080, base `/app`) |
| `npm run build` | Production build → `dist/` |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint (src) |
| `npm test` | Run Vitest tests |
| `npm run setup:env` | Create `.env` from `env.example` |
| `npm run migrate` | Run Supabase migrations (requires `DATABASE_URL`) |
| `npm run pre-deploy` | Typecheck + build + tests (deploy verification) |

---

## Testing

Unit tests use **Vitest** and live next to the code (e.g. `security.spec.ts` next to `security.ts`).

```bash
npm test
```

**Test coverage:** Core logic in `src/lib/` and `src/pages/uphire/utils.ts`:
- `security.spec.ts` – sanitization (XSS prevention)
- `candidateUtils.spec.ts` – candidate filtering
- `savingsUtils.spec.ts` – ROI/cost savings calculations
- `roleUtils.spec.ts` – role form validation
- `utils.spec.ts` – `cn` utility
- `uphire/utils.spec.ts` – AI match score, salary formatting

---

## Deploy (Netlify)

1. **Connect repo** – Netlify → Add site → Import from GitHub
2. **Build settings:**
   - Base directory: `uphire`
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Functions directory: `api`
3. **Environment variables** – Add all vars from `.env` in Netlify (Site settings → Environment variables)
4. **Deploy** – Push to trigger, or deploy manually

See [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md) for the full checklist.

---

## CI (GitHub Actions)

On push/PR to `main` or `master`, `.github/workflows/ci.yml` runs:

1. **Typecheck** – `npm run typecheck`
2. **Lint** – `npm run lint`
3. **Test** – `npm test`
4. **Build** – `npm run build`

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              UPhire IQ (SPA)                                │
├─────────────────────────────────────────────────────────────────────────────┤
│  React 18 + Vite + React Router 6 + TanStack Query + Tailwind + Radix UI   │
└─────────────────────────────────────────────────────────────────────────────┘
                                      │
        ┌─────────────────────────────┼─────────────────────────────┐
        ▼                             ▼                             ▼
┌───────────────┐           ┌──────────────────┐           ┌──────────────────┐
│   Supabase    │           │  Netlify / Vite  │           │  External APIs   │
│   (Auth + DB) │           │  Serverless Fns  │           │  (Adzuna, Grok)  │
├───────────────┤           ├──────────────────┤           ├──────────────────┤
│ • Auth        │           │ • /api/apply      │           │ • Adzuna (jobs)  │
│ • profiles    │           │ • adzuna-proxy    │           │ • ITJobsWatch    │
│ • roles       │           │ • itjobswatch     │           │ • Grok (AI)      │
│ • candidates  │           │                   │           │ • Brevo (email)   │
│ • support_*   │           │                   │           │                  │
└───────────────┘           └──────────────────┘           └──────────────────┘
```

### Component Flow

| Layer | Location | Purpose |
|-------|----------|---------|
| **Routes** | `src/App.tsx` | Route definitions; `/support`, `/subscription` wrapped with `AuthGuard` |
| **Pages** | `src/pages/` | Index (main app), LoginPage, ApplyPage, ScreeningChatPage, HelpCenter, SupportTickets, SubscriptionPage |
| **Auth** | `src/components/AuthGuard.tsx` | Protects private routes; redirects to `/login` if unauthenticated |
| **Services** | `src/services/` | `marketDataService`, `emailService`, `aiScreeningService`, `screeningChatService`, `adzunaHttpClient`, `itjobswatchClient` |
| **Lib** | `src/lib/` | `supabaseClient`, `apiClient` (fetch + timeout), `security` (sanitization) |
| **API** | `api/` | Netlify Functions: `apply.js`, `adzuna-proxy.js`, `itjobswatch-proxy.js`, etc. |

### Routes

| Path | Auth | Description |
|------|------|--------------|
| `/` | No | Main app (landing when logged out) |
| `/login` | No | Login, sign up, forgot password |
| `/apply/:roleId` | No | Public job application form |
| `/apply/:tenantSlug/:jobId` | No | Tenant-specific apply form |
| `/screening/:sessionId` | No | AI screening chat |
| `/help` | No | Help center |
| `/support` | Yes | Support tickets |
| `/subscription` | Yes | Subscription management |

---

## Project Structure

```
uphire/
├── api/                    # Netlify serverless functions
│   ├── apply.js
│   ├── adzuna-proxy.js
│   └── ...
├── src/
│   ├── App.tsx             # Routes
│   ├── main.tsx
│   ├── components/         # Reusable + AuthGuard
│   ├── config/             # contact, calendly
│   ├── lib/                # supabaseClient, apiClient, security
│   ├── pages/              # Page components
│   │   └── uphire/         # Main app views, components, types
│   └── services/           # API clients, AI, email
├── supabase/migrations/    # DB migrations
├── env.example
├── netlify.toml
└── vite.config.ts
```

---

## Documentation

| File | Description |
|------|-------------|
| [LAUNCH_BRIEF.md](LAUNCH_BRIEF.md) | Go-live checklist |
| [NETLIFY_DEPLOY.md](NETLIFY_DEPLOY.md) | Netlify deployment steps |
| [SECURITY.md](SECURITY.md) | Security practices and recommendations |
| [docs/SYSTEM_PROCESS_FLOW_REFERENCE.md](docs/SYSTEM_PROCESS_FLOW_REFERENCE.md) | Feature implementation status |
| [docs/USER_ORDERED_TODO.md](docs/USER_ORDERED_TODO.md) | Setup to-do list |

---

## License

Proprietary – UPhire IQ
