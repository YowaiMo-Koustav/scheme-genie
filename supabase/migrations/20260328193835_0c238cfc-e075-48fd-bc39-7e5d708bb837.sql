
-- Fix: restrict match_history insert to authenticated users or allow anonymous with null user_id
DROP POLICY "Anyone can insert match history" ON public.match_history;

CREATE POLICY "Authenticated users can insert match history"
  ON public.match_history FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous can insert match history with null user"
  ON public.match_history FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);
