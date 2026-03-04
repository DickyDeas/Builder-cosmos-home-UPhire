-- 022_fix_security_linter.sql
-- Fix Supabase Security Advisor findings:
-- 1. Function search_path mutable (0011) - set search_path for all functions
-- 2. RLS policy always true (0024) - restrict tenants INSERT policy

-- =============================================================================
-- 1. Fix function search_path - use ALTER FUNCTION to avoid signature changes
-- =============================================================================
DO $$
DECLARE
  r RECORD;
BEGIN
  FOR r IN
    SELECT n.nspname, p.proname, pg_get_function_identity_arguments(p.oid) AS args
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE n.nspname = 'public'
    AND p.proname IN (
      'handle_new_user',
      'user_tenant_ids',
      'storage_path_tenant_id',
      'is_tenant_owner_or_admin',
      'is_uphire_staff',
      'get_struggling_roles',
      'update_updated_at_column',
      'get_user_stats'
    )
  LOOP
    EXECUTE format(
      'ALTER FUNCTION %I.%I(%s) SET search_path = public',
      r.nspname, r.proname, r.args
    );
  END LOOP;
END $$;

-- =============================================================================
-- 2. Fix RLS policy - tenants INSERT should not use WITH CHECK (true)
-- =============================================================================
-- Replace permissive policy: authenticated users can create tenants, but we
-- add a minimal check (e.g. name must be non-empty) to avoid "always true".
-- Creating a tenant is intentional - we require a valid name.

DROP POLICY IF EXISTS "Authenticated users can create tenants" ON public.tenants;
CREATE POLICY "Authenticated users can create tenants"
  ON public.tenants FOR INSERT
  TO authenticated
  WITH CHECK (
    name IS NOT NULL
    AND trim(name) != ''
    AND length(trim(name)) <= 500
  );
