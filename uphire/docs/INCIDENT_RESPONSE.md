# UPhire IQ – Incident Response Runbook

Use this runbook for security incidents. Update contacts and procedures as needed.

---

## 1. Credential Leak (API Key, Service Role, etc.)

### Immediate Actions
1. **Revoke** the exposed credential in the source system (Supabase, Brevo, Upstash, etc.)
2. **Rotate** – generate new credentials and update Netlify env vars
3. **Verify** no unauthorized access in audit logs or usage dashboards
4. **Notify** team and affected customers if data was accessed

### Prevention
- Never commit secrets to git
- Use server-side env vars only (no `VITE_` for API keys)
- Rotate keys periodically (quarterly recommended)

---

## 2. Data Breach (Unauthorized Access to Customer Data)

### Immediate Actions
1. **Contain** – revoke suspected access, disable compromised accounts
2. **Assess** – determine scope: which tenants, which data
3. **Document** – timeline, affected records, access method
4. **Notify** – GDPR: notify supervisory authority within 72 hours; notify affected data subjects
5. **Remediate** – fix vulnerability, rotate credentials, enhance monitoring

### Contacts
- DPO: [Add contact]
- Legal: [Add contact]
- Supabase support: dashboard.supabase.com

---

## 3. DDoS or Availability Attack

### Immediate Actions
1. **Enable** Cloudflare or Netlify DDoS protection if available
2. **Scale** – increase function concurrency if on Netlify
3. **Block** – identify attack patterns, block IP ranges if needed
4. **Communicate** – status page, customer notification

### Escalation
- Netlify support for infrastructure
- Consider WAF (Cloudflare, AWS WAF) for sustained attacks

---

## 4. Suspicious Activity (Brute Force, Abuse)

### Immediate Actions
1. **Rate limit** – ensure Upstash rate limiting is active on apply API
2. **Block** – add IP to blocklist if available
3. **Review** audit logs for pattern
4. **Notify** security team

---

## 5. Post-Incident

1. **Post-mortem** – root cause, timeline, impact
2. **Action items** – prevent recurrence
3. **Update** this runbook with lessons learned
4. **Share** (anonymized) with team

---

## Contact List (Update as needed)

| Role | Contact |
|------|---------|
| On-call | [Add] |
| DPO | [Add] |
| Legal | [Add] |
| Supabase | dashboard.supabase.com |
| Netlify | netlify.com/support |

---

*Last updated: March 2025*
