-- Redesign: a session is just the analysis result for one video.
-- The full pipeline (status, progress, score, etc.) is collapsed into a single
-- edge-function call that returns text, which we store directly on the row.

DROP TABLE IF EXISTS sessions CASCADE;

CREATE TABLE sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  video_url     TEXT NOT NULL,
  analysis_text TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX sessions_user_created_idx ON sessions (user_id, created_at DESC);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

-- Users can read and delete their own sessions. Writes come from the edge
-- function (running with admin privileges), not from the client directly.
CREATE POLICY sessions_select_own ON sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY sessions_delete_own ON sessions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
