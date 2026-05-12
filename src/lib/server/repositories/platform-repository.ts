/**
 * FILE: platform-repository.ts
 * LOCATION: src/lib/server/repositories/platform-repository.ts
 * PURPOSE: Storage contracts for backend services. These interfaces describe
 *          what the application needs from persistence without coupling the
 *          service layer to one concrete storage engine.
 * USED BY: Backend services, repository implementations, current-user lookup
 * LAST UPDATED: 2026-05-12
 */

import type {
  CommunityPost,
  EventRegistration,
} from "@/lib/server/data/platform-store";
import type { LearningTrack, PublicUser, StoredUser } from "@/types/auth";

export interface CreateRepositoryUserInput {
  name: string;
  email: string;
  passwordHash: string;
  track: LearningTrack;
}

/** User persistence contract required by auth and session flows. */
export interface UserRepository {
  findByEmail(email: string): Promise<StoredUser | null>;
  findById(id: string): Promise<StoredUser | null>;
  create(input: CreateRepositoryUserInput): Promise<PublicUser>;
  toPublic(user: StoredUser): PublicUser;
}

/** Battle persistence contract required by matchmaking flows. */
export interface BattleRepository {
  createMatchmakingTicket(userId: string, category: string): Promise<string>;
}

/** Community persistence contract required by the discussion feed. */
export interface CommunityRepository {
  listPosts(): Promise<CommunityPost[]>;
  createPost(input: {
    author: PublicUser;
    title: string;
    body: string;
    tags: string[];
  }): Promise<CommunityPost>;
}

/** Event persistence contract required by registration flows. */
export interface EventRepository {
  register(eventId: string, userId: string): Promise<EventRegistration>;
  listRegisteredEventIds(userId: string): Promise<string[]>;
}

/** Complete backend repository surface consumed by services. */
export interface PlatformRepository {
  users: UserRepository;
  battles: BattleRepository;
  community: CommunityRepository;
  events: EventRepository;
}
