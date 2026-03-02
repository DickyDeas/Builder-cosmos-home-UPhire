# Security Practices

## Implemented

### Form validation and sanitization (XSS/injection prevention)
- **`src/lib/security.ts`** – Sanitization utilities:
  - `sanitizeString()` – Strips HTML, script tags, control chars
  - `sanitizeSearch()` – For search inputs (removes injection chars)
  - `sanitizeEmail()` – Validates and normalizes email
  - `sanitizeName()`, `sanitizePhone()`, `sanitizeCommaList()`, `sanitizeId()`
- **ApplyPage** – All form inputs sanitized before submit
- **LoginPage** – Email validated and sanitized
- **MarketIntelligence** – Search term sanitized before API call

### API error handling and timeouts
- **`src/lib/apiClient.ts`** – Fetch wrapper:
  - `fetchWithTimeout()` – 15s default timeout, AbortController
  - `fetchJsonWithTimeout()` – JSON parse with error handling
  - `getUserFriendlyErrorMessage()` – Safe error messages for UI
- **Adzuna** and **ITJobsWatch** clients use `fetchWithTimeout` (12s)
- **ApplyPage** uses `fetchWithTimeout` and shows user-friendly errors
- **MarketIntelligence** shows toast when sources fail or return mock data

### Authentication guards
- **`src/components/AuthGuard.tsx`** – Protects private routes
- **Protected routes:** `/support`, `/subscription`
- Unauthenticated users are redirected to `/login` with return URL
- Supports Supabase auth and demo login (sessionStorage)

### Sensitive data
- Support and Subscription require auth before showing content
- Index shows landing page when not logged in; app content only when authenticated

## Recommendations for production

1. **Supabase RLS** – Enable Row Level Security on all tables; restrict by `auth.uid()` or tenant
2. **API validation** – Validate and sanitize all inputs in Netlify Functions (e.g. `/api/apply`)
3. **Rate limiting** – Add rate limits on apply, login, and public APIs
4. **CSP headers** – Set Content-Security-Policy in Netlify `_headers` or config
5. **Secrets** – Never expose `SUPABASE_SERVICE_ROLE_KEY` to the client; use only in serverless functions
