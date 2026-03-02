-- 007_add_shortlist_notes.sql
-- Add notes column to shortlisted_candidates for shortlisting feedback
ALTER TABLE shortlisted_candidates ADD COLUMN IF NOT EXISTS notes TEXT;
