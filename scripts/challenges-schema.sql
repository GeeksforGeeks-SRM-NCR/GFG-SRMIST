-- Challenge Whitelist Table
CREATE TABLE IF NOT EXISTS challenge_whitelist (
  email TEXT PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  added_by UUID REFERENCES auth.users(id)
);

-- Profiles Table (Extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  college_email TEXT,
  total_points INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Beginner', -- Beginner, Intermediate, Advanced, etc.
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions Table
CREATE TABLE IF NOT EXISTS submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  problem_slug TEXT NOT NULL,
  code TEXT NOT NULL,
  language TEXT NOT NULL,
  status TEXT NOT NULL, -- 'Passed', 'Failed', 'Error'
  runtime INTEGER, -- in milliseconds
  memory INTEGER, -- in bytes query result
  points_awarded INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_slug ON submissions(problem_slug);
CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON profiles(total_points DESC);

-- Trigger to create profile on Signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, avatar_url, college_email)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'avatar_url',
    new.email
  );
  return new;
end;
$$;

-- Drop trigger if exists to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create Trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- RPC for Leaderboard
CREATE OR REPLACE FUNCTION get_leaderboard(limit_count INTEGER DEFAULT 50)
RETURNS TABLE (
  username TEXT,
  avatar_url TEXT,
  total_points INTEGER,
  rank TEXT
) 
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    p.username,
    p.avatar_url,
    p.total_points,
    p.rank
  FROM profiles p
  ORDER BY p.total_points DESC
  LIMIT limit_count;
END;
$$;

-- RLS Policies (Basic)
ALTER TABLE challenge_whitelist ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE submissions ENABLE ROW LEVEL SECURITY;

-- Allow reading whitelist for checking access (securely via server action usually, but policy for good measure)
-- Actually, whitelist check is done via admin client or RPC usually, but reading own might be needed?
-- Let's keep whitelist restrictive. Only admins can read/write.
-- Assumption: Admins have a specific role or we use service role key for checks.
-- For now, allow read for authenticated users to check if they are whitelisted? No, server side check preferred.

-- Profiles: Public read, User update own
CREATE POLICY "Public profiles are viewable by everyone."
  ON profiles FOR SELECT
  USING ( true );

CREATE POLICY "Users can insert their own profile."
  ON profiles FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON profiles FOR UPDATE
  USING ( auth.uid() = id );

-- Submissions: User read own, User create own
CREATE POLICY "Users can view own submissions."
  ON submissions FOR SELECT
  USING ( auth.uid() = user_id );

CREATE POLICY "Users can create submissions."
  ON submissions FOR INSERT
  WITH CHECK ( auth.uid() = user_id );

-- Enable bucket for avatars if not exists (This is usually done in Storage UI, but SQL can't do it directly easily without extensions)
-- Placeholder comment
