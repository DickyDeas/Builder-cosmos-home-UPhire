-- 016_tenant_scoped_entities.sql
-- Add tenant_id to core entities for tenant-scoped RLS

-- Ensure roles has profile_id and tenant_id
ALTER TABLE roles ADD COLUMN IF NOT EXISTS profile_id UUID;
ALTER TABLE roles ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- Candidates: add tenant_id, backfill from roles
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS tenant_id UUID;

-- Documents: add tenant_id and role_id (some schemas differ)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS role_id UUID;

-- Backfill candidates.tenant_id from roles
UPDATE candidates c
SET tenant_id = r.tenant_id
FROM roles r
WHERE c.role_id = r.id AND c.tenant_id IS NULL AND r.tenant_id IS NOT NULL;

-- Backfill documents.tenant_id from roles (where role_id is set; skip if type mismatch)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'role_id') THEN
    UPDATE documents d SET tenant_id = r.tenant_id
    FROM roles r
    WHERE d.role_id::text = r.id::text AND d.tenant_id IS NULL AND r.tenant_id IS NOT NULL;
  END IF;
END $$;

-- Helper: get user's tenant IDs
CREATE OR REPLACE FUNCTION user_tenant_ids()
RETURNS SETOF UUID AS $$
  SELECT tenant_id FROM tenant_users WHERE user_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- RLS: Extend roles to allow tenant-based access (in addition to profile-based)
-- Users can access roles if: own profile OR member of role's tenant
DROP POLICY IF EXISTS "Users can view own roles" ON roles;
CREATE POLICY "Users can view own roles"
  ON roles FOR SELECT
  USING (
    profile_id = auth.uid()
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT user_tenant_ids()))
  );

DROP POLICY IF EXISTS "Users can insert own roles" ON roles;
CREATE POLICY "Users can insert own roles"
  ON roles FOR INSERT
  WITH CHECK (
    profile_id = auth.uid()
    AND (tenant_id IS NULL OR tenant_id IN (SELECT user_tenant_ids()))
  );

DROP POLICY IF EXISTS "Users can update own roles" ON roles;
CREATE POLICY "Users can update own roles"
  ON roles FOR UPDATE
  USING (
    profile_id = auth.uid()
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT user_tenant_ids()))
  );

DROP POLICY IF EXISTS "Users can delete own roles" ON roles;
CREATE POLICY "Users can delete own roles"
  ON roles FOR DELETE
  USING (
    profile_id = auth.uid()
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT user_tenant_ids()))
  );

-- Candidates: extend RLS for tenant-scoped access
DROP POLICY IF EXISTS "Users can view own candidates" ON candidates;
CREATE POLICY "Users can view own candidates"
  ON candidates FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      JOIN profiles p ON p.id = r.profile_id
      WHERE r.id = candidates.role_id AND p.id = auth.uid()
    )
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT user_tenant_ids()))
  );

DROP POLICY IF EXISTS "Users can insert own candidates" ON candidates;
CREATE POLICY "Users can insert own candidates"
  ON candidates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = candidates.role_id
      AND (r.profile_id = auth.uid() OR (r.tenant_id IS NOT NULL AND r.tenant_id IN (SELECT user_tenant_ids())))
    )
  );

DROP POLICY IF EXISTS "Users can update own candidates" ON candidates;
CREATE POLICY "Users can update own candidates"
  ON candidates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = candidates.role_id
      AND (r.profile_id = auth.uid() OR (r.tenant_id IS NOT NULL AND r.tenant_id IN (SELECT user_tenant_ids())))
    )
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT user_tenant_ids()))
  );

DROP POLICY IF EXISTS "Users can delete own candidates" ON candidates;
CREATE POLICY "Users can delete own candidates"
  ON candidates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = candidates.role_id
      AND (r.profile_id = auth.uid() OR (r.tenant_id IS NOT NULL AND r.tenant_id IN (SELECT user_tenant_ids())))
    )
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT user_tenant_ids()))
  );
