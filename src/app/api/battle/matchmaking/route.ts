/**
 * FILE: route.ts
 * LOCATION: src/app/api/battle/matchmaking/route.ts
 * PURPOSE: Starts a battle matchmaking ticket for the authenticated student.
 *          The current implementation is REST-first and ready to hand off the
 *          ticket id to Socket.IO/WebSocket battle rooms in the next phase.
 * USED BY: src/app/battle/page.tsx
 * DEPENDENCIES: auth helper, validation schema, in-memory data adapter, rate limiter
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { createMatchmakingTicket } from "@/lib/server/data/platform-store";
import { checkRateLimit, getClientKey } from "@/lib/server/security/rate-limit";
import { apiError, apiSuccess, readJsonBody } from "@/lib/server/utils/api-response";
import { battleMatchmakingSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

/** Creates a fair-match ticket for a selected battle category. */
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in before starting a battle.", 401);
  }

  const rateLimit = checkRateLimit({
    key: getClientKey(request, `battle:${user.id}`),
    limit: 12,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      "RATE_LIMITED",
      `Too many matchmaking requests. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
      429,
    );
  }

  const parsed = battleMatchmakingSchema.safeParse(await readJsonBody(request));

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please select a valid battle category.", 422, parsed.error.flatten());
  }

  const ticketId = await createMatchmakingTicket(user.id, parsed.data.category);

  return apiSuccess({
    ticketId,
    category: parsed.data.category,
    status: "queued",
    estimatedWaitSeconds: 18,
    opponentPool: "same-track-similar-level",
  });
}
