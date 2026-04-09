  mn# UPhire IQ – Enterprise Architecture & Production Readiness

**Version:** 1.0  
**Date:** March 2025  
**Status:** Strategic Design Document

---

## Executive Summary

UPhire IQ is an AI-powered recruitment platform with a solid foundation: Supabase (Auth + Postgres), RLS, multi-tenant schema, and Netlify serverless functions. However, the current architecture is **profile-centric** rather than **tenant-centric**, and several critical gaps prevent enterprise readiness. This document audits the current state, identifies gaps, and proposes a production-grade architecture with a phased implementation roadmap.

**Key findings:**
- Multi-tenant schema exists (`tenants`, `tenant_users`, `tenant_job_board_licenses`) but RLS is not tenant-aware for core entities (roles, candidates, documents)
- Secrets (Grok, Adzuna, Brevo) are exposed client-side via `VITE_*` env vars
- No SSO, MFA, SCIM, or delegated tenant administration
- Job board integration schema mismatches API expectations; no OAuth token storage
- Storage has no tenant isolation; any authenticated user can access any document
- No rate limiting, audit logging, or SIEM compatibility

**Recommendation:** Adopt a **row-level multi-tenant** strategy with **WorkOS** for enterprise IAM, **AWS** for production infrastructure, and a **modular monolith** backend. Migrate secrets to server-side, enforce tenant-scoped RLS across all entities, and implement the connector abstraction for job boards.

---

## 1. Multi-Tenant Architecture Design

### 1.1 Tenant Isolation Strategy

| Strategy | Pros | Cons | Verdict |
|----------|------|------|---------|
| **Row-level (shared schema)** | Simple ops, cost-efficient, easy cross-tenant analytics, Supabase-native | Requires strict RLS, risk of policy bugs | **Recommended** |
| **Schema-per-tenant** | Strong isolation, easier per-tenant migrations | Connection pooling complexity, migration overhead, Supabase limits | Not recommended |
| **Database-per-tenant** | Maximum isolation | High cost, complex backups, poor for SaaS | Overkill for mid-market |

**Recommendation: Row-level (shared schema) with strict tenant_id enforcement**

- All tenant-scoped tables must have `tenant_id UUID NOT NULL`
- RLS policies must always include `tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())`
- Use a `current_tenant_id()` helper or JWT claim for request context

### 1.2 Current vs Target Schema

**Current gaps:**
- `roles.tenant_id` is nullable; RLS uses `profile_id` only
- `candidates`, `documents`, `shortlisted_candidates`, etc. have no `tenant_id`; access is via `roles.profile_id`
- `tenant_users.role` is a single TEXT field (`member`); no granular RBAC
- Storage objects have no tenant path prefix

**Target schema changes:**
1. Add `tenant_id` to: `roles`, `candidates`, `documents`, `shortlisted_candidates`, `interview_records`, `ai_predictions`, `support_tickets`, `screening_sessions` (where applicable)
2. Migrate existing data: assign `profile_id`-owned data to a default tenant per user
3. Introduce `tenant_roles` table: `(tenant_id, user_id, role)` with enum: `owner`, `admin`, `recruiter`, `hiring_manager`, `interviewer`, `viewer`

### 1.3 RBAC Model

| Role | Capabilities |
|------|--------------|
| **Owner** | Billing, delete tenant, transfer ownership, full admin |
| **Admin** | User management, settings, branding, integrations, reports |
| **Recruiter** | Create/edit roles, manage candidates, post jobs, view analytics |
| **Hiring Manager** | View roles/candidates for assigned roles, add notes, approve shortlists |
| **Interviewer** | View assigned candidates, add interview feedback |
| **Viewer** | Read-only access to tenant data |

Implement via:
- `tenant_users.role` enum
- RLS policies that check `tenant_users.role` for write vs read
- Optional: `role_permissions` table for custom permission overrides (Phase 2)

### 1.4 Delegated Tenant Administration

