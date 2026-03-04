-- 026_add_missing_fk_indexes.sql
-- Add indexes on unindexed foreign keys (Supabase lint 0001).
-- Improves join performance and referential integrity checks.

-- ai_screening_results (table may exist from Supabase/extensions)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'ai_screening_results') THEN
    CREATE INDEX IF NOT EXISTS idx_ai_screening_results_candidate_id ON public.ai_screening_results(candidate_id) WHERE candidate_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_ai_screening_results_role_id ON public.ai_screening_results(role_id);
  END IF;
END $$;

-- candidates
CREATE INDEX IF NOT EXISTS idx_candidates_deleted_by
  ON public.candidates(deleted_by)
  WHERE deleted_by IS NOT NULL;

-- documents
CREATE INDEX IF NOT EXISTS idx_documents_profile_id
  ON public.documents(profile_id)
  WHERE profile_id IS NOT NULL;

-- employee_details
CREATE INDEX IF NOT EXISTS idx_employee_details_profile_id
  ON public.employee_details(profile_id);

-- job_board_analytics
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'job_board_analytics') THEN
    CREATE INDEX IF NOT EXISTS idx_job_board_analytics_candidate_id ON public.job_board_analytics(candidate_id) WHERE candidate_id IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_job_board_analytics_role_id ON public.job_board_analytics(role_id);
  END IF;
END $$;

-- role_flags (resolved_by may have been added outside our migrations)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'role_flags' AND column_name = 'resolved_by') THEN
    CREATE INDEX IF NOT EXISTS idx_role_flags_resolved_by ON public.role_flags(resolved_by) WHERE resolved_by IS NOT NULL;
  END IF;
END $$;

-- shortlisted_candidates
CREATE INDEX IF NOT EXISTS idx_shortlisted_candidates_candidate_id
  ON public.shortlisted_candidates(candidate_id);
CREATE INDEX IF NOT EXISTS idx_shortlisted_candidates_role_id
  ON public.shortlisted_candidates(role_id);
