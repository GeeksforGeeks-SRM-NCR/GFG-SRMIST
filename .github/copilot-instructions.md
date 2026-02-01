# Copilot Instructions for GeeksforGeeks SRMIST

## Build, Test, and Lint Commands

```bash
# Development
npm run dev              # Start development server on http://localhost:3000

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint checks (configured in eslint.config.mjs)
```

**Note:** No test suite currently exists. Don't create one unless explicitly requested.

---

## Architecture Overview

### Headless CMS Architecture

This project uses a **headless architecture** with three distinct layers:

```
Contentful (CMS)    ──API──┐
                           ├──► Next.js (Frontend) ──► Users
Supabase (Database) ──API──┘
```

- **Contentful**: Stores team profiles, events, and global settings (content management)
- **Supabase**: Handles authentication, form submissions, and relational data
- **Next.js App Router**: Server-side rendering, API routes, and UI components

### The Governance Proxy Pattern

**Critical Security Concept**: Team leads can update their own profiles, but we NEVER expose the `NEXT_PUBLIC_CONTENTFUL_PAT` (management token) to the client.

**How it works:**
1. User authenticates via Supabase (email stored in session)
2. API route `/app/api/admin/update-profile/route.ts` receives update request
3. Server queries Contentful for `memberProfile` where `fields.email` matches authenticated user's email
4. If no match → 403 Forbidden
5. If match → Update is allowed and applied server-side

**Never** allow direct client-side Contentful Management API calls. Always proxy through server actions or API routes.

**Super Admin Exception**: `/app/api/admin/god-mode/route.ts` allows full CRUD for emails listed in the `SUPER_ADMINS` array.

### Authentication Flow

- **Passwordless OTP**: Uses `supabase.auth.signInWithOtp()` with email
- **Email Allowlist**: `/app/login/actions.ts` checks `ALLOWED_ADMIN_EMAILS` env var before sending OTP
- **Middleware Protection**: `/middleware.ts` guards all `/admin/*` routes
  - Redirects unauthenticated users to `/login`
  - **NEW (Security Fix)**: Now also checks if authenticated user's email is in `ALLOWED_ADMIN_EMAILS`
  - Signs out unauthorized users attempting to access admin panel

### Data Flow Patterns

**Public Content (Read):**
```
Contentful Delivery API → lib/contentful.js → Server Component → UI
```

**Admin Content (Write):**
```
Client Component → Server Action (app/admin/*/actions.ts) → Contentful Management API
```

**Form Submissions:**
```
Client Component → Server Action → Supabase PostgreSQL
```

---

## Key Conventions

### File Structure Patterns

```
app/
├── admin/              # Protected routes (requires auth)
│   ├── events/         # Event management
│   │   ├── actions.ts  # Server actions for event CRUD
│   │   └── [id]/       # Dynamic route for single event
│   └── page.tsx        # Pages are Server Components by default
├── api/                # API routes (when Server Actions aren't suitable)
├── components/         # Shared UI components
└── actions/            # Global server actions

lib/
├── supabase-server.js  # Server-side Supabase client (use in Server Components/Actions)
├── supabase.js         # Client-side Supabase client (use in Client Components)
├── contentful.js       # Contentful Delivery API (read-only)
└── contentful-admin.ts # Contentful Management API (write, server-only)
```

### Server vs Client Components

**Naming Convention:**
- Files with `'use server'` are Server Actions (must be `.ts` or `.js`)
- Files with `'use client'` are Client Components (can be `.tsx` or `.jsx`)
- No directive = Server Component by default in App Router

**When to use Server Components:**
- Fetching data from Contentful or Supabase
- Admin dashboard pages that display data
- Layouts and static content

**When to use Client Components:**
- Forms with interactivity
- Animations (GSAP, Three.js, Framer Motion)
- Event handlers (onClick, onChange, etc.)
- State management (useState, useReducer)

**Pattern for mixed usage:**
```tsx
// page.tsx (Server Component)
import ClientForm from './ClientForm'

export default async function Page() {
  const data = await fetchFromContentful() // Server-side fetch
  return <ClientForm initialData={data} />
}

// ClientForm.tsx
'use client'
export default function ClientForm({ initialData }) {
  // Client-side interactivity
}
```

### Supabase Client Selection

**Never mix these up:**

```typescript
// ✅ Server Components/Actions
import { createClient } from '@/lib/supabase-server'
const supabase = await createClient() // Note: await required

// ✅ Client Components
import { createClient } from '@/lib/supabase'
const supabase = createClient() // No await
```

**Admin operations (bypass RLS):**
```typescript
import { createAdminClient } from '@/lib/supabase-server'
const supabase = await createAdminClient()
// Uses SUPABASE_SERVICE_ROLE_KEY - be extremely careful!
```

### Contentful Content Types

**Key content types:**
- `memberProfile`: Team member profiles (unique `email` field used for auth matching)
- `event`: Club events with optional `galleryImages` (array of asset references)
- `globalSettings`: Singleton for site-wide config (recruitment status, featured event)

