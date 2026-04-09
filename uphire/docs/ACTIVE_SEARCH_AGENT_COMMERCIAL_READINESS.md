# Active Search Commercial Readiness

This checklist defines the minimum standard for commercial deployment.

## 1) Reliability and SLA

- [ ] Scheduler enabled at agreed cadence (5/10/15 min by client tier).
- [ ] `active-search-tick` success rate >= 99%.
- [ ] Retry strategy configured for transient provider failures.
- [ ] Alerting configured for failed runs and stale-role spikes.

## 2) Safety and compliance

- [ ] Source capability checks enforced before search/message actions.
- [ ] Opt-out enforcement verified (`outreach_opt_out = true` prevents sends).
- [ ] Outreach cadence + max attempts enforced from role/client rules.
- [ ] Audit event coverage validated for all major actions.
- [ ] Per-role pause/resume operational.

## 3) AI quality controls

- [ ] Grok keys configured server-side only.
- [ ] Prompt templates reviewed for legal/compliance tone.
- [ ] Fallback behavior validated when AI provider unavailable.
- [ ] Screening and recommendation outputs sampled for quality.

## 4) Commercial KPIs to track

- [ ] Time to first qualified candidate
- [ ] Time to first shortlist
- [ ] Outreach response rate
- [ ] Stale-role rate
- [ ] Interview conversion rate
- [ ] Time-to-fill

## 5) Operational handoff

- [ ] Role Command Centre consumers integrated to status endpoint.
- [ ] Support team runbook approved.
- [ ] Pilot tenant sign-off completed.
- [ ] Change log and rollback procedure documented.

## Go/No-Go rule

Do not launch generally until:

- at least one pilot tenant has a full role lifecycle processed end-to-end, and
- stale-role rate improves vs baseline for a minimum 2-week observation window.
