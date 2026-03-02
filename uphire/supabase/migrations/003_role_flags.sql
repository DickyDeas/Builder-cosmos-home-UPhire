-- 003_role_flags.sql - Must support BOTH UUID and INTEGER roles.id (legacy schema)
DO $$
DECLARE
  roles_id_type TEXT;
BEGIN
  SELECT data_type INTO roles_id_type
  FROM information_schema.columns
  WHERE table_schema = 'public'
    AND table_name = 'roles'
    AND column_name = 'id';

  IF roles_id_type = 'integer' THEN
    -- Legacy schema: role_id INTEGER
    CREATE TYPE role_flag_status AS ENUM ('pending', 'approved', 'rejected');
    CREATE TYPE role_flag_type AS ENUM ('struggling', 'spam', 'other');

    CREATE TABLE role_flags (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      role_id INTEGER NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      flag_type role_flag_type NOT NULL,
      status role_flag_status DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  ELSE
    -- UUID schema: role_id UUID
    CREATE TYPE role_flag_status AS ENUM ('pending', 'approved', 'rejected');
    CREATE TYPE role_flag_type AS ENUM ('struggling', 'spam', 'other');

    CREATE TABLE role_flags (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
      flag_type role_flag_type NOT NULL,
      status role_flag_status DEFAULT 'pending',
      notes TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  END IF;
END $$;

-- Add is_uphire_staff function
CREATE OR REPLACE FUNCTION is_uphire_staff()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND subscription_plan = 'enterprise'
    -- Add additional staff check logic as needed, e.g. email domain or metadata
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add get_struggling_roles function returning role_id as TEXT
CREATE OR REPLACE FUNCTION get_struggling_roles()
RETURNS TABLE (role_id TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT rf.role_id::TEXT
  FROM role_flags rf
  WHERE rf.flag_type = 'struggling'
    AND rf.status = 'pending';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
