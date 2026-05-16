# API Routes

## What This Folder Is

This folder contains all **Next.js App Router API endpoints** for EduQuest. Each folder is a distinct API resource. Route files follow the Next.js 13+ App Router conventions — the file is always named `route.ts`.

## Endpoint Reference

| Route | Methods | Purpose |
|-------|---------|---------|
| `/api/auth/me` | GET | Returns the current session user (or 401) |
| `/api/auth/sign-in` | POST | Validates credentials, sets httpOnly session cookie |
| `/api/auth/sign-up` | POST | Creates a new account with argon2 password hash |
| `/api/auth/sign-out` | POST | Clears the session cookie |
| `/api/dashboard` | GET | Protected dashboard snapshot (stats + quick actions) |
| `/api/profile` | GET | Protected profile data (stats + activity + subject progress) |
| `/api/leaderboard` | GET | Global and class-filtered leaderboard rankings |
| `/api/community` | GET, POST | Community posts list and new post creation |
| `/api/events` | GET | Event catalog with per-user registration status |
| `/api/events/register` | POST | Register for an event (auth required) |
| `/api/events/host-application` | POST | Submit an institution host application |
| `/api/battle` | GET, POST | Battle queue and matchmaking ticket creation |
| `/api/battles` | GET | Active battle state lookup |
| `/api/health` | GET | Health check (status, DB connectivity, environment) |
| `/api/readiness` | GET | Production readiness gate (strict checks, may return 503) |
| `/api/users` | GET | User search/lookup |
| `/api/classes` | GET | Class metadata |

## Standard Response Shape

Every endpoint returns a consistent JSON envelope:

```json
// Success
{ "ok": true, "data": { ... } }

// Error
{ "ok": false, "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

All authenticated endpoints use `Cache-Control: no-store` to prevent browser caching of personal data.

## Auth Pattern

Protected endpoints use `getAuthenticatedUser(request)` from `src/lib/server/auth/current-user.ts`. This reads the signed `httpOnly` session cookie and returns the public user object or null.

```ts
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in.", 401, undefined, NO_STORE_HEADERS);
  }

  // ... protected logic here
}
```

## Conventions

1. All route files export `runtime = "nodejs"` (not Edge) — the PostgreSQL pool requires Node.js APIs
2. Use `apiSuccess()` and `apiError()` helpers from `src/lib/server/utils/api-response.ts`
3. Log errors server-side (`console.error`) without leaking stack traces to clients
4. Return meaningful HTTP status codes: 200, 201, 400, 401, 403, 404, 405, 500
5. Never import client-side code (React components, browser APIs) in route handlers
6. File header comment block (FILE, LOCATION, PURPOSE, USED BY, DEPENDENCIES) required in every route

## Adding a New Route

1. Create a folder: `src/app/api/your-resource/`
2. Create `route.ts` in that folder
3. Export named functions for each HTTP method: `GET`, `POST`, `PATCH`, `DELETE`
4. Add `export const runtime = "nodejs";`
5. Add the route to this README