- **Tenant admins** can invite users, assign roles, manage job board connections
- Invite flow: email → magic link or SSO → auto-join tenant
- Deprovisioning: SCIM or manual removal from `tenant_users`; revoke sessions

### 1.5 Tenant-Level Configuration & Branding

- `tenants` table: add `settings JSONB`, `branding JSONB` (logo_url, primary_color, custom_domain)
- `tenant_settings` table (optional): key-value for feature flags, integrations
- White-label: custom domain per tenant (e.g. `careers.acme.com`), subdomain (`acme.uphireiq.com`), or path (`uphireiq.com/t/acme`)

### 1.6 Environment Variables & Secrets Management

**Current problem:** `VITE_GROK_API_KEY`, `VITE_ADZUNA_APP_ID`, `VITE_EMAIL_SERVICE_API_KEY` are bundled into the client.

**Target:**
- All third-party API keys stored in **AWS Secrets Manager** or **HashiCorp Vault**
- Netlify Functions (or new API layer) read secrets at runtime; never expose to client
- Frontend calls backend proxies for: AI screening, market data, email
- Use `SUPABASE_SERVICE_ROLE_KEY` only server-side; never in `VITE_*`

---

## 2. Identity & Access Management

### 2.1 Enterprise IAM Requirements

| Requirement | Current | Target |
|-------------|---------|--------|
| SSO (SAML 2.0) | ❌ | ✅ |
| OIDC / OAuth 2.0 | ❌ (email/password only) | ✅ |
| MFA | ❌ | ✅ |
| SCIM 2.0 (provisioning) | ❌ | ✅ |
| Role-based + attribute-based auth | Partial (RLS) | ✅ |
| Audit logs | ❌ | ✅ |
| Secure session management | Supabase default | Configurable timeout, device tracking |

### 2.2 IAM Provider Comparison

| Provider | SSO | MFA | SCIM | Enterprise fit | Cost | Verdict |
|----------|-----|-----|------|----------------|------|---------|
| **Auth0** | ✅ | ✅ | ✅ | Strong | $$$ | Good |
| **Clerk** | ✅ | ✅ | Limited | SMB-focused | $$ | Less enterprise |
| **WorkOS** | ✅ | ✅ | ✅ | Enterprise-first | $$$ | **Recommended** |
| **Custom (Supabase + SAML)** | Possible | Manual | Manual | High effort | - | Not recommended |

**Recommendation: WorkOS**

- Purpose-built for B2B SaaS: Directory Sync (SCIM), Admin Portal, Audit Logs
- SAML + OIDC out of the box; MFA via WorkOS or IdP
- Enterprise buyers expect WorkOS/Auth0; Clerk is less common in procurement
- Supabase Auth can remain for SMB/email signup; WorkOS for enterprise SSO (hybrid)

### 2.3 Hybrid IAM Architecture

```
                    ┌─────────────────────────────────────────┐
                    │           Identity Layer                  │
                    ├─────────────────────────────────────────┤
                    │  WorkOS (Enterprise)  │  Supabase Auth  │
                    │  - SAML/OIDC SSO      │  - Email/pwd    │
                    │  - MFA                │  - Magic link    │
                    │  - SCIM sync          │  - OAuth (Google)│
                    │  - Audit logs        │                  │
                    └──────────┬───────────┴────────┬─────────┘
                               │                     │
                               ▼                     ▼
                    ┌─────────────────────────────────────────┐
                    │     Unified Session / JWT                 │
                    │  - sub, email, tenant_ids[], role        │
                    │  - Supabase JWT or WorkOS → Supabase      │
                    └─────────────────────────────────────────┘
```

- **SMB/Startup:** Supabase Auth (email, Google)
- **Enterprise:** WorkOS SSO; on first login, create/link `profiles` and `tenant_users`
- **Session:** Store `tenant_id` in JWT custom claim or session table; RLS uses it

### 2.4 Audit Logging

