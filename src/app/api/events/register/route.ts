/**
 * FILE: route.ts
 * LOCATION: src/app/api/events/register/route.ts
 * PURPOSE: Protected event registration API. It validates event ids against the
 *          shared event catalog and stores one registration per user/event.
 * USED BY: src/app/events/EventsClient.tsx
 * DEPENDENCIES: current-user, event catalog, platform-store, validation schemas
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { canRegisterForEvent } from "@/lib/events/event-catalog";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { registerForEvent } from "@/lib/server/data/platform-store";
import { apiError, apiSuccess, readJsonBody } from "@/lib/server/utils/api-response";
import { eventRegistrationSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

/** Registers the current user for a live/upcoming event. */
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in before registering for an event.", 401);
  }

  const parsed = eventRegistrationSchema.safeParse(await readJsonBody(request));

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please select a valid event.", 422, parsed.error.flatten());
  }

  if (!canRegisterForEvent(parsed.data.eventId)) {
    return apiError("EVENT_NOT_AVAILABLE", "This event is not available for registration.", 400);
  }

  const registration = await registerForEvent(parsed.data.eventId, user.id);
  return apiSuccess({ registration }, { status: 201, message: "Event registration saved." });
}
