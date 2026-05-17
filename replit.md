# EduQuest

A dark-themed, gamified learning platform for Indian students (Class 9–12 + Engineering/Coding tracks). Students earn XP, maintain streaks, battle each other in real-time quizzes, and climb leaderboards.

## Run & Operate

- `cd education && npm run dev` — start the dev server (port 3000)
- `cd education && npm run build` — production build
- `cd education && npm run typecheck` — TypeScript type check

## Stack

- Next.js 16.2.6 (App Router, Turbopack dev server)
- React 19, TypeScript 5
- CSS Modules — one `.module.css` per page/component (no Tailwind)
- Prisma + PostgreSQL (with JSON fallback via EDUQUEST_PERSISTENCE_ADAPTER=json)
- Lucide React icons
- Fontsource self-hosted fonts: Space Grotesk (headings), Inter (body), JetBrains Mono (code)

## Where things live

- `education/src/app/` — Next.js App Router pages (one dir per route)
- `education/src/styles/globals.css` — CSS design system tokens (all color/space/radius variables)
- `education/src/components/layout/Navbar/` — sticky dark navbar
- `education/src/lib/` — server utilities, auth, validation, DB adapters
- `education/prisma/schema.prisma` — database schema

## Architecture decisions

- **One CSS module per page/client component** — class names in `.module.css` must exactly match `styles.X` usage in the component; mismatches render silently (class just doesn't exist).
- **Dark theme via CSS custom properties** — all colors, spacing, and shadows live in `globals.css` `:root`. Never hardcode color values in CSS modules.
- **Client/Server split** — heavy interactive components (DashboardClient, BattleClient, etc.) are lazy-loaded via `next/dynamic` from the server page shell, which also handles auth guards.
- **Turbopack dev cache** — if routes return 500/Internal Server Error, Turbopack cache is corrupted. Fix: `rm -rf education/.next` then restart the workflow.

## Dark Design System Tokens

Background layers: `--color-bg-primary` (#0D1117) → `--color-bg-secondary` (#161B22) → `--color-bg-tertiary` (#21262D) → `--color-bg-elevated` (#30363D)

Accent colors: `--color-primary` (#58A6FF electric blue), `--color-success` (#3FB950 green), `--color-danger` (#F85149 red), `--color-warning` (#D29922 amber), `--color-secondary` (#BC8CFF purple)

## Product

- **Home** `/` — class selector cards (Class 9–12) + engineering card + features + stats + CTA
- **Class pages** `/class-9` through `/class-12` — subject grid with per-subject progress bars, each class has a unique accent color
- **Engineering** `/engineering` — language track cards (Python, C++, Java, etc.) with difficulty badges + skill day-plan grids
- **Dashboard** `/dashboard` — XP progress, streak calendar, quick actions, recent activity (auth-gated)
- **Battle** `/battle` — real-time matchmaking UI with category selector and live match card (auth-gated)
- **Leaderboard** `/leaderboard` — top 3 podium + ranked table with scope filters (auth-gated)
- **Community** `/community` — discussion forums with category sidebar and post feed (auth-gated)
- **Events** `/events` — upcoming/live/completed competition cards with register button
- **Sign In / Sign Up** `/sign-in`, `/sign-up` — split-panel auth forms with track selector

## User preferences

- Separate CSS module per page — never use global or inline styles for page-specific layout
- Detailed English comments in all CSS files explaining purpose, class inventory, and usage
- Dark theme only — `#0D1117` background, `#58A6FF` primary accent
- All class names in CSS modules must exactly match `styles.X` usage in the component

## Gotchas

- **Always grep `styles\.[a-zA-Z]+` from the component FIRST** before writing its CSS module — silent class mismatches are hard to debug
- **Turbopack cache corruption** is a known Next.js 16 issue under heavy file-system writes. Fix: `rm -rf education/.next` and restart the "Start application" workflow
- The `--no-turbopack` flag does NOT exist in Next.js 16.2.6. Turbopack is always used in dev.
- `DATABASE_URL` is not set — the app uses `EDUQUEST_PERSISTENCE_ADAPTER=json` (file-based JSON fallback)
- The `education/` directory is NOT a pnpm workspace package — it runs standalone with its own `npm` and `node_modules`

## Pointers

- CSS design tokens: `education/src/styles/globals.css`
- Auth utilities: `education/src/lib/server/auth/`
- Data adapters: `education/src/lib/server/repositories/`
- API routes: `education/src/app/api/`
