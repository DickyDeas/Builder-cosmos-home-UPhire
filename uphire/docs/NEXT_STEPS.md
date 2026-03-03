# UPhire IQ – Next Steps After Enterprise Implementation

## 1. Run Migrations

When your Supabase project is reachable and `DATABASE_URL` is set in `.env`:

```bash
cd uphire
npm run migrate
```

Migrations 014–021 add:
- Tenant roles enum and job board schema
- `audit_logs` table
- `tenant_id` on candidates/documents and RLS
- Storage tenant isolation (path prefix `tenants/{tenant_id}/`)
- Migrations 018–021: tenant creation, invite policies, candidate soft-delete, RLS exclude deleted

## 2. Netlify Environment Variables

In Netlify → Site settings → Environment variables, set (without `VITE_` prefix for secrets):

| Variable | Purpose |
|----------|---------|
| `GROK_API_KEY` | AI screening, market data |
| `GROK_API_URL` | Optional, default `https://api.x.ai/v1` |
| `EMAIL_SERVICE_API_KEY` | Brevo transactional email |
| `EMAIL_SERVICE_URL` | Optional, default `https://api.brevo.com` |
| `FROM_EMAIL` | Sender address |
| `ADZUNA_APP_ID` | Market intelligence |
| `ADZUNA_APP_KEY` | Market intelligence |

## 3. Storage Uploads

When adding file uploads (CVs, documents), use tenant-prefixed paths:

```ts
import { documentPath, cvUploadPath } from "@/lib/storageUtils";

// For documents bucket
const path = documentPath(tenantId, "contract.pdf", "legal");

// For CV uploads
const path = cvUploadPath(tenantId, "resume.pdf", candidateId);

// Upload to Supabase Storage
await supabase.storage.from("documents").upload(path, file);
```

## 4. Job Board Posting

Use the job board service:

```ts
import { postJobToBoard } from "@/services/jobBoardService";

const result = await postJobToBoard(tenantId, "linkedin", {
  title: "Senior React Developer",
  description: "...",
  location: "London",
});
```

## 5. Audit Logging

Call `logAudit` for key actions:

```ts
import { logAudit } from "@/services/auditService";

await logAudit({
  tenantId: "...",
  action: "role_create",
  resourceType: "role",
  resourceId: roleId,
  metadata: { title: "..." },
});
```

## 6. Rate Limiting (Optional)

For `/api/apply`, set Upstash Redis env vars in Netlify:
- `UPSTASH_REDIS_REST_URL`
- `UPSTASH_REDIS_REST_TOKEN`

If not set, rate limiting is skipped (no rate limit).

## 7. GDPR Data Export

For candidates (right to access): `POST /api/export-candidate-data` with `Authorization: Bearer <token>` and body `{ candidateId }` or `{ email }`. Use `exportCandidateData()` from `dataExportService.ts`.

## 8. Full Dev (Netlify Functions)

For local development with all API functions:

```bash
netlify dev
```

This runs both Vite and Netlify functions. With `npm run dev` only, Grok/email/audit proxies are handled by Vite middleware (using `.env`).

## 9. Team / Tenant Management

In **My Business** → **Team Members**: create a team, then invite members by email. Invitees must have an account first. Migrations 018–019 enable tenant creation and invite policies.
