/**
 * FILE: current-user.ts
 * LOCATION: src/lib/server/auth/current-user.ts
 * PURPOSE: Backend helper for converting a signed session cookie into the
 *          current public user object. API routes should use this instead of
 *          reading cookies manually.
 * USED BY: Protected API route handlers
 * DEPENDENCIES: session helpers and platform-store data adapter
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { getSessionFromRequest } from "@/lib/server/auth/session";
import { findUserById, toPublicUser } from "@/lib/server/data/platform-store";
import type { PublicUser } from "@/types/auth";

/** Returns the authenticated user or null when the session is missing/invalid. */
export async function getAuthenticatedUser(request: NextRequest): Promise<PublicUser | null> {
  const session = getSessionFromRequest(request);

  if (!session) {
    return null;
  }

  const user = await findUserById(session.sub);
  return user ? toPublicUser(user) : null;
}
