# Stress Testing Applicant Flow

This guide explains how to bulk load candidates to stress test the applicant flow, especially for technical roles (e.g. QlikView).

## Prerequisites

1. **Supabase configured** in `.env`:
   - `VITE_SUPABASE_URL`
   - `SUPABASE_SERVICE_ROLE_KEY`

2. **At least one user** – Sign up in the app so there is a profile.

3. **At least one role** (optional) – Create a QlikView or technical role in the app to link candidates to.

## Method 1: Node.js Stress Test Script (Recommended)

Inserts candidates directly into Supabase:

```bash
# 100 candidates (default)
npm run stress-test:applicants

# 500 candidates
node scripts/stress-test-applicants.js 500

# 1000 candidates, batch size 50
node scripts/stress-test-applicants.js 1000 50
```

The script:
- Uses the first profile as `user_id`
- Links to a QlikView role if one exists (or first available role)
- Generates QlikView-style candidates (skills: QlikView, Qlik Sense, ETL, Set Analysis, SQL, Data Modeling, etc.)
- Inserts in batches and reports timing and throughput

## Method 2: CSV Generator for UI Import

Generates a CSV for import via the Candidates → Import flow:

```bash
# 200 candidates → qlikview_candidates.csv
npm run generate:qlikview-csv

# Custom count and filename
node scripts/generate-qlikview-csv.js 500 my-stress-test.csv
```

Then use **Candidates → Import** in the app and select the generated CSV.

## Usage Limits

The default starter limit may cap candidates. For larger tests, either:
- Temporarily raise `profiles.usage_limits.candidates` for your test user in Supabase, or
- Use a plan with higher limits.

## What to Monitor During Tests

- **Supabase Dashboard** – Database size, query performance
- **Browser** – Candidates list load time, pagination
- **Network** – API response times
- **Memory** – If running very large imports

## Removing Test Data

To clean up after stress testing:

```sql
-- In Supabase SQL Editor (use with caution)
DELETE FROM candidates WHERE source = 'Stress Test';
-- Or delete by role_id if you created a dedicated test role
```
