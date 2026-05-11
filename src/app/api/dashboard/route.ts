/**
 * FILE: route.ts
 * LOCATION: src/app/api/dashboard/route.ts
 * PURPOSE: Protected dashboard endpoint. It converts the current authenticated
 *          user into the typed dashboard snapshot consumed by the dashboard UI.
 * USED BY: src/app/dashboard/DashboardClient.tsx
 * DEPENDENCIES: current-user helper, dashboard data builder, API response helpers
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { buildDashboardSnapshot } from "@/lib/server/data/dashboard";
import { apiError, apiSuccess } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/** Returns personalized dashboard data for the signed-in user. */
export async function GET(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in to view your dashboard.", 401);
  }

  return apiSuccess(buildDashboardSnapshot(user));
}