- Log: login, logout, role change, data export, settings change, integration connect/disconnect
- Store in `audit_logs` table: `tenant_id`, `user_id`, `action`, `resource_type`, `resource_id`, `metadata JSONB`, `ip`, `user_agent`, `created_at`
- Export to SIEM: webhook to customer SIEM, or S3/CloudWatch for AWS SIEM integration

---

## 3. Security & Compliance Requirements

### 3.1 SOC 2 Type II Readiness

| Control | Requirement | Current | Action |
|---------|-------------|---------|--------|
| Access control | RBAC, least privilege | Partial | Enforce tenant RBAC |
| Encryption at rest | AES-256 | Supabase default | Verify Supabase compliance |
| Encryption in transit | TLS 1.2+ | ✅ | Ensure HSTS, no mixed content |
| Secrets management | No hardcoded secrets | ❌ Client keys | Move to Secrets Manager |
| Change management | Audit trail | ❌ | Add audit_logs |
| Incident response | Runbook, contacts | ❌ | Create IR playbook |
| Vendor assessment | Supabase, WorkOS | - | Document SOC 2 status |

### 3.2 GDPR Compliance

| Requirement | Action |
|-------------|--------|
| Lawful basis | Document consent for candidate data |
| Right to access | Export API for candidates |
| Right to erasure | Soft-delete + purge workflow |
| Data portability | JSON/CSV export |
| DPA | Standard DPA with Supabase, WorkOS |
| DPO contact | Publish in privacy policy |
| Breach notification | 72h process documented |

### 3.3 Data Encryption

- **At rest:** Supabase/Postgres uses AES-256; verify with Supabase
- **In transit:** TLS 1.3 for all APIs
- **Sensitive fields:** Encrypt `tenant_job_board_licenses.metadata` (OAuth tokens) with application-level encryption (e.g. pgcrypto, `encrypt(metadata, key)`)

### 3.4 Secrets Management

- AWS Secrets Manager or Vault for: Grok, Brevo, Adzuna, job board API keys
- Rotate keys periodically; use IAM roles for API access
- Per-tenant OAuth tokens: encrypt in DB, decrypt only in server-side API

### 3.5 Rate Limiting & API Protection

- **Apply API:** 10 req/min per IP (anonymous)
- **Auth endpoints:** 5 failed attempts → 15 min lockout
- **Authenticated API:** 1000 req/min per user (configurable per tier)
- Use: AWS API Gateway, Cloudflare, or Upstash Redis for rate limits

### 3.6 Activity Logging & SIEM

- Structured logs (JSON) to CloudWatch/Datadog
- `audit_logs` table for sensitive actions
- Webhook or S3 export for customer SIEM (enterprise tier)

### 3.7 Incident Response Readiness

- Runbook: credential leak, data breach, DDoS
- On-call rotation, escalation path
- Post-incident review template

### 3.8 Compliance Checklist

- [ ] SOC 2 Type II audit (12-month period)
- [ ] GDPR DPA with all subprocessors
- [ ] Penetration test (annual)
- [ ] Vulnerability scanning (CI + periodic)
- [ ] Security questionnaire (e.g. Vanta, Drata)
- [ ] Bug bounty program (optional)

---

## 4. Backend & Infrastructure Redesign

### 4.1 API Layer

| Option | Pros | Cons | Verdict |
|--------|------|------|---------|
| REST | Simple, cacheable, familiar | Over/under-fetching | **Recommended** for now |
| GraphQL | Flexible queries, single endpoint | Complexity, caching, auth | Phase 2 for power users |

**Recommendation:** REST with OpenAPI spec. Add GraphQL gateway later for analytics/dashboards if needed.

### 4.2 Database

**Recommendation: Postgres (Supabase or self-hosted)**

- Supabase: good for MVP, managed RLS, real-time
- At scale: consider Supabase Pro or migrate to RDS/Aurora with connection pooling (PgBouncer)
- Keep Postgres; no need to change

