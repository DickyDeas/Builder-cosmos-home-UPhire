-- 023_fix_auth_rls_initplan.sql
-- Fix Supabase Security Advisor findings:
-- 1. auth_rls_initplan (0003) - wrap auth.uid() and auth functions in (select ...) for initplan
-- 2. multiple_permissive_policies (0006) - consolidate duplicate policies where applicable

-- Helper: inline user_tenant_ids to use (select auth.uid()) for initplan
-- Pattern: tenant_id IN (SELECT user_tenant_ids()) -> tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))

-- =============================================================================
-- PROFILES
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING ((select auth.uid()) = id);

-- =============================================================================
-- ROLES (016 replaces 001)
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own roles" ON public.roles;
CREATE POLICY "Users can view own roles"
  ON public.roles FOR SELECT
  USING (
    profile_id = (select auth.uid())
    OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())))
  );

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
-- CANDIDATES (021 replaces 016)
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
-- SHORTLISTED_CANDIDATES (001) - skip interview_records, ai_predictions if not exist
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own shortlisted_candidates" ON public.shortlisted_candidates;
CREATE POLICY "Users can view own shortlisted_candidates"
  ON public.shortlisted_candidates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = shortlisted_candidates.role_id AND profiles.id = (select auth.uid())
  ));

DROP POLICY IF EXISTS "Users can manage own shortlisted_candidates" ON public.shortlisted_candidates;
CREATE POLICY "Users can manage own shortlisted_candidates"
  ON public.shortlisted_candidates FOR ALL
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = shortlisted_candidates.role_id AND profiles.id = (select auth.uid())
  ));

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'interview_records') THEN
    DROP POLICY IF EXISTS "Users can view own interview_records" ON public.interview_records;
    CREATE POLICY "Users can view own interview_records"
      ON public.interview_records FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM roles
        JOIN profiles ON profiles.id = roles.profile_id
        WHERE roles.id = interview_records.role_id AND profiles.id = (select auth.uid())
      ));
    DROP POLICY IF EXISTS "Users can manage own interview_records" ON public.interview_records;
    CREATE POLICY "Users can manage own interview_records"
      ON public.interview_records FOR ALL
      USING (EXISTS (
        SELECT 1 FROM roles
        JOIN profiles ON profiles.id = roles.profile_id
        WHERE roles.id = interview_records.role_id AND profiles.id = (select auth.uid())
      ));
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_predictions') THEN
    DROP POLICY IF EXISTS "Users can view own ai_predictions" ON public.ai_predictions;
    CREATE POLICY "Users can view own ai_predictions"
      ON public.ai_predictions FOR SELECT
      USING (EXISTS (
        SELECT 1 FROM roles
        JOIN profiles ON profiles.id = roles.profile_id
        WHERE roles.id = ai_predictions.role_id AND profiles.id = (select auth.uid())
      ));
    DROP POLICY IF EXISTS "Users can manage own ai_predictions" ON public.ai_predictions;
    CREATE POLICY "Users can manage own ai_predictions"
      ON public.ai_predictions FOR ALL
      USING (EXISTS (
        SELECT 1 FROM roles
        JOIN profiles ON profiles.id = roles.profile_id
        WHERE roles.id = ai_predictions.role_id AND profiles.id = (select auth.uid())
      ));
  END IF;
END $$;

-- =============================================================================
-- DOCUMENTS (013 replaces 001) - only if profile_id column exists
-- =============================================================================
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'documents' AND column_name = 'profile_id'
  ) THEN
    DROP POLICY IF EXISTS "Users can view own documents" ON public.documents;
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
    DROP POLICY IF EXISTS "Users can insert own documents" ON public.documents;
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
    DROP POLICY IF EXISTS "Users can update own documents" ON public.documents;
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
    DROP POLICY IF EXISTS "Users can delete own documents" ON public.documents;
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
-- SUPPORT_TICKETS (002)
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own support tickets" ON public.support_tickets;
CREATE POLICY "Users can view own support tickets"
  ON public.support_tickets FOR SELECT
  USING ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can insert own support tickets" ON public.support_tickets;
