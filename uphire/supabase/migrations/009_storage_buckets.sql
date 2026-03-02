-- 009_storage_buckets.sql
-- Creates storage buckets for documents, CV uploads, and company assets.
-- Run in Supabase SQL Editor or via: npm run migrate

-- Create buckets (id = bucket name in storage API)
-- Note: If this fails, create buckets manually in Supabase Dashboard → Storage
INSERT INTO storage.buckets (id, name, public)
VALUES
  ('documents', 'documents', false),
  ('cv-uploads', 'cv-uploads', false),
  ('company-assets', 'company-assets', true)
ON CONFLICT (id) DO NOTHING;

-- RLS policies for documents bucket (authenticated users)
CREATE POLICY "Authenticated users can upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');

CREATE POLICY "Authenticated users can read documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can update documents"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'documents');

CREATE POLICY "Authenticated users can delete documents"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'documents');

-- RLS policies for cv-uploads bucket
CREATE POLICY "Authenticated users can upload CVs"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'cv-uploads');

CREATE POLICY "Authenticated users can read CVs"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'cv-uploads');

CREATE POLICY "Authenticated users can update CVs"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'cv-uploads');

CREATE POLICY "Authenticated users can delete CVs"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'cv-uploads');

-- company-assets is public: allow authenticated uploads, public read
CREATE POLICY "Authenticated users can upload company assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'company-assets');

CREATE POLICY "Public read for company assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'company-assets');

CREATE POLICY "Authenticated users can update company assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'company-assets');

CREATE POLICY "Authenticated users can delete company assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'company-assets');