### 4.3 Multi-Tenant Schema Structure

```
tenants
  ├── tenant_users (tenant_id, user_id, role)
  ├── tenant_settings
  ├── tenant_job_board_licenses
  ├── roles (tenant_id)
  ├── candidates (tenant_id, role_id)
  ├── documents (tenant_id, ...)
  ├── job_board_analytics
  └── audit_logs
```

All FKs and RLS must enforce `tenant_id` consistency.

### 4.4 Microservices vs Modular Monolith

| Approach | Pros | Cons |
|----------|------|------|
| Microservices | Independent scaling, team ownership | Operational overhead, distributed tracing |
| Modular monolith | Simpler ops, single deploy | Scaling is all-or-nothing |

**Recommendation: Modular monolith** with clear module boundaries:

- `auth` – IAM, sessions
- `tenants` – Tenant CRUD, settings, branding
- `recruitment` – Roles, candidates, pipelines
- `integrations` – Job boards, AI, email
- `analytics` – Reports, dashboards
- `billing` – Subscriptions, usage

Extract to microservices only when a module has distinct scaling needs (e.g. AI, VR).

### 4.5 Background Job Processing

- **Current:** None (synchronous Netlify functions)
- **Target:** BullMQ + Redis, or AWS SQS + Lambda, or Inngest
- Use cases: email sending, AI screening, job board sync, report generation
- **Recommendation:** Inngest (serverless-friendly) or BullMQ if self-hosting

### 4.6 File Storage

- **Current:** Supabase Storage; no tenant isolation
- **Target:** Path prefix `tenants/{tenant_id}/documents/`, `tenants/{tenant_id}/cv-uploads/`
- RLS on `storage.objects`: `(storage.foldername(name))[1] = tenant_id` AND user in tenant
- For scale: S3 + CloudFront with signed URLs; Supabase Storage can use S3 backend

### 4.7 AI Service Isolation

- Proxy all AI calls through backend; never expose keys to client
- Consider dedicated AI service (Lambda or container) with queue for rate limiting
- Log prompts/responses for compliance (anonymized)

### 4.8 WebSocket / Real-Time

- **Current:** Supabase Realtime (if used)
- **Use cases:** Live screening chat, notifications, collaborative editing
- **Recommendation:** Supabase Realtime for now; scope channels by `tenant_id`

### 4.9 VR Module Scaling

- VR simulations: likely GPU-heavy, bursty
- Isolate in separate service (Lambda with GPU, or dedicated EC2/GKE)
- Queue-based: user requests → job queue → VR worker → result storage

### 4.10 Cloud Provider Recommendation

| Provider | Pros | Cons | Verdict |
|----------|------|------|---------|
| **AWS** | Broadest services, enterprise adoption | Complexity | **Recommended** |
| GCP | Strong AI/ML, BigQuery | Less common in enterprise procurement | Good alternative |
| Azure | Microsoft ecosystem, hybrid | Less common for greenfield SaaS | Consider if targeting MS shops |

**Recommendation: AWS**

- ECS/EKS for API, Lambda for serverless
- RDS/Aurora for Postgres (or keep Supabase)
- S3 + CloudFront for storage/CDN
- Secrets Manager, CloudWatch, WAF
- Enterprise buyers expect AWS; easier security questionnaires

### 4.11 Infrastructure Requirements

| Area | Recommendation |
|------|----------------|
| Auto-scaling | ECS/EKS HPA, or Lambda concurrency |
| Monitoring | Datadog or CloudWatch + X-Ray |
| Logging | Structured JSON to CloudWatch; log aggregation |
| Disaster recovery | Multi-AZ RDS, S3 cross-region replication |
| Backup | Daily RDS snapshots, point-in-time recovery |

---

## 5. Job Board Licence Integration Strategy

### 5.1 Secure Integration Model

