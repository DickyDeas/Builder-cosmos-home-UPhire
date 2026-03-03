-- 021_candidates_exclude_deleted_rls.sql
-- RLS: exclude soft-deleted candidates from SELECT

DROP POLICY IF EXISTS "Users can view own candidates" ON candidates;
CREATE POLICY "Users can view own candidates"
  ON candidates FOR SELECT
  USING (
    (deleted_at IS NULL)
    AND (
      EXISTS (
        SELECT 1 FROM roles r
        JOIN profiles p ON p.id = r.profile_id
        WHERE r.id = candidates.role_id AND p.id = auth.uid()
      )
      OR (tenant_id IS NOT NULL AND tenant_id IN (SELECT user_tenant_ids()))
    )
  );
