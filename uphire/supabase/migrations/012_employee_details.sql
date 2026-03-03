-- 012_employee_details.sql - Per-user employee directory

CREATE TABLE IF NOT EXISTS employee_details (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  position TEXT,
  department TEXT,
  start_date DATE,
  salary TEXT,
  manager TEXT,
  employment_type TEXT DEFAULT 'Full-Time',
  probation_period BOOLEAN DEFAULT FALSE,
  probation_months INTEGER DEFAULT 6,
  employee_id TEXT,
  email TEXT,
  phone_number TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add profile_id if table existed without it (e.g. from different schema)
ALTER TABLE employee_details ADD COLUMN IF NOT EXISTS profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE employee_details ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own employees" ON employee_details;
CREATE POLICY "Users can manage own employees"
  ON employee_details FOR ALL
  USING (profile_id = auth.uid())
  WITH CHECK (profile_id = auth.uid());