CREATE POLICY "Users can insert own support tickets"
  ON public.support_tickets FOR INSERT
  WITH CHECK ((select auth.uid()) = user_id);

DROP POLICY IF EXISTS "Users can update own support tickets" ON public.support_tickets;
CREATE POLICY "Users can update own support tickets"
  ON public.support_tickets FOR UPDATE
  USING ((select auth.uid()) = user_id);

-- =============================================================================
-- TENANTS (005)
-- =============================================================================
DROP POLICY IF EXISTS "Users can view tenants they belong to" ON public.tenants;
CREATE POLICY "Users can view tenants they belong to"
  ON public.tenants FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM tenant_users
    WHERE tenant_users.tenant_id = tenants.id
    AND tenant_users.user_id = (select auth.uid())
  ));

-- =============================================================================
-- TENANT_USERS (005, 018, 019)
-- =============================================================================
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

DROP POLICY IF EXISTS "Tenant owners and admins can invite users" ON public.tenant_users;
CREATE POLICY "Tenant owners and admins can invite users"
  ON public.tenant_users FOR INSERT
  WITH CHECK ((select is_tenant_owner_or_admin(tenant_id)));

DROP POLICY IF EXISTS "Tenant owners and admins can remove users" ON public.tenant_users;
CREATE POLICY "Tenant owners and admins can remove users"
  ON public.tenant_users FOR DELETE
  USING ((select is_tenant_owner_or_admin(tenant_id)));

DROP POLICY IF EXISTS "Users can add themselves to empty tenant" ON public.tenant_users;
CREATE POLICY "Users can add themselves to empty tenant"
  ON public.tenant_users FOR INSERT
  TO authenticated
  WITH CHECK (
    user_id = (select auth.uid())
    AND NOT EXISTS (SELECT 1 FROM tenant_users tu WHERE tu.tenant_id = tenant_users.tenant_id)
  );

-- =============================================================================
-- EMPLOYEE_DETAILS (012)
-- =============================================================================
DROP POLICY IF EXISTS "Users can manage own employees" ON public.employee_details;
CREATE POLICY "Users can manage own employees"
  ON public.employee_details FOR ALL
  USING (profile_id = (select auth.uid()))
  WITH CHECK (profile_id = (select auth.uid()));

-- =============================================================================
-- AUDIT_LOGS (015) - consolidate if "Users can view own audit logs" exists
-- =============================================================================
DROP POLICY IF EXISTS "Users can view own audit logs" ON public.audit_logs;
DROP POLICY IF EXISTS "Users can view tenant audit logs" ON public.audit_logs;
CREATE POLICY "Users can view audit logs"
  ON public.audit_logs FOR SELECT
  USING (user_id = (select auth.uid()) OR tenant_id IS NULL OR tenant_id IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid())));

-- =============================================================================
-- STORAGE.OBJECTS (017)
-- =============================================================================
DROP POLICY IF EXISTS "Tenant members can upload documents" ON storage.objects;
CREATE POLICY "Tenant members can upload documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'documents'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Tenant members can read documents" ON storage.objects;
CREATE POLICY "Tenant members can read documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Tenant members can update documents" ON storage.objects;
CREATE POLICY "Tenant members can update documents"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Tenant members can delete documents" ON storage.objects;
CREATE POLICY "Tenant members can delete documents"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'documents'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Tenant members can upload CVs" ON storage.objects;
CREATE POLICY "Tenant members can upload CVs"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'cv-uploads'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Tenant members can read CVs" ON storage.objects;
CREATE POLICY "Tenant members can read CVs"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Tenant members can update CVs" ON storage.objects;
CREATE POLICY "Tenant members can update CVs"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
    )
  );

DROP POLICY IF EXISTS "Tenant members can delete CVs" ON storage.objects;
CREATE POLICY "Tenant members can delete CVs"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'cv-uploads'
    AND (
      storage_path_tenant_id(name) IS NULL
      OR storage_path_tenant_id(name) IN (SELECT tenant_id FROM tenant_users WHERE user_id = (select auth.uid()))
    )
  );