| Concern | Solution |
|---------|----------|
| OAuth token storage | Encrypt `metadata` (tokens) with KMS or app key; never log |
| Token refresh | Background job per tenant; refresh before expiry |
| Webhook ingestion | Verify signature; idempotent handlers; queue for processing |
| Rate limits | Per-connector rate limiter; exponential backoff |
| Credential types | API key, OAuth 2.0, or custom (e.g. Broadbean XML) |

### 5.2 Schema Fix for `tenant_job_board_licenses`

**Current:** `tenant_id`, `license_key`, `expires_at`  
**API expects:** `board_id`, `metadata`, `status`

**Target schema:**
```sql
ALTER TABLE tenant_job_board_licenses ADD COLUMN IF NOT EXISTS
  board_type TEXT NOT NULL,  -- 'linkedin', 'indeed', 'broadbean', etc.
  status TEXT DEFAULT 'active',
  metadata JSONB,            -- encrypted: { access_token, refresh_token, expires_at }
  last_sync_at TIMESTAMPTZ;
```

### 5.3 Connector Abstraction Layer

```
                    ┌─────────────────────────────────────────┐
                    │     Job Board Connector Interface        │
                    │  - postJob(tenantId, boardId, job)       │
                    │  - getApplicants(tenantId, boardId)       │
                    │  - refreshToken(tenantId, boardId)        │
                    └─────────────────────────────────────────┘
                                       │
         ┌─────────────────────────────┼─────────────────────────────┐
         ▼                             ▼                             ▼
   ┌───────────┐               ┌───────────────┐               ┌──────────────┐
   │ LinkedIn  │               │ Indeed        │               │ Broadbean   │
   │ Connector │               │ Connector     │               │ Connector   │
   └───────────┘               └───────────────┘               └──────────────┘
```

- Each connector: OAuth flow, token refresh, rate limit handling, error mapping
- Registry: `connectors[board_type]` → implementation
- Add new boards without changing core API

---

## 6. Enterprise Feature Layer

### 6.1 Feature Prioritization

| Phase | Features |
|-------|----------|
| **MVP Enterprise** | SSO, MFA, tenant RBAC, audit logs, encrypted job board tokens, secrets server-side, rate limiting |
| **Phase 2** | SCIM, advanced analytics, exportable reports, custom fields, multi-stage pipelines, collaboration/notes, notifications |
| **Phase 3** | Workflow builder, white-labelling, usage-based billing, SLA tiers, audit exports, SIEM webhook |

### 6.2 Detailed Feature List

| Feature | MVP | P2 | P3 |
|---------|-----|----|----|
| SSO (SAML/OIDC) | ✅ | | |
| MFA | ✅ | | |
| Tenant RBAC | ✅ | | |
| Delegated admin | ✅ | | |
| Audit logs | ✅ | | |
| SCIM | | ✅ | |
| Advanced analytics | | ✅ | |
| Exportable reports | | ✅ | |
| Custom fields | | ✅ | |
| Multi-stage pipelines | | ✅ | |
| Collaboration & notes | | ✅ | |
| Notifications | | ✅ | |
| Workflow builder | | | ✅ |
| White-labelling | | | ✅ |
| Usage-based billing | | | ✅ |
| Audit exports | | | ✅ |

---

## 7. DevOps & Deployment

### 7.1 CI/CD Pipeline

```
Push/PR → Lint → Typecheck → Test → Build → (Staging deploy) → (Prod approval) → Prod deploy
```

- GitHub Actions (existing) + add: integration tests, E2E (Playwright)
- Deploy: Netlify (current) or migrate to AWS (Amplify, ECS, or Lambda + CloudFront)

### 7.2 Environment Separation

| Env | Purpose | Database |
|-----|---------|----------|
| dev | Local + PR previews | Supabase dev project |
| staging | Pre-prod testing | Supabase staging (clone of prod schema) |
| prod | Live | Supabase prod or RDS |

### 7.3 Infrastructure as Code

- Terraform or Pulumi for AWS resources
- Supabase: use migrations (existing); consider Supabase Terraform provider for project config

