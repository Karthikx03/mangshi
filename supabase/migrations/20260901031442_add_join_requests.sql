-- Join / interest form submissions from the public "/join" page.
-- Unlike farm_supply and preorders (operational data the app displays back
-- to visitors), this table holds personal contact details, so it is NOT
-- readable through the public anon key — only inserts are allowed.

CREATE TABLE IF NOT EXISTS public.join_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  name text NOT NULL,
  email text NOT NULL,
  role text NOT NULL,
  note text
);

ALTER TABLE public.join_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (anon or authenticated) may submit the join form.
CREATE POLICY "Anyone can submit a join request"
  ON public.join_requests
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policy is defined, so — by RLS's default-deny —
-- submitted names/emails are not readable through the public anon key.
-- Read them from the Supabase dashboard (which uses the service role and
-- bypasses RLS), or add a policy scoped to an authenticated admin role
-- later if the team needs in-app access to the list.
