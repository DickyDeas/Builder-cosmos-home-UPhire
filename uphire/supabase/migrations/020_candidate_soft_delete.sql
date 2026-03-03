-- 020_candidate_soft_delete.sql
-- GDPR Right to Erasure: soft-delete support for candidates

ALTER TABLE candidates ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;
ALTER TABLE candidates ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES profiles(id);

CREATE INDEX IF NOT EXISTS idx_candidates_deleted_at ON candidates(deleted_at) WHERE deleted_at IS NOT NULL;

-- RLS: exclude soft-deleted from normal SELECT (filter in app or add to policies)
-- Existing policies remain; apps should add WHERE deleted_at IS NULL to queries
