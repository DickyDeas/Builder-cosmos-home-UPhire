# UPhire IQ – Enterprise Compliance Checklist

Use this checklist to track progress toward SOC 2 Type II readiness and GDPR compliance.

---

## SOC 2 Type II Readiness

### Access Control
- [x] RBAC model defined (tenant_roles: owner, admin, recruiter, hiring_manager, interviewer, viewer)
- [x] Tenant-scoped RLS on roles, candidates, documents
- [x] Role-based write restrictions enforced in app (useCanWrite; Add Candidate, Add Employee, Upload Document, Edit Company disabled for viewers)
- [x] Delegated tenant admin (invite, remove users) – TenantTeamSection, TenantInviteModal

### Encryption
- [ ] Verify Supabase encryption at rest (AES-256)
- [x] TLS for all APIs (Netlify default)
- [x] HSTS headers configured (Strict-Transport-Security, X-Frame-Options, X-Content-Type-Options)
- [x] OAuth encryption helper – `src/lib/encryptMetadata.ts` (use with ENCRYPTION_KEY server-side)

### Secrets Management
- [x] Grok, Brevo, Adzuna keys moved to server-side proxies
- [ ] Rotate API keys periodically
- [ ] Document key rotation procedure

### Change Management / Audit Trail
- [x] `audit_logs` table created
- [x] Audit logging wired to login, logout, role create, role update, candidate create/update/delete
- [x] Audit for tenant_user invite/remove
- [x] Audit for employee create/update, document create
- [ ] Audit log retention policy (e.g. 1 year)

### Incident Response
- [x] Create incident response runbook (credential leak, data breach, DDoS) – `docs/INCIDENT_RESPONSE.md`
- [ ] Define on-call rotation and escalation path
- [ ] Post-incident review template

### Vendor Assessment
- [ ] Document Supabase SOC 2 status
- [ ] Document Brevo (email) compliance
- [ ] Document Grok/x.ai compliance

### SOC 2 Audit
- [ ] Engage auditor for SOC 2 Type II (12-month observation period)

---

## GDPR Compliance

### Lawful Basis
- [ ] Document consent for candidate data collection
- [ ] Privacy policy updated with lawful basis

### Data Subject Rights
- [x] Right to access: Export API for candidates (JSON) – `/api/export-candidate-data`
- [x] Right to erasure: Purge API – `/api/purge-candidate-data`; soft-delete columns in migration 020
- [ ] Right to portability: Data export in machine-readable format

### Data Processing
- [ ] DPA with Supabase
- [ ] DPA with Brevo
- [ ] DPA with x.ai (Grok)
- [ ] DPO contact published in privacy policy

### Breach Notification
- [x] 72-hour breach notification process documented – `docs/INCIDENT_RESPONSE.md`
- [ ] Contact list for breach reporting (DPO, supervisory authority)

---

## Security Hardening

### API Protection
- [x] Rate limiting on `/api/apply` (Upstash Redis, 10 req/min per IP)
- [ ] Rate limiting on auth endpoints (login, signup)
- [ ] WAF rules (e.g. Cloudflare, AWS WAF)

### Vulnerability Management
- [x] Vulnerability scanning in CI (`npm audit --audit-level=high`)
- [ ] Periodic dependency audit (`npm audit`)
- [ ] Penetration test (annual)

### Security Questionnaire
- [ ] Prepare responses for common security questionnaire (e.g. Vanta, Drata, SIG)
- [ ] Bug bounty program (optional)

---

## Implementation Status

| Item | Status |
|------|--------|
| Secrets server-side | Done |
| Audit logs | Done |
| Tenant RLS | Done |
| Storage tenant isolation | Done (migration 017) |
| Rate limiting | Done (Upstash, apply API) |
| Encrypted OAuth tokens | Pending |
| DPA with vendors | Pending |

---

*Last updated: March 2025*
