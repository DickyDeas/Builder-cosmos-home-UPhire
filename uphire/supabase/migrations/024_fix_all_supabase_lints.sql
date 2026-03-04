-- 024_fix_all_supabase_lints.sql
-- Fix remaining 86 Supabase linter warnings:
-- 1. auth_rls_initplan: wrap auth.uid() and is_uphire_staff() in (select ...)
-- 2. multiple_permissive_policies: consolidate duplicate policies into single policies

-- Ensure is_uphire_staff exists (from 003_role_flags)
CREATE OR REPLACE FUNCTION public.is_uphire_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = (select auth.uid())
    AND subscription_plan = 'enterprise'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- =============================================================================
-- PROFILES: consolidate "UPhire staff" + "Users can view" -> one SELECT policy
-- Add "Users can insert own profile" with initplan (for handle_new_user / signup)
-- =============================================================================
DROP POLICY IF EXISTS "UPhire staff can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view profiles"
  ON public.profiles FOR SELECT
  USING ((select is_uphire_staff()) OR (select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((select auth.uid()) = id);

-- =============================================================================
-- ROLES: consolidate "UPhire staff" + "Users can view" -> one SELECT policy
-- =============================================================================
DROP POLICY IF EXISTS "UPhire staff can view all roles" ON public.roles;
DROP POLICY IF EXISTS "Users can view own roles" ON public.roles;
CREATE POLICY "Users can view roles"
  ON public.roles FOR SELECT
  USING (
    (select is_uphire_staff())
    OR profile_id = (select auth.uid())
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())))
  );

-- =============================================================================
-- EMPLOYEE_DETAILS: consolidate 4+1 policies -> single "Users can manage"
-- =============================================================================
DROP POLICY IF EXISTS "Users can delete own employees" ON public.employee_details;
DROP POLICY IF EXISTS "Users can insert own employees" ON public.employee_details;
DROP POLICY IF EXISTS "Users can update own employees" ON public.employee_details;
DROP POLICY IF EXISTS "Users can view own employees" ON public.employee_details;
DROP POLICY IF EXISTS "Users can manage own employees" ON public.employee_details;
CREATE POLICY "Users can manage own employees"
  ON public.employee_details FOR ALL
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- =============================================================================
-- DOCUMENTS: fix initplan (023 may have skipped if profile_id missing)
-- =============================================================================
DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'profile_id') THEN
    CREATE POLICY "Users can view own documents"
      ON public.documents FOR SELECT
      USING (
        profile_id = (select auth.uid())
        OR EXISTS (
          SELECT 1 FROM roles r
          JOIN profiles p ON p.id = r.profile_id
          WHERE r.id::text = documents.role_id::text AND p.id = (select auth.uid())
        )
      );
    CREATE POLICY "Users can insert own documents"
      ON public.documents FOR INSERT
      WITH CHECK (
        profile_id = (select auth.uid())
        OR EXISTS (
          SELECT 1 FROM roles r
          JOIN profiles p ON p.id = r.profile_id
          WHERE r.id::text = documents.role_id::text AND p.id = (select auth.uid())
        )
      );
    CREATE POLICY "Users can update own documents"
      ON public.documents FOR UPDATE
      USING (
        profile_id = (select auth.uid())
        OR EXISTS (
          SELECT 1 FROM roles r
          JOIN profiles p ON p.id = r.profile_id
          WHERE r.id::text = documents.role_id::text AND p.id = (select auth.uid())
        )
      );
    CREATE POLICY "Users can delete own documents"
      ON public.documents FOR DELETE
      USING (
        profile_id = (select auth.uid())
        OR EXISTS (
          SELECT 1 FROM roles r
          JOIN profiles p ON p.id = r.profile_id
          WHERE r.id::text = documents.role_id::text AND p.id = (select auth.uid())
        )
      );
  END IF;
END $$;

-- =============================================================================
-- SHORTLISTED_CANDIDATES: consolidate view + manage + delete + insert -> one ALL
-- =============================================================================
DROP POLICY IF EXISTS "Users can delete own shortlisted candidates" ON public.shortlisted_candidates;
DROP POLICY IF EXISTS "Users can insert own shortlisted candidates" ON public.shortlisted_candidates;
DROP POLICY IF EXISTS "Users can view own shortlisted candidates" ON public.shortlisted_candidates;
DROP POLICY IF EXISTS "Users can manage own shortlisted_candidates" ON public.shortlisted_candidates;
CREATE POLICY "Users can manage own shortlisted candidates"
  ON public.shortlisted_candidates FOR ALL
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = shortlisted_candidates.role_id AND profiles.id = (select auth.uid())
  ));

-- =============================================================================
-- SUPPORT_TICKETS: consolidate "create"+"insert" and "view own tickets"+"view own support tickets"
-- =============================================================================
DROP POLICY IF EXISTS "Users can create tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can view own tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can view own support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can insert own support tickets" ON public.support_tickets;
DROP POLICY IF EXISTS "Users can update own support tickets" ON public.support_tickets;
CREATE POLICY "Users can view own support tickets"
  ON public.support_tickets FOR SELECT
  USING ((select auth.uid()) = user_id);
CREATE POLICY "Users can insert own support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);
CREATE POLICY "Users can update own support tickets"
  ON public.support_tickets FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- =============================================================================
