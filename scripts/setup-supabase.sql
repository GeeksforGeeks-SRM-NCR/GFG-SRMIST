-- Create user_submissions table
CREATE TABLE IF NOT EXISTS user_submissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    problem_slug TEXT NOT NULL,
    code TEXT NOT NULL,
    language TEXT NOT NULL,
    status TEXT NOT NULL, -- 'Passed', 'Failed'
    runtime INTEGER, -- in milliseconds
    grading_result JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create user_stats table
CREATE TABLE IF NOT EXISTS user_stats (
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    total_solved INTEGER DEFAULT 0,
    total_points INTEGER DEFAULT 0,
    last_solved_at TIMESTAMP WITH TIME ZONE
);

-- RLS Policies (Row Level Security)

-- user_submissions
ALTER TABLE user_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own submissions" 
ON user_submissions FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own submissions" 
ON user_submissions FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- user_stats
ALTER TABLE user_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all stats (for leaderboard)" 
ON user_stats FOR SELECT 
USING (true);

-- Only system/triggers should ideally update stats, but for now we might allow authenticated users to update their own stats via API (controlled by backend)
-- Or better, we can assume the backend (service role) will update this.
-- If client-side updates are needed (not recommended for stats):
-- CREATE POLICY "Users can update their own stats" ON user_stats FOR UPDATE USING (auth.uid() = user_id);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_submissions_user_id ON user_submissions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_submissions_problem_slug ON user_submissions(problem_slug);
CREATE INDEX IF NOT EXISTS idx_user_stats_total_solved ON user_stats(total_solved DESC);
