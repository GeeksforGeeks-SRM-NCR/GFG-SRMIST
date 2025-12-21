[![Netlify Status](https://api.netlify.com/api/v1/badges/815be4ff-7e8a-4752-8325-a81373c7a947/deploy-status)](https://app.netlify.com/projects/gfg-srmncr/deploys)
# GEEKSFORGEEKS - SRMIST Website

Community website for the SRMIST chapter of GeeksforGeeks — built with Next.js (App Router). The project provides public pages (events, team, recruitment, challenges) and an admin area for managing events and recruitment-related content.

## Key Features

- Modern Next.js app (App Router)
- Supabase for backend/auth and server-side helpers
- Contentful for CMS-driven content
- Tailwind CSS + PostCSS for styling
- Interactive components using Three.js / react-three and GSAP
- Admin pages for events, galleries and recruitment management

## Tech Stack

- Next.js 16 (React 19)
- React, Tailwind CSS, PostCSS
- Supabase, Contentful
- Three.js (react-three-fiber), GSAP

## Repo Structure (high level)

- `app/` — Next.js routes & server components
- `app/components/` — UI components used across pages
- `app/admin/` — admin UI (events, recruitment manager)
- `lib/` — helpers for Contentful & Supabase
- `public/` — static assets

## Getting started

Prerequisites: Node 18+ and npm (or pnpm/yarn).

1. Install dependencies

```bash
npm install
```

2. Add environment variables (create `.env` from your own secrets)

Required env vars (example keys are in repo `.env` but do not commit real secrets):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_CONTENTFUL_SPACE_ID`
- `NEXT_PUBLIC_CONTENTFUL_ACCESS_TOKEN`

3. Run dev server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Scripts

- `npm run dev` — Run development server
- `npm run build` — Build for production
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Notes on development

- The app uses the App Router; pages live in `app/` and can be edited as server or client components.
- For admin flows, Supabase is used for auth and server-side operations. Content editing leverages Contentful SDK helpers in `lib/`.
- Be mindful of large asset files used by Three.js and animations.

## Deployment

Deploy on Vercel (recommended) or any platform that supports Next.js. Make sure environment variables are set in your hosting platform.

## Contributing

- Fork/branch, open PRs against the `re` branch (project default) with a clear description.
- Keep commits small and focused. Run linting before submitting.

