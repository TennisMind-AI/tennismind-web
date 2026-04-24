-- sessions: one row per uploaded clip. Pipeline status + metadata live here.
CREATE TABLE sessions (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title            TEXT NOT NULL,
  file_url         TEXT,
  file_key         TEXT,
  duration_seconds INTEGER,
  status           TEXT NOT NULL DEFAULT 'uploaded'
                   CHECK (status IN ('uploaded', 'processing', 'done', 'error')),
  pipeline_progress REAL NOT NULL DEFAULT 0,
  score            INTEGER,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX sessions_user_created_idx ON sessions (user_id, created_at DESC);

ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY sessions_select_own ON sessions
  FOR SELECT TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY sessions_insert_own ON sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY sessions_update_own ON sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY sessions_delete_own ON sessions
  FOR DELETE TO authenticated
  USING (user_id = auth.uid());
