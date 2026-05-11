/**
 * FILE: route.ts
 * LOCATION: src/app/api/community/posts/route.ts
 * PURPOSE: Community posts API. GET returns persisted posts; POST lets signed-in
 *          users create a new discussion with validated title/body/tags.
 * USED BY: src/app/community/CommunityClient.tsx
 * DEPENDENCIES: current-user, platform-store, validation schemas, response helpers
 * LAST UPDATED: 2026-05-11
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { createCommunityPost, listCommunityPosts } from "@/lib/server/data/platform-store";
import { apiError, apiSuccess, readJsonBody } from "@/lib/server/utils/api-response";
import { communityPostSchema } from "@/lib/validation/auth";

export const runtime = "nodejs";

/** Returns all community posts in newest-first order. */
export async function GET() {
  const posts = await listCommunityPosts();
  return apiSuccess({ posts });
}

/** Creates a new community post for the signed-in user. */
export async function POST(request: NextRequest) {
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError("UNAUTHENTICATED", "Please sign in before posting in the community.", 401);
  }

  const parsed = communityPostSchema.safeParse(await readJsonBody(request));

  if (!parsed.success) {
    return apiError("VALIDATION_ERROR", "Please check your post fields.", 422, parsed.error.flatten());
  }

  const post = await createCommunityPost({
    author: user,
    title: parsed.data.title,
    body: parsed.data.body,
    tags: parsed.data.tags,
  });

  return apiSuccess({ post }, { status: 201, message: "Community post created." });
}
