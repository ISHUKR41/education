/**
 * FILE: json-platform-repository.ts
 * LOCATION: src/lib/server/repositories/json-platform-repository.ts
 * PURPOSE: Concrete repository adapter that maps the current durable JSON store
 *          onto the repository contracts used by backend services.
 * USED BY: get-platform-repository.ts
 * DEPENDENCIES: platform-store helpers
 * LAST UPDATED: 2026-05-12
 */

import {
  createCommunityPost,
  createMatchmakingTicket,
  createUser,
  findUserByEmail,
  findUserById,
  listCommunityPosts,
  listRegisteredEventIds,
  registerForEvent,
  toPublicUser,
} from "@/lib/server/data/platform-store";
import type { PlatformRepository } from "@/lib/server/repositories/platform-repository";

/** Current working repository implementation backed by the serialized JSON MVP store. */
export const jsonPlatformRepository: PlatformRepository = {
  users: {
    findByEmail: findUserByEmail,
    findById: findUserById,
    create: createUser,
    toPublic: toPublicUser,
  },
  battles: {
    createMatchmakingTicket,
  },
  community: {
    listPosts: listCommunityPosts,
    createPost: createCommunityPost,
  },
  events: {
    register: registerForEvent,
    listRegisteredEventIds,
  },
};
