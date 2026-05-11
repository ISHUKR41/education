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
import { getSerializableEvents } from "@/lib/events/event-catalog";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { listRegisteredEventIds } from "@/lib/server/data/platform-store";
import { apiSuccess } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns events plus per-user registration state when available. */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);
  const registeredEventIds = user ? await listRegisteredEventIds(user.id) : [];

  return apiSuccess({
    events: getSerializableEvents(),
    registeredEventIds,
  });
}
