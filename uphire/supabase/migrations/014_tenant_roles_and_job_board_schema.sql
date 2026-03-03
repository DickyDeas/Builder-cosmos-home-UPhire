-- 014_tenant_roles_and_job_board_schema.sql
-- Enterprise RBAC: tenant_roles enum, tenant_users.role, tenant_job_board_licenses extended schema

-- Tenant role enum for RBAC
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tenant_role') THEN
    CREATE TYPE tenant_role AS ENUM (
      'owner',
      'admin',
      'recruiter',
      'hiring_manager',
      'interviewer',
      'viewer'
    );
  END IF;
END $$;

-- Update tenant_users.role: migrate 'member' -> 'recruiter', add constraint
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'tenant_users' AND column_name = 'role') THEN
    UPDATE tenant_users SET role = 'recruiter' WHERE role = 'member' OR role IS NULL;
    ALTER TABLE tenant_users DROP CONSTRAINT IF EXISTS tenant_users_role_check;
    ALTER TABLE tenant_users ALTER COLUMN role TYPE TEXT;
    -- Allow both old text and new enum values during transition
  END IF;
END $$;

-- Extend tenant_job_board_licenses for OAuth and connector abstraction
ALTER TABLE tenant_job_board_licenses ADD COLUMN IF NOT EXISTS board_type TEXT;
ALTER TABLE tenant_job_board_licenses ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active';
ALTER TABLE tenant_job_board_licenses ADD COLUMN IF NOT EXISTS metadata JSONB;
ALTER TABLE tenant_job_board_licenses ADD COLUMN IF NOT EXISTS last_sync_at TIMESTAMPTZ;

-- Add INSERT/UPDATE policies for tenant_users (admin can manage)
DROP POLICY IF EXISTS "Users can insert tenant_users" ON tenant_users;
DROP POLICY IF EXISTS "Users can update tenant_users" ON tenant_users;
-- Only owners/admins can insert/update tenant_users - implement via app layer or SECURITY DEFINER
-- For now, keep SELECT only; app uses service role for admin operations
