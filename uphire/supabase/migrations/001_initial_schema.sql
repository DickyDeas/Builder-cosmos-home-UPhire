-- 001_initial_schema.sql - Standard UPhire schema
-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Subscription plan enum
CREATE TYPE subscription_plan AS ENUM ('starter', 'enterprise');

-- Candidate status enum
CREATE TYPE candidate_status AS ENUM (
  'new',
  'shortlisted',
  'interviewed',
  'hired',
  'rejected'
);

-- Profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  subscription_plan subscription_plan DEFAULT 'starter',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Roles table
CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT,
  company_name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Candidates table
CREATE TABLE candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  name TEXT,
  email TEXT,
  phone TEXT,
  status candidate_status DEFAULT 'new',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Shortlisted candidates
CREATE TABLE shortlisted_candidates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(candidate_id, role_id)
);

-- Interview records
CREATE TABLE interview_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  notes TEXT,
  rating INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI predictions
CREATE TABLE ai_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  prediction_score DECIMAL(5,2),
  prediction_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  candidate_id UUID REFERENCES candidates(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  file_name TEXT,
  file_path TEXT,
  file_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE shortlisted_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE interview_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- RLS policies: users access own data (assuming auth.uid() = profiles.id)
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can view own roles"
  ON roles FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = roles.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can insert own roles"
  ON roles FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = roles.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can update own roles"
  ON roles FOR UPDATE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = roles.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can delete own roles"
  ON roles FOR DELETE
  USING (EXISTS (SELECT 1 FROM profiles WHERE profiles.id = roles.profile_id AND profiles.id = auth.uid()));

CREATE POLICY "Users can view own candidates"
  ON candidates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = candidates.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can insert own candidates"
  ON candidates FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = candidates.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can update own candidates"
  ON candidates FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = candidates.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can delete own candidates"
  ON candidates FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = candidates.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can view own shortlisted_candidates"
  ON shortlisted_candidates FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = shortlisted_candidates.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can manage own shortlisted_candidates"
  ON shortlisted_candidates FOR ALL
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = shortlisted_candidates.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can view own interview_records"
  ON interview_records FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = interview_records.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can manage own interview_records"
  ON interview_records FOR ALL
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = interview_records.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can view own ai_predictions"
  ON ai_predictions FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = ai_predictions.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can manage own ai_predictions"
  ON ai_predictions FOR ALL
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = ai_predictions.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can view own documents"
  ON documents FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = documents.role_id AND profiles.id = auth.uid()
  ));

CREATE POLICY "Users can manage own documents"
  ON documents FOR ALL
  USING (EXISTS (
    SELECT 1 FROM roles
    JOIN profiles ON profiles.id = roles.profile_id
    WHERE roles.id = documents.role_id AND profiles.id = auth.uid()
  ));
