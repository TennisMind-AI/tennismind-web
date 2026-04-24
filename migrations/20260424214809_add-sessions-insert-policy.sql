-- The edge function runs in the caller's auth context (user token), so it needs
-- INSERT/UPDATE permissions on sessions. RLS still enforces user_id = auth.uid().

CREATE POLICY sessions_insert_own ON sessions
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY sessions_update_own ON sessions
  FOR UPDATE TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
