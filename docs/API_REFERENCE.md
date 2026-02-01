# GeeksforGeeks SRMIST Chapter - API Reference v2

> **Audience:** Developers  
> **Version:** 2.0  
> **Last Updated:** December 2025

---

## Table of Contents

1. [Supabase Schema](#supabase-schema)
   - [Table: recruitments](#table-recruitments)
   - [Table: registrations](#table-registrations)
2. [Contentful Content Model](#contentful-content-model)
   - [Type: memberProfile](#type-memberprofile)
   - [Type: event](#type-event)
   - [Type: globalSettings](#type-globalsettings)
3. [Internal API Routes](#internal-api-routes)
   - [Authentication](#authentication)
   - [Profile Management](#profile-management)
   - [Event Management](#event-management)
   - [Recruitment Management](#recruitment-management)

---

## Supabase Schema

The application uses Supabase (PostgreSQL) for storing form submissions and user authentication.

### Table: `recruitments`

Stores all recruitment/application form submissions.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `created_at` | `timestamptz` | DEFAULT `now()` | Submission timestamp |
| `name` | `text` | NOT NULL | Applicant's full name |
| `email_college` | `text` | NOT NULL | College email address |
| `email_personal` | `text` | NOT NULL | Personal email address |
| `phone` | `text` | NOT NULL | Phone number |
| `reg_no` | `text` | NOT NULL | College registration number |
| `year` | `integer` | NOT NULL | Current year of study (1-4) |
| `section` | `text` | NOT NULL | Section identifier |
| `branch` | `text` | NOT NULL | Branch/Department |
| `team_preference` | `text` | NOT NULL | Preferred team to join |
| `resume_link` | `text` | NOT NULL | URL to resume/portfolio |
| `techincal_skills` | `text` | NULLABLE | Technical skills description |
| `design_skills` | `text` | NULLABLE | Design skills description |
| `description` | `text` | NOT NULL | Why they want to join |

**Example Query:**
```sql
SELECT * FROM recruitments 
WHERE created_at >= '2025-01-01' 
ORDER BY created_at DESC;
```

---

### Table: `newsletter_subscribers`

Stores newsletter subscribers with double opt-in email confirmation.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `email` | `text` | NOT NULL, UNIQUE | Subscriber email address |
| `is_active` | `boolean` | NOT NULL, DEFAULT `true` | Whether subscription is active |
| `confirmed` | `boolean` | NOT NULL, DEFAULT `false` | Whether email has been confirmed |
| `unsubscribe_token` | `text` | NOT NULL, UNIQUE | Unique token for confirmation/unsubscribe |
| `created_at` | `timestamptz` | DEFAULT `now()` | Initial subscription timestamp |
| `confirmed_at` | `timestamptz` | NULLABLE | When subscription was confirmed |
| `unsubscribed_at` | `timestamptz` | NULLABLE | When user unsubscribed |

**Workflow:**
1. User subscribes → `confirmed: false`, `is_active: true`
2. Confirmation email sent with link containing `unsubscribe_token`
3. User clicks link → `confirmed: true`, `confirmed_at` set
4. User unsubscribes → `is_active: false`, `unsubscribed_at` set

**Example Query:**
```sql
-- Get all active confirmed subscribers
SELECT email FROM newsletter_subscribers 
WHERE is_active = true AND confirmed = true
ORDER BY created_at DESC;
```

---

### Table: `registrations`

Stores event registration submissions (team-based registrations).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PRIMARY KEY, DEFAULT `gen_random_uuid()` | Unique identifier |
| `created_at` | `timestamptz` | DEFAULT `now()` | Registration timestamp |
| `team_name` | `text` | NOT NULL | Name of the registering team |
| `members` | `jsonb` | NOT NULL | Array of team member objects |
| `event_id` | `text` | NOT NULL | Reference to Contentful event ID |

**`members` JSONB Structure:**
```json
[
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "9876543210",
    "role": "Team Lead"
  },
  {
    "name": "Jane Smith",
    "email": "jane@example.com",
    "phone": "9876543211",
    "role": "Member"
  }
]
```

---

## Contentful Content Model

The CMS layer uses Contentful for managing team profiles, events, and global settings.

### Type: `memberProfile`

Represents a team member's profile.

| Field | Type | Required | Unique | Description |
|-------|------|----------|--------|-------------|
| `name` | Short Text | ✅ | ❌ | Member's display name |
| `slug` | Short Text | ❌ | ❌ | URL-friendly identifier (auto-generated) |
| `email` | Short Text | ✅ | ✅ | Email address (used for auth matching) |
| `role` | Short Text | ✅ | ❌ | Position/title (e.g., "Technical Lead") |
| `team` | Short Text | ❌ | ❌ | Team name (e.g., "Technical", "Design") |
| `year` | Integer | ✅ | ❌ | Year of tenure (e.g., 2025, 2024) |
| `bio` | Long Text | ❌ | ❌ | Member biography |
| `photo` | Media (Asset) | ❌ | ❌ | Profile photo |
| `linkedin` | Short Text | ❌ | ❌ | LinkedIn profile URL |
| `github` | Short Text | ❌ | ❌ | GitHub profile URL |
| `instagram` | Short Text | ❌ | ❌ | Instagram profile URL |
| `generalMembers` | Long Text | ❌ | ❌ | Comma-separated list of team members |

**API Response Example:**
```json
{
  "sys": { "id": "abc123" },
  "fields": {
    "name": "Rahul Kumar",
    "email": "rahul@srmist.edu.in",
    "role": "Technical Lead",
    "team": "Technical",
    "year": 2025,
    "bio": "Passionate about open source...",
    "generalMembers": "Alice, Bob, Charlie"
  }
}
```

---

### Type: `event`

Represents a club event.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | Short Text | ✅ | Event name |
| `date` | Date & Time | ✅ | Event date (ISO 8601 format) |
| `venue` | Short Text | ❌ | Event location |
| `description` | Long Text | ❌ | Event details in Markdown/Rich Text |
| `registrationLink` | Short Text | ❌ | External registration URL |
| `isRegistrationOpen` | Boolean | ❌ | Whether registration is currently open |
| `galleryImages` | Media (Multiple) | ❌ | Array of image assets |

**Fetching Events (Sorted by Date):**
```javascript
const response = await contentfulClient.getEntries({
  content_type: 'event',
  order: 'fields.date',
});
```

---

### Type: `blogPost`

Represents a blog article/post.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `title` | Short Text | ✅ | Blog post title |
| `slug` | Short Text | ✅ | URL-friendly identifier (unique) |
| `excerpt` | Long Text | ❌ | Short summary/preview text |
| `content` | Rich Text | ✅ | Full blog post content |
| `author` | Short Text | ❌ | Author name |
| `publishDate` | Date & Time | ✅ | Publication date (ISO 8601) |
| `featuredImage` | Media (Asset) | ❌ | Header/thumbnail image |
| `tags` | Short Text (Multiple) | ❌ | Array of category tags |

**Fetching Blog Posts:**
```javascript
const response = await contentfulClient.getEntries({
  content_type: 'blogPost',
  order: '-fields.publishDate', // Most recent first
});
```

**API Response Example:**
```json
{
  "sys": { "id": "post123" },
  "fields": {
    "title": "Getting Started with React",
    "slug": "getting-started-react",
    "excerpt": "Learn the basics of React...",
    "author": "John Doe",
    "publishDate": "2025-02-01T00:00:00Z",
    "featuredImage": {
      "fields": {
        "file": {
          "url": "//images.ctfassets.net/..."
        }
      }
    }
  }
}
```

---

### Type: `globalSettings`

Singleton entry for site-wide configuration.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `eventName` | Short Text | ❌ | Current featured event name |
| `isRegOpen` | Boolean | ❌ | Event registration status |
| `bannerText` | Short Text | ❌ | Homepage banner message |
| `isRecruitmentOpen` | Boolean | ❌ | Master recruitment toggle |

---

## Internal API Routes

All API routes are located in `/app/api/` and use Next.js App Router conventions.

---

### Authentication

#### `POST /api/admin/auth/send-otp`

**Location:** `/app/login/actions.ts` (Server Action)

Initiates the passwordless authentication flow.

**Flow:**
1. Validates email against `ALLOWED_ADMIN_EMAILS` environment variable
2. Calls `supabase.auth.signInWithOtp()` to generate OTP
3. Supabase sends OTP via configured email provider (Resend)

**Request (Form Data):**
```
email: user@example.com
```

**Response:**
```json
{
  "success": true,
  "message": "OTP sent to your email."
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "This email is not authorized to access the admin panel."
}
```

---

#### `POST /api/admin/auth/verify-otp`

**Location:** `/app/login/actions.ts` (Server Action)

Verifies the OTP and creates a session.

**Request (Form Data):**
```
email: user@example.com
otp: 123456
```

**On Success:** Redirects to `/admin`

**On Failure:**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

---

### Profile Management

#### `POST /api/admin/update-profile`

**Location:** `/app/api/admin/update-profile/route.ts`

Updates a team member's profile in Contentful. Implements the **Governance Proxy Pattern**.

**Authorization Flow:**
1. Extract user email from `x-mock-user-email` header (production: use session)
2. Query Contentful for `memberProfile` where `fields.email` matches
3. If no match found → **403 Forbidden**
4. If match found → Update allowed fields only

**Request Headers:**
```
x-mock-user-email: lead@srmist.edu.in
Content-Type: application/json
```

**Request Body:**
```json
{
  "bio": "Updated bio text here...",
  "socialLinks": {
    "linkedin": "https://linkedin.com/in/username",
    "github": "https://github.com/username"
  }
}
```

**Success Response:**
```json
{
  "success": true,
  "entry": { /* Updated Contentful entry */ }
}
```

**Error Responses:**

| Status | Message | Cause |
|--------|---------|-------|
| 401 | Unauthorized | No email header provided |
| 403 | Forbidden: Profile not found | Email doesn't match any memberProfile |
| 500 | Internal Server Error | Contentful API error |

---

### God Mode (Super Admin)

#### `POST /api/admin/god-mode`

**Location:** `/app/api/admin/god-mode/route.ts`

Full CRUD access to Contentful for super admins only.

**Authorized Emails:**
```javascript
const SUPER_ADMINS = ['admin@club.com', 'chairperson@club.com'];
```

**Supported Actions:**

| Action | Required Fields | Description |
|--------|-----------------|-------------|
| `create` | `contentType`, `data` | Create new entry |
| `update` | `entryId`, `data` | Update existing entry |
| `delete` | `entryId` | Unpublish and delete entry |
| `publish` | `entryId` | Publish draft entry |

**Request Example (Create):**
```json
{
  "action": "create",
  "contentType": "event",
  "data": {
    "title": { "en-US": "New Event" },
    "date": { "en-US": "2025-12-25" }
  }
}
```

**Request Example (Update):**
```json
{
  "action": "update",
  "entryId": "abc123xyz",
  "data": {
    "title": { "en-US": "Updated Title" }
  }
}
```

---

### Event Management

#### Server Actions: `/app/admin/events/actions.ts`

##### `createEvent(formData: FormData)`

Creates a new event in Contentful and publishes it immediately.

**Form Fields:**
- `title` (required)
- `date` (required)
- `venue`
- `registrationLink`
- `description`

**Returns:** Redirects to `/admin/events/{newEventId}`

---

##### `updateEventDetails(formData: FormData)`

Updates event metadata.

**Form Fields:**
- `eventId` (required)
- `title`, `date`, `venue`, `registrationLink`, `description`

---

##### `uploadEventImage(eventId: string, formData: FormData)`

Uploads an image and links it to the event's gallery.

**Process:**
1. Create upload from file buffer
2. Create asset referencing the upload
3. Process asset for all locales
4. Poll until processing complete
5. Publish asset
6. Append asset link to `galleryImages` array
7. Publish updated event

---

##### `deleteEventImage(eventId: string, imageId: string)`

Removes an image from the event gallery (unlinks, does not delete asset).

---

### Recruitment Management

#### Server Actions: `/app/admin/recruitment/actions.ts`

##### `toggleRecruitmentStatus(isOpen: boolean)`

Updates the `isRecruitmentOpen` field in `globalSettings`.

**Note:** Creates a new `globalSettings` entry if none exists.

---

##### `fetchRecruitments(startDate?: string, endDate?: string)`

Fetches recruitment submissions with optional date filtering.

**Parameters:**
- `startDate`: ISO 8601 string (inclusive)
- `endDate`: ISO 8601 string (inclusive, adds 1 day internally)

**Returns:** `Array<RecruitmentRecord>`

---

##### `submitRecruitment(formData: RecruitmentFormData)`

Submits a new recruitment application to Supabase.

**Interface:**
```typescript
interface RecruitmentFormData {
  name: string;
  email_college: string;
  email_personal: string;
  phone: string;
  reg_no: string;
  year: number;
  section: string;
  branch: string;
  team_preference: string;
  resume_link: string;
  technical_skills?: string | null;
  design_skills?: string | null;
  description: string;
}
```

---

### Newsletter Management

#### `POST /api/newsletter/subscribe`

**Location:** `/app/api/newsletter/subscribe/route.ts`

Subscribes an email to the newsletter with double opt-in confirmation.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response:**
```json
{
  "message": "Success! Please check your email to confirm your subscription."
}
```

**Error Responses:**
```json
// Already subscribed
{
  "error": "This email is already subscribed!"
}

// Invalid email
{
  "error": "Valid email is required"
}

// Server error
{
  "error": "Failed to subscribe. Please try again."
}
```

**Flow:**
1. Validates email format
2. Checks if email already exists in database
3. If exists and confirmed → return error
4. If exists but unconfirmed → resend confirmation email
5. If new → insert record and send confirmation email
6. Confirmation email contains link: `{SITE_URL}/api/newsletter/confirm?token={unsubscribe_token}`

---

#### `GET /api/newsletter/confirm?token={token}`

**Location:** `/app/api/newsletter/confirm/route.ts`

Confirms email subscription via unique token link.

**Query Parameters:**
- `token` (required): The `unsubscribe_token` from database

**On Success:** Redirects to `/pages/blog?confirmed=true`

**On Error:** Redirects to `/pages/blog?error=invalid_token`

**Flow:**
1. Validates token exists
2. Finds subscriber by `unsubscribe_token`
3. Updates `confirmed: true`, `is_active: true`
4. Redirects to blog page with success message

---

#### `GET /api/newsletter/unsubscribe?token={token}`

**Location:** `/app/api/newsletter/unsubscribe/route.ts`

Unsubscribes user from newsletter.

**Query Parameters:**
- `token` (required): The `unsubscribe_token` from database

**On Success:** Displays HTML confirmation page with glassmorphism styling

**On Error:** Displays HTML error page

**Flow:**
1. Validates token exists
2. Updates `is_active: false` for matching subscriber
3. Returns styled HTML success page

---

## Environment Variables

Required environment variables for the API:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-side only

# Contentful
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=xxx
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=xxx  # Delivery API
NEXT_PUBLIC_CONTENTFUL_PAT=xxx  # Management API (Personal Access Token)
CONTENTFUL_ENVIRONMENT_ID=master  # Optional, defaults to 'master'

# Auth
ALLOWED_ADMIN_EMAILS=admin@club.com,lead1@club.com,lead2@club.com

# Newsletter (Resend)
RESEND_API_KEY=re_xxx  # Resend API key for sending emails
NEXT_PUBLIC_SITE_URL=https://gfgsrmncr.com  # Base URL for confirmation links
NEWSLETTER_FROM_EMAIL=mailer.gfgsrmncr@gmail.com  # Sender email address
NEWSLETTER_FROM_NAME=GFG SRMIST  # Sender display name
```

---

*Document maintained by Ayaan Mirza Baig*
