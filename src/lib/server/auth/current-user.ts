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
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { PublicUser } from "@/types/auth";

/** Returns the authenticated user or null when the session is missing/invalid. */
export async function getAuthenticatedUser(request: NextRequest): Promise<PublicUser | null> {
  const session = getSessionFromRequest(request);

  if (!session) {
    return null;
  }

  const repository = getPlatformRepository();
  const user = await repository.users.findById(session.sub);
  return user ? repository.users.toPublic(user) : null;
}
