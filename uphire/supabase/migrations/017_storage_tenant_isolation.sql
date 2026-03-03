-- 017_storage_tenant_isolation.sql
-- Tenant-scoped storage: enforce path prefix tenants/{tenant_id}/ for documents and cv-uploads
-- Upload paths must follow: tenants/{tenant_id}/documents/... or tenants/{tenant_id}/cv-uploads/...

-- Helper: extract tenant_id from storage path (e.g. tenants/abc-123/documents/file.pdf -> abc-123)
CREATE OR REPLACE FUNCTION storage_path_tenant_id(path TEXT)
RETURNS UUID AS $$
  SELECT CASE
    WHEN path LIKE 'tenants/%' THEN
      (regexp_match(path, '^tenants/([0-9a-f-]{36})/'))[1]::UUID
    ELSE NULL
  END;
$$ LANGUAGE sql IMMUTABLE;

-- Drop existing permissive policies for documents and cv-uploads (we'll add tenant-scoped ones)
DROP POLICY IF EXISTS "Authenticated users can upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update documents" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete documents" ON storage.objects;

DROP POLICY IF EXISTS "Authenticated users can upload CVs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read CVs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update CVs" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete CVs" ON storage.objects;

-- Documents bucket: tenant-scoped access
CREATE POLICY "Tenant members can upload documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant members can read documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant members can update documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant members can delete documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    )
  );

-- CV-uploads bucket: tenant-scoped access
CREATE POLICY "Tenant members can upload CVs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cv-uploads'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant members can read CVs"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant members can update CVs"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    )
  );

CREATE POLICY "Tenant members can delete CVs"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid())
    )
  );
