# Supabase Storage Bucket Setup

UPhire may use Supabase Storage for document uploads, CVs, and company assets. Configure buckets as needed.

## Option A: Run Migration (Recommended)

Run the storage buckets migration in Supabase SQL Editor or via CLI:

```bash
npm run migrate
```

Or manually run `supabase/migrations/009_storage_buckets.sql` in Supabase Dashboard → SQL Editor.

## Option B: Create Buckets Manually

1. Go to **Supabase Dashboard** → **Storage**
2. Click **New bucket**
3. Create buckets as required:

| Bucket Name   | Public? | Purpose                          |
|---------------|---------|----------------------------------|
| documents     | No      | HR documents, contracts          |
| cv-uploads    | No      | Candidate CV uploads             |
| company-assets| Yes     | Company logos (optional)         |

## Bucket Policies

For private buckets (`documents`, `cv-uploads`), add RLS policies so users only access their own data:

```sql
-- Example: documents bucket - users access own tenant's documents
CREATE POLICY "Users can upload documents"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'documents'
  AND auth.uid() IS NOT NULL
);

CREATE POLICY "Users can read own documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'documents'
  AND auth.uid() IS NOT NULL
  -- Add tenant/role check as needed
);
```

## File Size Limits

- Default: 50MB per file
- Adjust in Supabase Dashboard → Storage → Settings if needed

## Environment

No extra env vars required for Storage. Uses the same `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` (or service role for server-side uploads).
