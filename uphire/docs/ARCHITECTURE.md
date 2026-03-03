# UPhire IQ – Architecture

## Overview

UPhire IQ is a single-page application (SPA) served under `/app`, with React 18, Vite, and Supabase. It uses Netlify for hosting and serverless functions.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite 6 |
| Routing | React Router 6 |
| Data fetching | TanStack Query, Supabase client |
| Styling | Tailwind CSS 3, Radix UI, Lucide icons |
| Backend | Supabase (Auth, Postgres), Netlify Functions |
| AI | Grok API (x.ai) for screening and content |
| Email | Brevo API |
| Market data | Adzuna, ITJobsWatch (parsed), Grok fallback |

## Data Flow

```
User Action
    │
    ▼
React Component (pages/components)
    │
    ├──► Supabase Client ──► Supabase (Auth, DB)
    │
    ├──► apiClient.fetchWithTimeout ──► Netlify Functions (/api/*)
    │                                        │
    │                                        ├──► Supabase (service role)
    │                                        ├──► Adzuna / ITJobsWatch
    │                                        └──► External APIs
    │
    └──► Services (marketDataService, emailService, aiScreeningService)
              │
              └──► Grok, Brevo, Adzuna proxy, ITJobsWatch proxy
```

## Authentication

- **Supabase Auth** – Primary auth (email/password, sign up, forgot password)
- **Demo login** – `demo@google` / `123456` stored in `sessionStorage.uphire_demo`
- **AuthGuard** – Wraps `/support` and `/subscription`; redirects to `/login` with `from` state
- **Public routes** – `/`, `/login`, `/apply/*`, `/screening/*`, `/help`

## Per-user persistence

- **Profile sync** – Trigger creates `profiles` row on signup (migration 010) so `auth.uid() = profiles.id`
- **Roles** – Stored in `roles` with `profile_id`; RLS restricts to own data
- **Employees** – `employee_details` table with `profile_id` (migration 012)
- **Documents** – `documents` with `profile_id` for user templates (migration 013)
- **Demo login** – Uses mock data (no Supabase session); no persistence
- **Services** – `rolesService`, `employeesService`, `documentTemplatesService` for CRUD

## Security

- **Form sanitization** – `src/lib/security.ts` (sanitizeString, sanitizeEmail, etc.)
- **API timeouts** – `fetchWithTimeout` (15s default) in `apiClient.ts`
- **Auth guards** – Private routes require session
- See [SECURITY.md](../SECURITY.md) for details

## Build & Deploy

- **Base path:** `/app` (Vite `base`, React Router `basename`)
- **Output:** `dist/app/` (index.html, assets)
- **Netlify:** Base dir `uphire`, publish `dist`, functions `api`
- **Redirects:** Root → `/app`, `/app/*` → SPA fallback
