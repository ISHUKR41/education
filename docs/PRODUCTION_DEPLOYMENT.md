# Production Deployment Plan

This document explains what is already deployment-ready and what still must be hardened before treating EduQuest as a serious production system for a larger team and real student traffic.

## Ready Today

- Next.js application builds successfully with `npm run build`.
- Runtime health endpoint exists at `/api/health`.
- Runtime readiness endpoint exists at `/api/readiness`.
- Auth, community, events, dashboard, and battle APIs are organized behind route, service, and repository layers.
- Dynamic loading is already used for the heavier interactive screens.
- `.vercelignore` keeps the very large MCP planning files out of deployment payloads.
- PostgreSQL repository code, SQL migrations, and a migration runner now exist under `src/lib/server/database`.
- Redis-backed rate limiting infrastructure now exists under `src/lib/server/cache` and `src/lib/server/security`.
- Structured backend logging exists under `src/lib/server/observability`.

## Required Environment Values

Use `.env.example` as the base reference.

- `EDUQUEST_SESSION_SECRET`
- `EDUQUEST_COOKIE_SECURE`
- `EDUQUEST_PERSISTENCE_ADAPTER`
- `DATABASE_URL`
- `EDUQUEST_RATE_LIMIT_ADAPTER`
- `REDIS_URL`

Production must never use the development fallback session secret.

## Backend Readiness Gate

Before calling the platform production-ready for wider traffic:

1. Set `EDUQUEST_PERSISTENCE_ADAPTER=postgres`.
2. Set `DATABASE_URL`.
3. Run `npm run db:migrate`.
4. Set `EDUQUEST_RATE_LIMIT_ADAPTER=redis`.
5. Set `REDIS_URL`.
6. Confirm `/api/readiness` returns `ready` in the target deployment.
7. Add persistent audit logging for auth, moderation, and critical mutations.
8. Add background workers for notification, certificates, and event side effects.
9. Add full tracing around route handlers, services, and repository calls.

## Suggested Vercel Rollout

1. Configure production environment variables.
2. Deploy a preview build.
3. Run `npm run db:migrate` against the target database.
4. Run smoke tests against:
   - `/`
   - `/events`
   - `/dashboard`
   - `/api/health`
   - `/api/readiness`
5. Verify login, event registration, community posting, and battle matchmaking in preview.
6. Promote only after PostgreSQL, Redis, and session secret checks are green.

`/api/readiness` is intentionally stricter than `/api/health`. In a production runtime it returns `503` while the JSON persistence adapter, in-memory limiter, unreachable PostgreSQL, unreachable Redis, or required production environment values are still unresolved.

## Team Workflow Note

The repo now separates:

- UI routes and page-local CSS
- backend services
- repository contracts
- the active storage adapter
- database and cache infrastructure folders

That shape is intentional. It reduces merge conflicts, makes ownership clearer for a team, and lowers the cost of introducing PostgreSQL, Redis, workers, or future admin modules.
