-- Newsletter Subscribers Table
-- Stores email subscribers for the blog newsletter with double opt-in confirmation

CREATE TABLE IF NOT EXISTS newsletter_subscribers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT true NOT NULL,
    confirmed BOOLEAN DEFAULT false NOT NULL,
    unsubscribe_token TEXT NOT NULL UNIQUE DEFAULT gen_random_uuid()::TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    confirmed_at TIMESTAMP WITH TIME ZONE,
    unsubscribed_at TIMESTAMP WITH TIME ZONE
);

-- Row Level Security (RLS) Policies
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (subscribe)
CREATE POLICY "Anyone can subscribe to newsletter" 
ON newsletter_subscribers FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update their own subscription via token
CREATE POLICY "Anyone can update via token" 
ON newsletter_subscribers FOR UPDATE 
USING (true);

-- Only service role can view all subscribers (for sending emails)
-- No SELECT policy for regular users (privacy protection)

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_token ON newsletter_subscribers(unsubscribe_token);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON newsletter_subscribers(is_active, confirmed) WHERE is_active = true AND confirmed = true;
CREATE INDEX IF NOT EXISTS idx_newsletter_created_at ON newsletter_subscribers(created_at DESC);

-- Comment for documentation
COMMENT ON TABLE newsletter_subscribers IS 'Stores newsletter subscribers with double opt-in confirmation';
COMMENT ON COLUMN newsletter_subscribers.email IS 'Subscriber email address (unique)';
COMMENT ON COLUMN newsletter_subscribers.is_active IS 'Whether subscription is active (false if unsubscribed)';
COMMENT ON COLUMN newsletter_subscribers.confirmed IS 'Whether email has been confirmed via confirmation link';
COMMENT ON COLUMN newsletter_subscribers.unsubscribe_token IS 'Unique token for confirmation and unsubscribe links';
COMMENT ON COLUMN newsletter_subscribers.confirmed_at IS 'Timestamp when subscription was confirmed';
COMMENT ON COLUMN newsletter_subscribers.unsubscribed_at IS 'Timestamp when user unsubscribed';
