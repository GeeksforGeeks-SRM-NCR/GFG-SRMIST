-- ============================================================
-- MASTER SUPABASE SETUP SCRIPT FOR GEEKSFORGEEKS SRMIST
-- Run this complete script in Supabase Dashboard -> SQL Editor
-- ============================================================

-- 1. PROFILES TABLE (Linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  college_email TEXT,
  total_points INTEGER DEFAULT 0,
  rank TEXT DEFAULT 'Beginner',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_total_points ON public.profiles(total_points DESC);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" 
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Trigger to auto-create profile on auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url, college_email)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url',
    NEW.email
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 2. RECRUITMENTS TABLE
CREATE TABLE IF NOT EXISTS public.recruitments (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  name              TEXT NOT NULL,
  email_college     TEXT NOT NULL,
  email_personal    TEXT NOT NULL,
  phone             TEXT NOT NULL,
  reg_no            TEXT NOT NULL,
  year              INTEGER NOT NULL,
  section           TEXT NOT NULL,
  branch            TEXT NOT NULL,
  team_preference   TEXT NOT NULL,
  resume_link       TEXT NOT NULL,
  techincal_skills  TEXT,
  design_skills     TEXT,
  description       TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_recruitments_created_at ON public.recruitments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recruitments_team_preference ON public.recruitments(team_preference);

ALTER TABLE public.recruitments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to recruitments"
  ON public.recruitments FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read to recruitments"
  ON public.recruitments FOR SELECT TO authenticated USING (true);


-- 3. BLACKLIST TABLE
CREATE TABLE IF NOT EXISTS public.blacklist (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  blocked_at  TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_blacklist_email ON public.blacklist(email);

ALTER TABLE public.blacklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow read to blacklist for authenticated users"
  ON public.blacklist FOR SELECT TO authenticated USING (true);


-- 4. REGISTRATIONS TABLE (Event & Team registrations)
CREATE TABLE IF NOT EXISTS public.registrations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  team_name   TEXT NOT NULL,
  members     JSONB NOT NULL DEFAULT '[]',
  event_id    TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations(created_at DESC);

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to registrations"
  ON public.registrations FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read to registrations"
  ON public.registrations FOR SELECT TO authenticated USING (true);


-- 5. NEWSLETTER SUBSCRIBERS TABLE
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email             TEXT NOT NULL UNIQUE,
  is_active         BOOLEAN NOT NULL DEFAULT true,
  confirmed         BOOLEAN NOT NULL DEFAULT false,
  unsubscribe_token TEXT NOT NULL UNIQUE,
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  confirmed_at      TIMESTAMPTZ,
  unsubscribed_at   TIMESTAMPTZ
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert to newsletter_subscribers"
  ON public.newsletter_subscribers FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated read to newsletter_subscribers"
  ON public.newsletter_subscribers FOR SELECT TO authenticated USING (true);


-- 6. SUBMISSIONS TABLE (Code/Challenges submissions)
CREATE TABLE IF NOT EXISTS public.submissions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  problem_slug    TEXT NOT NULL,
  code            TEXT NOT NULL,
  language        TEXT NOT NULL,
  status          TEXT NOT NULL,
  runtime         INTEGER,
  memory          INTEGER,
  points_awarded  INTEGER DEFAULT 0,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_submissions_user_id ON public.submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_submissions_problem_slug ON public.submissions(problem_slug);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own submissions"
  ON public.submissions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own submissions"
  ON public.submissions FOR INSERT WITH CHECK (auth.uid() = user_id);
