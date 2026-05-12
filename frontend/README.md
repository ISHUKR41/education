# Frontend Boundary

This folder documents the frontend ownership boundary required by the MCP plans.

## Current Working Code

The production-running frontend currently lives inside the Next.js App Router structure:

- `src/app` for page routes and route-level CSS modules.
- `src/components` for reusable visual building blocks.
- `src/styles` for global tokens and shared page styling helpers.

This keeps the current application deployable while still making the frontend boundary explicit.

## What Belongs To Frontend

- User-facing pages.
- Route-level CSS modules, including dedicated page-local styles wherever a route owns its own experience.
- Route-local README notes for the major user-facing folders as the project grows.
- Reusable layout and UI components.
- Client-side interactions, browser state, and lightweight presentation logic.
- Optimized static assets from `public/images`, `public/icons`, and future media folders.
- Page-owned loading skeletons for lazy and dynamic client bundles.

## What Does Not Belong Here

- Authentication secrets.
- Server-only storage adapters.
- Database, Redis, or queue logic.
- Matchmaking or event business rules.

## Production Direction

If the repository becomes a true monorepo with separately deployed services, the existing Next.js app can be migrated under this folder without changing the logical ownership described above.