### 7.4 Feature Flagging

- LaunchDarkly, Unleash, or Flagsmith
- Flags: `sso_enabled`, `ai_screening_v2`, `vr_simulations`, per-tenant overrides

### 7.5 Release Management

- Semantic versioning
- Changelog for enterprise customers
- Deprecation notices (6–12 months)

### 7.6 Blue/Green Deployment

- Two identical prod environments; switch traffic via DNS/load balancer
- Zero-downtime migrations: backward-compatible schema changes first

### 7.7 Rollback Strategy

- Keep last N deployments; one-click rollback
- Database: reversible migrations; avoid destructive changes without backup

---

## 8. Monetization & SaaS Readiness

### 8.1 Tiered Pricing Model

| Tier | Target | Price | Key limits |
|------|--------|------|------------|
| **Startup** | SMB, solo recruiters | $X/mo | 3 users, 20 roles, 500 candidates |
| **Growth** | Growing teams | $Y/mo | 15 users, 100 roles, 2000 candidates |
| **Enterprise** | Mid-market+ | Custom | Unlimited (contract), SSO, SCIM, SLA |

### 8.2 Seat-Based Pricing

- Bill per active user (or per seat)
- `tenant_users` count; exclude deactivated

### 8.3 Usage-Based Pricing

- AI simulations: per-session or per-hour
- VR usage: per-session
- Job board posting: per-post or per-board
- Track in `usage_events` table; aggregate for billing

### 8.4 Overages

- Soft limit: warn at 80%
- Hard limit: block or auto-upgrade
- Overage fee: $Z per unit over limit

### 8.5 Enterprise Contract Requirements

- MSA, DPA, SLA
- Custom terms, security questionnaire
- Dedicated support, implementation services

### 8.6 SLA Tiers

| Tier | Uptime | Support |
|------|--------|---------|
| Standard | 99.5% | Email |
| Premium | 99.9% | Email + chat |
| Enterprise | 99.95% | Dedicated CSM, phone |

---

## 9. Architecture Overview Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                         │
│  React SPA (Vite) │ AuthGuard │ TanStack Query │ No secrets in bundle             │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              API GATEWAY                                          │
│  Rate limit │ WAF │ TLS │ JWT validation │ Tenant context                        │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│   Auth / IAM          │ │   Recruitment API      │ │   Integrations API    │
│   WorkOS + Supabase   │ │   Roles, Candidates    │ │   Job boards, AI      │
│   SSO, MFA, SCIM     │ │   Pipelines, Docs      │ │   Email, Webhooks     │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
                    │                   │                   │
                    └───────────────────┼───────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DATA LAYER                                           │
│  Postgres (Supabase/RDS) │ RLS tenant-scoped │ Encrypted tokens                   │
│  Redis (sessions, rate limit) │ S3 (files, tenant-prefixed)                       │
└─────────────────────────────────────────────────────────────────────────────────┘
                                        │
                    ┌───────────────────┼───────────────────┐
                    ▼                   ▼                   ▼
