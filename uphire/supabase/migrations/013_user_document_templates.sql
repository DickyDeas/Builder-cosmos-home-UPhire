-- 013_user_document_templates.sql - Per-user document library (templates, handbooks)

-- Ensure roles has profile_id (some schemas use user_id; add profile_id if missing)
ALTER TABLE roles ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

-- Ensure documents has role_id and profile_id (some schemas differ)
ALTER TABLE documents ADD COLUMN IF NOT EXISTS role_id UUID;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS name TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS type TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS last_modified TEXT;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS auto_send BOOLEAN DEFAULT FALSE;
ALTER TABLE documents ADD COLUMN IF NOT EXISTS template TEXT;

-- RLS: allow access via profile_id (user's templates) or role (legacy)
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can manage own documents" ON documents;

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM roles r
      JOIN profiles p ON p.id = r.profile_id
      WHERE r.id::text = documents.role_id::text AND p.id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own documents"
  ON documents FOR INSERT
  WITH CHECK (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM roles r
      JOIN profiles p ON p.id = r.profile_id
      WHERE r.id::text = documents.role_id::text AND p.id = auth.uid()
    )
  );

CREATE POLICY "Users can update own documents"
  ON documents FOR UPDATE
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM roles r
      JOIN profiles p ON p.id = r.profile_id
      WHERE r.id::text = documents.role_id::text AND p.id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own documents"
  ON documents FOR DELETE
  USING (
    profile_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM roles r
      JOIN profiles p ON p.id = r.profile_id
      WHERE r.id::text = documents.role_id::text AND p.id = auth.uid()
    )
  );
