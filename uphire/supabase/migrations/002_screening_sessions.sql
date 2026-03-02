-- Screening sessions for live chat screening
CREATE TABLE IF NOT EXISTS screening_sessions (
  id TEXT PRIMARY KEY,
  candidate_id TEXT NOT NULL,
  candidate_name TEXT NOT NULL,
  candidate_email TEXT NOT NULL,
  role_id TEXT NOT NULL,
  role_title TEXT NOT NULL,
  role_context JSONB NOT NULL,
  questions JSONB NOT NULL,
  responses JSONB DEFAULT '[]',
  status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'expired')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Allow anonymous read/write for screening (candidate accesses via link)
ALTER TABLE screening_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert for screening_sessions"
  ON screening_sessions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Allow public select for screening_sessions"
  ON screening_sessions FOR SELECT
  USING (true);

CREATE POLICY "Allow public update for screening_sessions"
  ON screening_sessions FOR UPDATE
  USING (true);
