-- 025_fix_remaining_16_lints.sql
-- Fix the last 16 Supabase linter warnings:
-- 1. roles: insert/update/delete policies need (select auth.uid())
-- 2. candidates: all 4 policies need (select auth.uid())
-- 3. audit_logs: consolidate "Users can view audit logs" + "Users can view tenant audit logs" -> one with initplan
-- 4. shortlisted_candidates: drop "Users can view own shortlisted_candidates" (keep only manage FOR ALL)

-- =============================================================================
-- ROLES: fix insert, update, delete with initplan
-- =============================================================================
DROP POLICY IF EXISTS "Users can insert own roles" ON public.roles;
CREATE POLICY "Users can insert own roles"
  ON public.roles FOR INSERT
  WITH CHECK (
    profile_id = (select auth.uid())
    AND (tenant_id IS NULL OR tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())))
  );

DROP POLICY IF EXISTS "Users can update own roles" ON public.roles;
CREATE POLICY "Users can update own roles"
  ON public.roles FOR UPDATE
  USING (
    profile_id = (select auth.uid())
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())))
  );

DROP POLICY IF EXISTS "Users can delete own roles" ON public.roles;
CREATE POLICY "Users can delete own roles"
  ON public.roles FOR DELETE
  USING (
    profile_id = (select auth.uid())
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())))
  );

-- =============================================================================
-- CANDIDATES: fix all 4 policies with initplan
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own candidates" ON public.candidates;
CREATE POLICY "Users can view own candidates"
  ON public.candidates FOR SELECT
  USING (
    (deleted_at IS NULL)
    AND (
      EXISTS (
        SELECT 1 FROM roles r
        JOIN profiles p ON p.id = r.profile_id
        WHERE r.id = candidates.role_id AND p.id = (select auth.uid())
      )
      OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())))
    )
  );

DROP POLICY IF EXISTS "Users can insert own candidates" ON public.candidates;
CREATE POLICY "Users can insert own candidates"
  ON public.candidates FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = candidates.role_id
      AND (r.profile_id = (select auth.uid()) OR (r.tenant_id IS NOT NULL AND r.tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))))
    )
  );

DROP POLICY IF EXISTS "Users can update own candidates" ON public.candidates;
CREATE POLICY "Users can update own candidates"
  ON public.candidates FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = candidates.role_id
      AND (r.profile_id = (select auth.uid()) OR (r.tenant_id IS NOT NULL AND r.tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))))
    )
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())))
  );

DROP POLICY IF EXISTS "Users can delete own candidates" ON public.candidates;
CREATE POLICY "Users can delete own candidates"
  ON public.candidates FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM roles r
      WHERE r.id = candidates.role_id
      AND (r.profile_id = (select auth.uid()) OR (r.tenant_id IS NOT NULL AND r.tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))))
    )
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())))
  );

-- =============================================================================
-- AUDIT_LOGS: consolidate to single SELECT policy with initplan
-- =============================================================================
DROP POLICY IF EXISTS "Users can view audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view tenant audit logs" ON public.audit_logs;
CREATE POLICY "Users can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (
    user_id = (select auth.uid())
    OR tenant_id IS NULL
    OR tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
  );

-- =============================================================================
-- SHORTLISTED_CANDIDATES: drop duplicate view policy (manage FOR ALL covers SELECT)
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own shortlisted candidates" ON public.shortlisted_candidates;
DROP POLICY IF EXISTS "Users can view own shortlisted_candidates" ON public.shortlisted_candidates;
-- Ensure single policy for ALL (covers SELECT, INSERT, UPDATE, DELETE)
DROP POLICY IF EXISTS "Users can manage own shortlisted candidates" ON public.shortlisted_candidates;
DROP POLICY IF EXISTS "Users can manage own shortlisted_candidates" ON public.shortlisted_candidates;
CREATE POLICY "Users can manage own shortlisted candidates"
  ON public.shortlisted_candidates FOR ALL
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = shortlisted_candidates.role_id AND profiles.id = (select auth.uid())
  ));
