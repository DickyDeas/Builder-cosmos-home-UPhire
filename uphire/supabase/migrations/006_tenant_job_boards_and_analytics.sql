-- 006_tenant_job_boards_and_analytics.sql
CREATE TABLE tenant_job_board_licenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  license_key TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- job_board_analytics: use DO block to check roles.id and candidates.id types
DO $$
DECLARE
  roles_id_type TEXT;
  candidates_id_type TEXT;
BEGIN
  SELECT data_type INTO roles_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'roles'
    AND column_name = 'id';

  SELECT data_type INTO candidates_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'candidates'
    AND column_name = 'id';

  IF roles_id_type = 'integer' AND candidates_id_type = 'integer' THEN
    -- Both integer: create job_board_analytics with INTEGER FKs
    CREATE TABLE job_board_analytics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      candidate_id INTEGER REFERENCES candidates(id) ON DELETE SET NULL,
      event_type TEXT,
      event_data JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- UUID schema
    CREATE TABLE job_board_analytics (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
      role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      candidate_id UUID REFERENCES candidates(id) ON DELETE SET NULL,
      event_type TEXT,
      event_data JSONB,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Add careers_url to tenants if not exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'tenants'
      AND column_name = 'careers_url'
  ) THEN
    ALTER TABLE tenants ADD COLUMN careers_url TEXT;
  END IF;
END $$;
