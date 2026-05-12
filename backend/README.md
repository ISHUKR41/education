# Backend Boundary

This folder documents the backend ownership boundary required by the MCP plans.

## Current Working Code

The backend currently runs inside the same Next.js application so the product remains fully working today:

- `src/app/api` contains HTTP route handlers.
- `src/lib/server` contains authentication, storage, response helpers, security utilities, and server-only data logic.
- `src/lib/server/database` contains PostgreSQL connection and migration infrastructure.
- `src/lib/server/cache` contains Redis connection infrastructure.
- `src/lib/server/repositories` contains the JSON and PostgreSQL storage adapters.
- `src/lib/server/services` contains feature business logic.

This is a pragmatic full-stack Next.js implementation, not yet a separate NestJS or Fastify deployment.

## What Belongs To Backend

- Authentication and session handling.
- Route handlers and server-side validation.
- Data adapters and future repositories.
- Rate limiting, audit hooks, monitoring readiness, and safe server configuration.
- Future PostgreSQL, Redis, queues, WebSocket infrastructure, and background workers.

## What Does Not Belong Here

- Page layouts.
- Route CSS modules.
- Browser-only interactive UI components.

## Production Direction

The current backend is intentionally shaped so PostgreSQL and Redis can be enabled with environment variables while preserving the same API route contracts. A later separately deployed API service can reuse the service and repository boundaries already present here.
