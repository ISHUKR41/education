/**
 * FILE: route.ts
 * LOCATION: src/app/api/health/route.ts
 * PURPOSE: Lightweight health-check endpoint for deployment platforms,
 *          uptime monitors, and smoke tests.
 * USED BY: Production monitoring and local verification
 * DEPENDENCIES: API response helper
 * LAST UPDATED: 2026-05-11
 */

import { apiSuccess } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns process health and timestamp without exposing sensitive details. */
export async function GET() {
  return apiSuccess({
    status: "ok",
    service: "eduquest-web",
    checkedAt: new Date().toISOString(),
  });
}