-- TENANTS: consolidate "Users can view own tenants" + "Users can view tenants they belong to"
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own tenants" ON public.tenants;
DROP POLICY IF EXISTS "Users can view tenants they belong to" ON public.tenants;
CREATE POLICY "Users can view tenants they belong to"
  ON public.tenants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM tenant_users
    WHERE tenant_users.tenant_id = tenants.id
    AND tenant_users.user_id = (select auth.uid())
  ));

-- =============================================================================
-- TENANT_USERS: consolidate view policies; keep both INSERT policies (different use cases) merged
-- =============================================================================
DROP POLICY IF EXISTS "Users can view tenant_users" ON public.tenant_users;
DROP POLICY IF EXISTS "Users can view tenant_users for their tenants" ON public.tenant_users;
CREATE POLICY "Users can view tenant_users for their tenants"
  ON public.tenant_users FOR SELECT
  USING (
    user_id = (select auth.uid())
    OR EXISTS (
      SELECT 1 FROM tenant_users tu
      WHERE tu.tenant_id = tenant_users.tenant_id
      AND tu.user_id = (select auth.uid())
    )
  );

-- Tenant INSERT: merge "Tenant owners and admins can invite" OR "Users can add themselves to empty tenant"
DROP POLICY IF EXISTS "Tenant owners and admins can invite users" ON public.tenant_users;
DROP POLICY IF EXISTS "Users can add themselves to empty tenant" ON public.tenant_users;
CREATE POLICY "Users can add to tenant"
  ON public.tenant_users FOR INSERT
  TO authenticated
  WITH CHECK (
    (select is_tenant_owner_or_admin(tenant_id))
    OR (
      user_id = (select auth.uid())
      AND NOT EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id)
    )
  );

-- =============================================================================
-- TENANT_JOB_BOARD_LICENSES: consolidate manage + view -> single policy
-- =============================================================================
DROP POLICY IF EXISTS "Users can manage tenant licenses" ON public.tenant_job_board_licenses;
DROP POLICY IF EXISTS "Users can view tenant licenses" ON public.tenant_job_board_licenses;
CREATE POLICY "Users can manage tenant licenses"
  ON public.tenant_job_board_licenses FOR ALL
  USING (
    tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
  )
  WITH CHECK (
    tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
  );

-- =============================================================================
-- ROLE_FLAGS: fix UPhire staff policies with initplan
-- =============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'role_flags') THEN
    DROP POLICY IF EXISTS "UPhire staff can update role flags" ON public.role_flags;
    DROP POLICY IF EXISTS "UPhire staff can view role flags" ON public.role_flags;
    CREATE POLICY "UPhire staff can view role flags"
      ON public.role_flags FOR SELECT
      USING ((select is_uphire_staff()));
    CREATE POLICY "UPhire staff can update role flags"
      ON public.role_flags FOR UPDATE
      USING ((select is_uphire_staff()));
  END IF;
END $$;

-- =============================================================================
-- AUDIT_LOGS: fix "Users can insert own audit logs" with initplan
-- =============================================================================
DROP POLICY IF EXISTS "Users can insert own audit logs" ON public.audit_logs;
CREATE POLICY "Users can insert own audit logs"
  ON public.audit_logs FOR INSERT
  WITH CHECK (user_id = (select auth.uid()));

-- =============================================================================
-- SUBSCRIPTIONS: fix initplan (table may exist from Supabase)
-- =============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'subscriptions') THEN
    DROP POLICY IF EXISTS "Users can insert own subscriptions" ON public.subscriptions;
    DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
    DROP POLICY IF EXISTS "Users can view own subscriptions" ON public.subscriptions;
    DROP POLICY IF EXISTS "Users can manage own subscriptions" ON public.subscriptions;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'user_id') THEN
      CREATE POLICY "Users can manage own subscriptions"
        ON public.subscriptions FOR ALL
        USING (user_id = (select auth.uid()))
        WITH CHECK (user_id = (select auth.uid()));
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'profile_id') THEN
      CREATE POLICY "Users can manage own subscriptions"
        ON public.subscriptions FOR ALL
        USING (profile_id = (select auth.uid()))
        WITH CHECK (profile_id = (select auth.uid()));
    END IF;
  END IF;
END $$;

-- =============================================================================
-- AI_SCREENING_RESULTS: fix initplan
-- =============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_screening_results') THEN
    DROP POLICY IF EXISTS "Users can insert own ai results" ON public.ai_screening_results;
    DROP POLICY IF EXISTS "Users can view own ai results" ON public.ai_screening_results;
    DROP POLICY IF EXISTS "Users can manage own ai results" ON public.ai_screening_results;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_screening_results' AND column_name = 'profile_id') THEN
      CREATE POLICY "Users can manage own ai results"
        ON public.ai_screening_results FOR ALL
        USING (profile_id = (select auth.uid()))
        WITH CHECK (profile_id = (select auth.uid()));
    ELSIF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'ai_screening_results' AND column_name = 'user_id') THEN
      CREATE POLICY "Users can manage own ai results"
        ON public.ai_screening_results FOR ALL
        USING (user_id = (select auth.uid()))
        WITH CHECK (user_id = (select auth.uid()));
    END IF;
  END IF;
END $$;

-- =============================================================================
-- JOB_BOARD_ANALYTICS: fix initplan
-- =============================================================================
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'job_board_analytics') THEN
    DROP POLICY IF EXISTS "Users can view job board analytics" ON public.job_board_analytics;
    CREATE POLICY "Users can view job board analytics"
      ON public.job_board_analytics FOR SELECT
      USING (
        tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
      );
  END IF;
END $$;
