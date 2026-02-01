# Newsletter Feature Setup Guide

This guide walks you through setting up the complete newsletter subscription system for the GeeksforGeeks SRMIST website.

## Overview

The newsletter feature includes:
- ✅ Email subscription with double opt-in confirmation
- ✅ Unsubscribe functionality
- ✅ Blog post content management via Contentful
- ✅ Email delivery via Resend
- ✅ Glassmorphism UI consistent with site design

## Prerequisites

- [x] Supabase project set up
- [x] Contentful space configured
- [ ] Resend account created (https://resend.com)
- [x] Node.js installed

## Step-by-Step Setup

### 1. Database Setup (Supabase)

Create the `newsletter_subscribers` table in your Supabase database:

```bash
# Option 1: Run the SQL file directly in Supabase SQL Editor
# Go to: Supabase Dashboard → SQL Editor → New Query
# Copy and paste the contents of scripts/newsletter-schema.sql
# Click "Run"

# Option 2: Use Supabase CLI (if installed)
supabase db push scripts/newsletter-schema.sql
```

**Verify the table was created:**
```sql
SELECT * FROM newsletter_subscribers LIMIT 1;
```

### 2. Get Resend API Key

1. Sign up at https://resend.com
2. Verify your domain `gfgsrmncr.com` (or use their testing domain for development)
3. Go to **API Keys** → **Create API Key**
4. Copy the API key (starts with `re_`)

**Important:** For production, you MUST verify your domain to send emails. For testing, you can use Resend's test mode.

### 3. Environment Configuration

Update your `.env` file with the newsletter configuration:

```bash
# Newsletter Configuration (already added to .env)
RESEND_API_KEY=re_xxxxxxxxxxxxx  # Replace with your actual Resend API key
NEXT_PUBLIC_SITE_URL=http://localhost:3000  # Use https://gfgsrmncr.com in production
NEWSLETTER_FROM_EMAIL=mailer.gfgsrmncr@gmail.com
NEWSLETTER_FROM_NAME=GFG SRMIST
```

**For production deployment:**
```bash
NEXT_PUBLIC_SITE_URL=https://gfgsrmncr.com
```

### 4. Contentful Content Type Setup

Create the `blogPost` content type in Contentful:

```bash
node scripts/setup-blogpost.js
```

**Manual alternative:**
1. Go to Contentful Dashboard → Content model
2. Create new content type called "Blog Post" (ID: `blogPost`)
3. Add fields as documented in `docs/API_REFERENCE.md` (see blogPost section)

### 5. Create Your First Blog Post

1. Go to Contentful → Content
2. Click **Add entry** → **Blog Post**
3. Fill in required fields:
   - **Title**: "Welcome to GFG SRMIST Blog"
   - **Slug**: "welcome-to-gfg-srmist-blog"
   - **Content**: (Rich text editor) Write your post content
   - **Publish Date**: Select today's date
4. Optional: Add excerpt, author, featured image, tags
5. Click **Publish**

### 6. Verify Installation

**Test the blog page:**
```bash
npm run dev
# Visit http://localhost:3000/pages/blog
```

You should see:
- Newsletter subscription form
- Your blog post(s) displayed
- Glassmorphism styling

**Test newsletter subscription:**
1. Enter your email in the subscription form
2. Click "Subscribe"
3. Check your email for confirmation link
4. Click the confirmation link
5. You should be redirected to the blog page with a success message

### 7. Test Email Sending (Optional)

If using Resend test mode, you can only send to verified email addresses. To test:

```bash
# In Resend Dashboard:
# 1. Add your email as a verified sender
# 2. Subscribe with that email
# 3. Check inbox for confirmation email
```

## Testing Checklist

- [ ] Database table created successfully
- [ ] Environment variables configured
- [ ] blogPost content type exists in Contentful
- [ ] At least one blog post published
- [ ] Blog page loads without errors
- [ ] Newsletter form submits successfully
- [ ] Confirmation email received
- [ ] Confirmation link works and redirects to blog
- [ ] Unsubscribe link works
- [ ] Success/error notifications display correctly

## Troubleshooting

### "Failed to subscribe" error
- Check that `RESEND_API_KEY` is set correctly in `.env`
- Verify the API key is valid in Resend dashboard
- Check browser console and server logs for detailed errors

### No blog posts showing
- Verify `blogPost` content type exists in Contentful
- Check that at least one blog post is **published** (not just saved as draft)
- Verify `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN` is correct

### Confirmation email not received
- Check spam/junk folder
- Verify sender email in Resend dashboard
- For production, ensure domain is verified
- Check Resend dashboard logs for delivery status

### "Invalid token" error on confirmation
- Token might have been used already (check database)
- Link might be malformed (check `NEXT_PUBLIC_SITE_URL` is set)
- Try subscribing with a new email

## API Endpoints

See `docs/API_REFERENCE.md` for complete API documentation:

- `POST /api/newsletter/subscribe` - Subscribe to newsletter
- `GET /api/newsletter/confirm?token={token}` - Confirm subscription
- `GET /api/newsletter/unsubscribe?token={token}` - Unsubscribe

## Database Schema

The `newsletter_subscribers` table structure:

```sql
id                  UUID PRIMARY KEY
email               TEXT UNIQUE NOT NULL
is_active           BOOLEAN DEFAULT true
confirmed           BOOLEAN DEFAULT false
unsubscribe_token   TEXT UNIQUE
created_at          TIMESTAMPTZ DEFAULT NOW()
confirmed_at        TIMESTAMPTZ
unsubscribed_at     TIMESTAMPTZ
```

## Architecture Notes

**Security:**
- Newsletter subscription uses **double opt-in** (industry best practice)
- Tokens are unique UUIDs generated by Supabase
- RLS policies prevent unauthorized data access
- Resend API key is server-side only (never exposed to client)

**Email Flow:**
1. User submits email → Record created with `confirmed: false`
2. Confirmation email sent via Resend
3. User clicks link → `confirmed: true`, `confirmed_at` set
4. Only confirmed + active subscribers receive newsletters

**Unsubscribe:**
- One-click unsubscribe sets `is_active: false`
- Doesn't delete data (for compliance and re-subscription support)

## Next Steps

1. **Obtain actual Resend API key** and update `.env`
2. **Verify domain** in Resend for production email sending
3. **Create blog posts** in Contentful
4. **Test full flow** end-to-end
5. **Deploy to production** with updated `NEXT_PUBLIC_SITE_URL`

## Support

For issues or questions:
- Check `docs/API_REFERENCE.md` for API details
- Check `docs/TECH_STACK.md` for architecture overview
- Review Resend documentation: https://resend.com/docs
- Check Supabase logs for database errors

---

**Setup completed by:** GitHub Copilot CLI  
**Last updated:** February 2026
