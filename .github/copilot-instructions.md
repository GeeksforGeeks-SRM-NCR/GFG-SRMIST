# Copilot Instructions for GeeksforGeeks SRMIST

## Build, Test, and Lint Commands

```bash
npm run dev       # Start development server on http://localhost:3000
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint (flat config in eslint.config.mjs)
```

No test suite exists. Don't create one unless explicitly requested.

---

## Architecture Overview

### Headless CMS Architecture

```
Contentful (CMS)    ──API──┐
                           ├──► Next.js 16 App Router ──► Users
Supabase (Database) ──API──┘
```

- **Contentful**: Stores team profiles, events, blog posts, and global settings
- **Supabase**: Handles authentication, form submissions, coding challenge data, and blacklist
- **Next.js App Router**: SSR, API routes, and UI components

### Two Authentication Systems

1. **Admin auth** (`/login`): Passwordless OTP for club admins. `app/login/actions.ts` checks `ALLOWED_ADMIN_EMAILS` env var before sending OTP via `supabase.auth.signInWithOtp()`.
2. **User auth** (`/userlogin`): Separate login for general users accessing practice problems, leaderboard, and challenges. Handled by `app/actions/user-auth.ts`.

### The Governance Proxy Pattern

**Critical**: Team leads can update their own profiles, but we NEVER expose the Contentful management token to the client.

1. User authenticates via Supabase (email stored in session)
2. API route `app/api/admin/update-profile/route.ts` receives update request
3. Server queries Contentful for `memberProfile` where `fields.email` matches authenticated user's email
4. No match → 403 Forbidden; match → update applied server-side

**Never** allow direct client-side Contentful Management API calls. Always proxy through server actions or API routes.

**Super Admin Exception**: `app/api/admin/god-mode/route.ts` allows full CRUD for emails listed in the `SUPER_ADMINS` array.

### Route Protection (`proxy.ts`)

The middleware logic lives in `proxy.ts` (not `middleware.ts`). It runs on every request and handles:
1. **Supabase session refresh** (cookie management)
2. **Blacklist check**: Blocks blacklisted users from `/practice`, `/leaderboard`, and `/pages/challenges`
3. **Admin route protection**: `/admin/*` requires auth + email in `ALLOWED_ADMIN_EMAILS`
4. **Login redirect**: Authenticated users on `/login` → `/admin`

New protected routes starting with `/admin` are automatically guarded.

### Data Flow Patterns

**Public Content (Read):**
```
Contentful Delivery API → lib/contentful.js → Server Component → UI
```

**Admin Content (Write):**
```
Client Component → Server Action (app/admin/*/actions.ts) → Contentful Management API
```

**Form Submissions & Challenge Data:**
```
Client Component → Server Action → Supabase PostgreSQL
```

**Code Execution (Practice Problems):**
```
Client (Monaco Editor) → app/api/code/execute/ → Piston API (external)
```

---

## Key Conventions

### Supabase Client Selection

```typescript
// ✅ Server Components/Actions
import { createClient } from '@/lib/supabase-server'
const supabase = await createClient() // Note: await required

// ✅ Client Components
import { createClient } from '@/lib/supabase'
const supabase = createClient() // No await

// Admin operations (bypass RLS) - use with extreme caution
import { createAdminClient } from '@/lib/supabase-server'
const supabase = await createAdminClient()
```

### Contentful Content Types

- `memberProfile`: Team member profiles (unique `email` field used for auth matching)
- `event`: Club events with optional `galleryImages` (array of asset references)
- `globalSettings`: Singleton for site-wide config (recruitment status, featured event)

**Reading:**
```typescript
import { contentfulClient } from '@/lib/contentful'
const entries = await contentfulClient.getEntries({
  content_type: 'memberProfile',
  'fields.email': 'user@example.com',
  limit: 1,
})
```

**Writing (server-only):**
```typescript
import { getContentfulAdminClient } from '@/lib/contentful-admin'
const client = await getContentfulAdminClient()
const environment = await client.getEnvironment()
const entry = await environment.getEntry('ENTRY_ID')
entry.fields.bio = { 'en-US': 'New bio text' }
await entry.update()
await entry.publish()
```

### Server Actions

- Always return `{ success: boolean, message?: string, data?: any }`
- Never throw errors directly (use try/catch and return error message)
- Use `redirect()` only after successful mutations

### Two Component Directories

- `app/components/` — Page-level and feature components
- `components/ui/` — shadcn/ui primitives (configured via `components.json`)

### Styling Conventions

Dark theme with glassmorphism:
- Glass panel: `backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl`
- Background: `bg-black`, text: `text-white`, muted: `text-white/40`
- Accent colors: `purple-600`, `blue-600`, `green-500` (GFG green)
- Icons: `lucide-react` exclusively

### Path Aliases

Use `@/` prefix for all shared imports (configured in `tsconfig.json`).

### Branching

Feature branches from `dev/`. PRs target `dev/` branch.

### Environment Variables

```bash
NEXT_PUBLIC_SUPABASE_URL=           # Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=      # Supabase public key
SUPABASE_SERVICE_ROLE_KEY=          # Server-only, bypasses RLS
NEXT_PUBLIC_CONTENTFUL_SPACE_ID=    # Contentful space
NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN= # Delivery API (read-only)
NEXT_PUBLIC_CONTENTFUL_PAT=         # Management API (write, server-only despite prefix)
ALLOWED_ADMIN_EMAILS=               # Comma-separated admin emails
```

`NEXT_PUBLIC_CONTENTFUL_PAT` has a misleading `NEXT_PUBLIC_` prefix — it is a management token and must only be used server-side.

### Image Handling

Allowed remote patterns in `next.config.ts`:
- `https://images.ctfassets.net` (Contentful image CDN)
- `https://assets.ctfassets.net` (Contentful asset CDN)
