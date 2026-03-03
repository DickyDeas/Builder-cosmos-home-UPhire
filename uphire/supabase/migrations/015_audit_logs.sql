-- 015_audit_logs.sql
-- Enterprise audit logging for SOC 2 / compliance

CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id TEXT,
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS tenant_id UUID;
ALTER TABLE audit_logs ADD COLUMN IF NOT EXISTS user_id UUID;

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users can view own audit logs; tenant-scoped view requires tenant_users.tenant_id
DROP POLICY IF EXISTS "Users can view tenant audit logs" ON audit_logs;
CREATE POLICY "Users can view tenant audit logs"
  ON audit_logs FOR SELECT
  USING (user_id = auth.uid() OR tenant_id IS NULL);

-- Insert via service role or SECURITY DEFINER function only (no direct client inserts)
-- Application code should use service role for writes
