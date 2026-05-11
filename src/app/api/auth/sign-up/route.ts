/**
 * FILE: route.ts
 * LOCATION: src/app/api/auth/sign-up/route.ts
 * PURPOSE: Creates a new student account, hashes the password, stores the user,
 *          and returns a signed httpOnly session cookie so the student lands
 *          directly in the dashboard after registration.
 * USED BY: src/app/sign-up/page.tsx
 * DEPENDENCIES: Next.js Route Handlers, Zod auth schema, password/session helpers
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { attachSessionCookie, createSessionToken } from "@/lib/server/auth/session";
import { hashPassword } from "@/lib/server/auth/password";
import { createUser } from "@/lib/server/data/platform-store";
import { checkRateLimit, getClientKey } from "@/lib/server/security/rate-limit";
import { apiError, apiSuccess, readJsonBody } from "@/lib/server/utils/api-response";
import { signUpSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

/** Handles secure email/password registration for the MVP credentials flow. */
export async function POST(request: NextRequest) {
  const rateLimit = checkRateLimit({
    key: getClientKey(request, "auth:sign-up"),
    limit: 8,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return apiError(
      "RATE_LIMITED",
      `Too many sign-up attempts. Please try again in ${rateLimit.retryAfterSeconds} seconds.`,
      429,
    );
  }

  const parsed = signUpSchema.safeParse(await readJsonBody(request));

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please check the highlighted fields.", 422, parsed.error.flatten());
  }

  const passwordHash = await hashPassword(parsed.data.password);

  try {
    const user = await createUser({
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash,
      track: parsed.data.selectedClass,
    });
    const response = apiSuccess(
      { user },
      { status: 201, message: "Account created successfully." },
    );

    attachSessionCookie(response, createSessionToken(user));
    return response;
  } catch (error) {
    if (error instanceof Error && error.message === "USER_ALREADY_EXISTS") {
      return apiError("USER_ALREADY_EXISTS", "An account with this email already exists.", 409);
    }

    console.error("EduQuest sign-up failed", error);
    return apiError("SIGN_UP_FAILED", "Unable to create account right now.", 500);
  }
}
