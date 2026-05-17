# EduQuest Implementation Status

## Frontend And Backend Location

The app is currently implemented as a deployable full-stack Next.js project.

- Frontend runtime:
  - `src/app`
  - `src/components`
  - `src/styles`
- Backend runtime:
  - `src/app/api`
  - `src/lib/server`

The top-level `frontend` and `backend` folders now document those ownership boundaries explicitly because the MCP plans repeatedly require that split.

## What Already Exists

- App Router pages for the public site, dashboard, auth, classes, engineering, tests, events, leaderboard, battle, and community.
- Page-specific CSS modules for the major user-facing routes, including separate Class 9, 10, 11, and 12 route-local styles.
- Comment headers and simple-English comments in the active code path.
- Route handlers for auth, dashboard, battle matchmaking, events, community posts, and health checks.
- A dedicated readiness route now exposes whether deployment-critical backend requirements are still unresolved.
- Session cookies, password hashing, Zod validation, local persistence, and rate limiting.
- Dynamic imports on battle, leaderboard, dashboard, community, and events interactive surfaces.
- Route-local loading skeleton files now keep dynamic loading states separate from page shells on dashboard and events.
- The Events page now reads its catalog and registration state from backend APIs instead of using a disconnected static-only presentation.
- Backend orchestration has been separated into `src/lib/server/services` so HTTP routes stay smaller and production migration stays easier.
- Storage access now flows through `src/lib/server/repositories`, giving the backend a clean adapter boundary for later PostgreSQL work.
- A PostgreSQL repository adapter now exists behind the same repository contracts.
- SQL migrations and `npm run db:migrate` now create the production database tables.
- Redis-backed rate limiting now exists as a production adapter while memory limiting remains the local fallback.
- Structured Pino logging now exists for backend infrastructure events.
- Route-level README notes now document the class, test, events, community, battle, leaderboard, and dashboard folders touched in this implementation phase.

## Current Production Gaps

- Local development still defaults to the JSON adapter unless `EDUQUEST_PERSISTENCE_ADAPTER=postgres` is set.
- Local development still defaults to memory rate limiting unless `EDUQUEST_RATE_LIMIT_ADAPTER=redis` is set.
- Real-time battle state is not yet distributed through WebSockets plus Redis.
- Background jobs, notifications, and certificates are not yet handled by workers.
- Monitoring is readiness/logging-oriented today, not a full Sentry/OpenTelemetry pipeline yet.

## Recommended Next Backend Upgrade Sequence

1. Provision PostgreSQL and Redis in the production environment.
2. Set the production adapter environment variables and run `npm run db:migrate`.
3. Add persistent audit tables for auth, moderation, payments, and admin actions.
4. Add OpenTelemetry tracing and deployment alerts.
5. Introduce queue-backed workers for email, analytics, certificates, and event processing.
6. Split the backend into a separately deployed service only when the operational complexity is justified.

## Comment And Folder Policy

- Every important folder should keep a short README explaining ownership.
- Every touched source file should keep a clear file-purpose header.
- Comments should explain intent, business rules, and security implications rather than repeating syntax.