┌───────────────────────┐ ┌───────────────────────┐ ┌───────────────────────┐
│   Background Jobs     │ │   AI / VR Services     │ │   External APIs       │
│   Inngest / BullMQ    │ │   Isolated, queued     │ │   LinkedIn, Indeed    │
└───────────────────────┘ └───────────────────────┘ └───────────────────────┘
```

---

## 10. Implementation Roadmap

### Phase 0–3 Months: Foundation

| Week | Deliverable |
|------|-------------|
| 1–2 | Move Grok, Adzuna, Brevo to server-side proxies; remove VITE_* secrets from client |
| 2–3 | Add `tenant_id` to roles, candidates, documents; migrate data; update RLS |
| 3–4 | Implement `tenant_roles` enum; RBAC policies for Admin, Recruiter, etc. |
| 4–5 | Fix `tenant_job_board_licenses` schema; add board_type, status, encrypted metadata |
| 5–6 | Job board connector abstraction; LinkedIn or Indeed pilot |
| 6–7 | WorkOS integration: SSO, MFA; hybrid auth flow |
| 7–8 | Audit logs table + write path for key actions |
| 8–9 | Rate limiting (API Gateway or Upstash) |
| 9–10 | Storage tenant isolation (path prefix, RLS) |
| 10–12 | Staging environment; IaC skeleton; compliance checklist draft |

### Phase 3–6 Months: Enterprise Features

| Week | Deliverable |
|------|-------------|
| 1–4 | SCIM directory sync (WorkOS) |
| 2–4 | Advanced analytics & exportable reports |
| 4–6 | Custom fields, multi-stage pipelines |
| 6–8 | Collaboration, notes, notifications |
| 8–10 | Background jobs (Inngest/BullMQ) for email, AI, sync |
| 10–12 | Usage tracking; billing integration (Stripe) |

### Phase 6–12 Months: Scale & Differentiation

| Week | Deliverable |
|------|-------------|
| 1–4 | Workflow builder |
| 2–4 | White-labelling (custom domain, branding) |
| 4–6 | VR module scaling (isolated service) |
| 6–8 | SIEM webhook, audit exports |
| 8–10 | GraphQL gateway (optional) |
| 10–12 | SOC 2 audit prep; pen test |

---

## 11. Risk Analysis

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| RLS policy bug → data leak | Medium | Critical | Automated tests for RLS; tenant isolation audit |
| Secrets exposure | High (current) | Critical | Move to server-side immediately |
| SSO integration complexity | Medium | High | Use WorkOS; avoid custom SAML |
| Job board API changes | Medium | Medium | Connector abstraction; versioning |
| Supabase scaling limits | Low | Medium | Plan migration path to RDS |
| Enterprise sales cycle | - | High | Compliance docs, security questionnaire ready |

---

## 12. Cost Considerations

| Item | Est. Monthly (USD) |
|------|--------------------|
| Supabase Pro | 25–100 |
| WorkOS | 0–500 (usage-based) |
| AWS (API, storage, etc.) | 100–500 |
| Datadog/CloudWatch | 50–200 |
| Inngest/BullMQ | 0–100 |
| **Total (early stage)** | **~200–1500** |

Enterprise tier: add dedicated infra, support, compliance (audit, pen test).

---

## 13. Technologies for Enterprise Credibility

| Area | Recommendation | Why |
|------|----------------|----------------|
| IAM | WorkOS | Enterprise SSO/SCIM; procurement familiarity |
| Database | Postgres (Supabase/RDS) | Industry standard; SOC 2 compliant options |
| Cloud | AWS | Enterprise default; security questionnaires |
| Monitoring | Datadog or AWS | SOC 2 evidence; incident response |
| Compliance | Vanta or Drata | Automate SOC 2, questionnaire responses |
| API | OpenAPI/Swagger | Enterprise integration; API docs |

---

## Appendix A: Implementation Status (Phase 0)

The following items from Phase 0–3 months have been implemented:

| Item | Status | Location |
|------|--------|----------|
| Grok API proxy (server-side) | Done | `api/grok-proxy.js`, `src/lib/grokProxyClient.ts` |
| Email (Brevo) proxy | Done | `api/email-send.js` |
| Adzuna prefers server vars | Done | `api/adzuna-proxy.js` uses `ADZUNA_*` first |
| Frontend uses proxies | Done | `aiScreeningService`, `marketDataService`, `screeningChatService`, `emailService` |
| tenant_roles enum | Done | Migration `014_tenant_roles_and_job_board_schema.sql` |
| tenant_job_board_licenses schema | Done | `board_type`, `status`, `metadata` columns |
| audit_logs table | Done | Migration `015_audit_logs.sql`, `src/services/auditService.ts` |
| tenant_id on candidates, documents | Done | Migration `016_tenant_scoped_entities.sql` |
| Tenant-scoped RLS | Done | `user_tenant_ids()`, updated policies for roles, candidates |
| Job board connector abstraction | Done | `src/services/jobBoardConnectors/` |
| job-board-post API updated | Done | Uses `board_type`, `metadata` |
| Storage tenant isolation | Done | Migration `017_storage_tenant_isolation.sql` |
| env.example updated | Done | Documents `GROK_*`, `EMAIL_*`, `ADZUNA_*` server-only vars |
| Audit log API | Done | `api/audit-log.js` – server-side write, bypasses RLS |
| Storage path utilities | Done | `src/lib/storageUtils.ts` – tenant-prefixed paths |
| Job board service | Done | `src/services/jobBoardService.ts` – `postJobToBoard(tenantId, boardType, job)` |
| Apply API sets tenant_id | Done | `api/apply.js` – candidates get `tenant_id` from role |
| Rate limiting (apply API) | Done | `api/_lib/rateLimit.js`, Upstash Redis, 10 req/min per IP |
| HSTS & security headers | Done | `netlify.toml` [[headers]] |
| Audit: logout, candidate | Done | `LoginPage`, `Index` logout, `candidatesService` |
| RBAC hook | Done | `src/hooks/useTenantRole.ts` |
| Tenant admin service | Done | `inviteUserToTenant`, `removeUserFromTenant` |
| tenant_users admin policies | Done | Migration `018_tenant_users_admin_policies.sql` |
| Tenant creation policies | Done | Migration `019_tenant_creation_policies.sql` |
| Tenant team UI | Done | `TenantTeamSection`, `TenantInviteModal` in My Business |
| Incident response runbook | Done | `docs/INCIDENT_RESPONSE.md` |
| GDPR export API | Done | `api/export-candidate-data.js`, `dataExportService.ts` |
| npm audit in CI | Done | `.github/workflows/ci.yml` |
| Viewer read-only (RBAC) | Done | `useCanWrite` hook, disabled Create/Edit/Add when !canWrite |
| Right to erasure | Done | `api/purge-candidate-data.js`, migration 020 (deleted_at) |
| OAuth encryption helper | Done | `src/lib/encryptMetadata.ts` |

**Netlify env vars:** Set `GROK_API_KEY`, `EMAIL_SERVICE_API_KEY`, `ADZUNA_APP_ID`, `ADZUNA_APP_KEY` (without `VITE_`) in production for security.

**Migrations:** Run `npm run migrate` when `DATABASE_URL` is set and Supabase is reachable. Migrations 014–017 add tenant RBAC, audit_logs, tenant-scoped entities, and storage isolation.

---

## Appendix B: Current Architecture Gaps Summary

1. **Multi-tenancy:** RLS not tenant-scoped for roles, candidates, documents
2. **RBAC:** No Admin/Recruiter/Hiring Manager roles; tenant_users.role is generic
3. **Secrets:** Grok, Adzuna, Brevo keys in client bundle
4. **IAM:** No SSO, MFA, SCIM
5. **Job boards:** Schema mismatch; no OAuth storage; no connector abstraction
6. **Storage:** No tenant isolation
7. **Audit:** No audit logs
8. **Rate limiting:** None
9. **Compliance:** No SOC 2/GDPR documentation
10. **Background jobs:** None

---

## Appendix C: Migration Order for Tenant RLS

1. Create `tenant_roles` enum and update `tenant_users`
2. Add `tenant_id` to `roles` (NOT NULL for new rows); backfill from `tenant_users` or create default tenant per profile
3. Add `tenant_id` to `candidates`, `documents`, etc.; backfill via `roles.tenant_id`
4. Rewrite RLS policies to use `tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())`
5. Add role checks for write operations (Admin/Recruiter can write; Viewer read-only)
6. Deprecate profile-only access for tenant-scoped entities

---

*Document prepared for UPhire IQ enterprise architecture planning.*
