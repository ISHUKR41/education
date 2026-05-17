# `src/app/` — Next.js App Router Pages

All pages and route groups for EduQuest. Each directory becomes a URL route.

## Route Map

| Path | File | Notes |
|------|------|-------|
| `/` | `page.tsx` + `HomePage.module.css` | Dark hero landing page |
| `/class-9` | `class-9/page.tsx` | Class 9 subject grid (6 subjects) |
| `/class-10` | `class-10/page.tsx` | Class 10 board prep (6 subjects) |
| `/class-11` | `class-11/page.tsx` + `Class11StreamSelector.tsx` | Stream selector: Science / Commerce / Arts |
| `/class-12` | `class-12/page.tsx` + `Class12StreamSelector.tsx` | Board + entrance prep, 3 streams |
| `/engineering` | `engineering/page.tsx` | Programming language tracks + CS skills |
| `/dashboard` | `dashboard/page.tsx` (server guard) + `DashboardClient.tsx` | Auth-gated, lazy-loaded |
| `/battle` | `battle/page.tsx` (server) + `BattleClient.tsx` | Real-time quiz battles |
| `/leaderboard` | `leaderboard/page.tsx` + `LeaderboardClient.tsx` | XP rankings with scope filters |
| `/community` | `community/page.tsx` | Discussion forums |
| `/events` | `events/page.tsx` | Competitions and live events |
| `/sign-in` | `sign-in/page.tsx` | JWT session login |
| `/sign-up` | `sign-up/page.tsx` | Account creation with track selection |
| `/api/*` | `api/` directory | Next.js Route Handlers |

## CSS Module Convention

- **One `.module.css` file per page** — never share a CSS module across pages.
- **Class names must exactly match `styles.X` references** in the component — mismatches silently do nothing (no error is thrown).
- **All colors use CSS custom properties** from `globals.css` — never hardcode hex values inside module files.
- If a new token is needed, add it to `globals.css` first, then reference it via `var(--token-name)`.

## Auth-Gated Pages

Dashboard, Battle, and Leaderboard check for a valid JWT session cookie **on the server** before rendering.
Unauthenticated requests are redirected to `/sign-in?next=<current-path>`.

## Lazy Loading Pattern

Interactive client components on auth-gated pages are loaded with `next/dynamic` so the initial JS bundle stays small and supports 100+ concurrent users. The `loading` prop renders a skeleton while the chunk downloads.

## Adding a New Page

1. Create `src/app/<route>/page.tsx` and export `metadata` for SEO.
2. Create `src/app/<route>/<Route>.module.css` with only the class names used in the component.
3. For auth-gated pages: add a server-side cookie check and `redirect()` call.
4. For heavy client components: use `next/dynamic` with a `DashboardLoadingSkeleton`-style fallback.
5. Update this README's Route Map table.