**Fetching pattern:**
```typescript
import { contentfulClient } from '@/lib/contentful'

// Get all entries of a type
const entries = await contentfulClient.getEntries({
  content_type: 'event',
  order: 'fields.date', // Sort by date
})

// Get specific entry
const entry = await contentfulClient.getEntry('ENTRY_ID')

// Filter by field
const entries = await contentfulClient.getEntries({
  content_type: 'memberProfile',
  'fields.email': 'user@example.com',
  limit: 1,
})
```

**Updating pattern (server-only):**
```typescript
import { getContentfulAdminClient } from '@/lib/contentful-admin'

const client = await getContentfulAdminClient()
const environment = await client.getEnvironment()

// Get entry
const entry = await environment.getEntry('ENTRY_ID')

// Update fields (locale-specific)
entry.fields.bio = { 'en-US': 'New bio text' }

// Save and publish
await entry.update()
await entry.publish()
```

### Environment Variables

**Required for development (.env):**
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...  # Server-only, never expose

# Contentful
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=xxx
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN=xxx  # Delivery API (read-only)
NEXT_PUBLIC_CONTENTFUL_PAT=xxx  # Management API (write, server-only)
CONTENTFUL_ENVIRONMENT_ID=master  # Optional

# Auth
ALLOWED_ADMIN_EMAILS=email1@example.com,email2@example.com
```

**Security notes:**
- `NEXT_PUBLIC_*` variables are exposed to the browser - only use for public keys
- Never use `NEXT_PUBLIC_CONTENTFUL_PAT` - management token must stay server-side
- `SUPABASE_SERVICE_ROLE_KEY` bypasses Row Level Security - use with extreme caution

### Styling Conventions

**Glassmorphism Pattern (project standard):**
```jsx
<div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl">
  {/* Glass card content */}
</div>
```

**Common patterns:**
- Glass panel: `backdrop-blur-xl bg-white/5 border border-white/10`
- Hover glow: `hover:bg-white/10 transition-all duration-300`
- Gradient text: `bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60`
- Ambient blobs: `absolute w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]`

**Color system:**
- Background: `bg-black`
- Text primary: `text-white`
- Text muted: `text-white/40` or `text-white/50`
- Borders: `border-white/10` or `border-white/20`
- Accent: `purple-600`, `blue-600`, `green-500` (GFG green)

**Icons:** Use `lucide-react` for all icons:
```tsx
import { Mail, Loader2, ArrowRight } from 'lucide-react'
<Mail size={18} className="text-white" />
<Loader2 className="animate-spin" /> // Loading spinner
```

### Path Aliases

Use `@/` prefix for absolute imports (configured in `tsconfig.json`):

```typescript
// ✅ Correct
import { createClient } from '@/lib/supabase-server'
import EventCard from '@/app/components/EventCard'

// ❌ Avoid relative paths for shared code
import { createClient } from '../../../lib/supabase-server'
```

### Middleware Behavior

`/middleware.ts` runs on every request and handles:
1. **Supabase session refresh** (cookie management)
2. **Blacklist check** (blocks users from specific routes)
3. **Admin route protection:**
   - No user → redirect to `/login`
   - User not in `ALLOWED_ADMIN_EMAILS` → sign out + redirect to `/login?error=unauthorized`
4. **Login page redirect** (authenticated users → `/admin`)

When adding new protected routes, they're automatically guarded if they start with `/admin`.

### Server Actions Best Practices

**Return values:**
- Always return `{ success: boolean, message?: string, data?: any }`
- Never throw errors directly (use try/catch and return error message)
- Use `redirect()` only after successful mutations

**Example pattern:**
```typescript
'use server'
import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'

export async function submitForm(formData: FormData) {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('table').insert({ ... })
    
    if (error) {
      return { success: false, message: error.message }
    }
    
    redirect('/success-page')
  } catch (error) {
    return { success: false, message: 'Unexpected error occurred' }
  }
}
```

### Image Handling

**Next.js Image component:**
```tsx
import Image from 'next/image'

// Contentful images (configured in next.config.ts)
<Image 
  src={contentfulAssetUrl} 
  alt="..." 
  width={500} 
  height={300} 
  className="..."
/>
```

**Allowed remote patterns:**
- `https://images.ctfassets.net` (Contentful CDN)

---

## Common Tasks

### Adding a new admin email
1. Update `.env` file: `ALLOWED_ADMIN_EMAILS=existing@example.com,new@example.com`
2. Restart dev server (env changes require restart)
3. User can now login at `/login`

### Creating a new event
Admin dashboard → Events → Create Event → Fill form (title, date, venue, description)

### Adding images to event gallery
Admin dashboard → Events → Select event → Upload images section

### Fetching team members by year
```typescript
const entries = await contentfulClient.getEntries({
  content_type: 'memberProfile',
  'fields.year': 2025,
  order: 'fields.name',
})
```

### Toggling recruitment status
Admin dashboard → Recruitment → Toggle switch (updates `globalSettings.isRecruitmentOpen`)

---

## Documentation References

- **Architecture Deep Dive**: `/docs/TECH_STACK.md`
- **API Details & Schemas**: `/docs/API_REFERENCE.md`
- **Grading Logic**: `/docs/GRADING_LOGIC.md` (for coding challenges)
- **User Guide**: `/docs/USER_GUIDE.md`

For detailed information about the Governance Proxy Pattern, auth flow, and content model structure, refer to `TECH_STACK.md`.
