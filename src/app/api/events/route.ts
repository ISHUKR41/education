/**
 * FILE: route.ts
 * LOCATION: src/app/api/events/route.ts
 * PURPOSE: Events API that returns the public event catalog and the current
 *          user's registered event ids when a valid session exists.
 * USED BY: src/app/events/EventsClient.tsx
 * DEPENDENCIES: event catalog, current-user, platform-store, response helpers
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { buildEventCatalogSnapshot } from "@/lib/server/services/events-service";
import { apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns events plus per-user registration state when available. */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const snapshot = await buildEventCatalogSnapshot(user?.id);

  return apiSuccess(snapshot, { headers: NO_STORE_HEADERS });
}
