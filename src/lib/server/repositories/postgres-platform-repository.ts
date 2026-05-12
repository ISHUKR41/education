/**
 * FILE: postgres-platform-repository.ts
 * LOCATION: src/lib/server/repositories/postgres-platform-repository.ts
 * PURPOSE: PostgreSQL implementation of the EduQuest backend repository
 *          contracts. It stores durable production data while preserving the
 *          same service-facing API used by the local JSON adapter.
 * USED BY: get-platform-repository.ts when EDUQUEST_PERSISTENCE_ADAPTER=postgres
 * DEPENDENCIES: postgres.ts, platform-repository.ts, shared auth/store types
 * LAST UPDATED: 2026-05-12
 */

import { queryPostgres } from "@/lib/server/database/postgres";
import type {
  CommunityPost,
  EventRegistration,
} from "@/lib/server/data/platform-store";
import type { PlatformRepository } from "@/lib/server/repositories/platform-repository";
import type { LearningTrack, PublicUser, StoredUser, UserRole } from "@/types/auth";

interface UserRow {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  track: LearningTrack;
  role: UserRole;
  level: number;
  xp: number;
  streak: number;
  created_at: Date | string;
}

interface CommunityPostRow {
  id: string;
  author_id: string | null;
  author_name: string;
  title: string;
  body: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  created_at: Date | string;
}

interface EventRegistrationRow {
  id: string;
  event_id: string;
  user_id: string;
  created_at: Date | string;
}

interface IdRow {
  id: string;
}

interface EventIdRow {
  event_id: string;
}

/** Converts database timestamp values to the ISO strings expected by the UI. */
function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

/** Converts one database user row into the server-side StoredUser contract. */
function mapUserRow(row: UserRow): StoredUser {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    passwordHash: row.password_hash,
    track: row.track,
    role: row.role,
    level: row.level,
    xp: row.xp,
    streak: row.streak,
    createdAt: toIsoString(row.created_at),
  };
}

/** Converts one database post row into the community feed contract. */
function mapCommunityPostRow(row: CommunityPostRow): CommunityPost {
  return {
    id: row.id,
    authorId: row.author_id ?? "deleted-user",
    authorName: row.author_name,
    title: row.title,
    body: row.body,
    tags: row.tags,
    likes: row.likes,
    comments: row.comments,
    views: row.views,
    createdAt: toIsoString(row.created_at),
  };
}

/** Converts one database event registration row into the API contract. */
function mapEventRegistrationRow(row: EventRegistrationRow): EventRegistration {
  return {
    id: row.id,
    eventId: row.event_id,
    userId: row.user_id,
    createdAt: toIsoString(row.created_at),
  };
}

/** Removes password hashes before user data is sent to browser clients. */
function toPublicUser(user: StoredUser): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    track: user.track,
    role: user.role,
    level: user.level,
    xp: user.xp,
    streak: user.streak,
    createdAt: user.createdAt,
  };
}

/** Production repository implementation backed by PostgreSQL tables. */
export const postgresPlatformRepository: PlatformRepository = {
  users: {
    async findByEmail(email) {
      const result = await queryPostgres<UserRow>(
        `SELECT id, name, email, password_hash, track, role, level, xp, streak, created_at
         FROM eduquest_users
         WHERE email = $1
         LIMIT 1`,
        [email.toLowerCase()],
      );

      return result.rows[0] ? mapUserRow(result.rows[0]) : null;
    },

    async findById(id) {
      const result = await queryPostgres<UserRow>(
        `SELECT id, name, email, password_hash, track, role, level, xp, streak, created_at
         FROM eduquest_users
         WHERE id = $1
         LIMIT 1`,
        [id],
      );

      return result.rows[0] ? mapUserRow(result.rows[0]) : null;
    },

    async create(input) {
      try {
        const result = await queryPostgres<UserRow>(
          `INSERT INTO eduquest_users (name, email, password_hash, track)
           VALUES ($1, $2, $3, $4)
           RETURNING id, name, email, password_hash, track, role, level, xp, streak, created_at`,
          [input.name, input.email.toLowerCase(), input.passwordHash, input.track],
        );

        return toPublicUser(mapUserRow(result.rows[0]));
      } catch (error) {
        /*
         * PostgreSQL unique_violation means the normalized email already exists.
         * The service layer already knows how to translate USER_ALREADY_EXISTS
         * into a safe public API message.
         */
        if (error instanceof Error && "code" in error && error.code === "23505") {
          throw new Error("USER_ALREADY_EXISTS");
        }

        throw error;
      }
    },

    toPublic: toPublicUser,
  },

  battles: {
    async createMatchmakingTicket(userId, category) {
      const result = await queryPostgres<IdRow>(
        `INSERT INTO eduquest_matchmaking_tickets (user_id, category)
         VALUES ($1, $2)
         RETURNING id`,
        [userId, category],
      );

      return result.rows[0].id;
    },
  },

  community: {
    async listPosts() {
      const result = await queryPostgres<CommunityPostRow>(
        `SELECT id, author_id, author_name, title, body, tags, likes, comments, views, created_at
         FROM eduquest_community_posts
         ORDER BY created_at DESC
         LIMIT 100`,
      );

      return result.rows.map(mapCommunityPostRow);
    },

    async createPost(input) {
      const result = await queryPostgres<CommunityPostRow>(
        `INSERT INTO eduquest_community_posts (author_id, author_name, title, body, tags)
         VALUES ($1, $2, $3, $4, $5)
         RETURNING id, author_id, author_name, title, body, tags, likes, comments, views, created_at`,
        [input.author.id, input.author.name, input.title, input.body, input.tags],
      );

      return mapCommunityPostRow(result.rows[0]);
    },
  },

  events: {
    async register(eventId, userId) {
      const result = await queryPostgres<EventRegistrationRow>(
        `INSERT INTO eduquest_event_registrations (event_id, user_id)
         VALUES ($1, $2)
         ON CONFLICT (event_id, user_id)
         DO UPDATE SET event_id = EXCLUDED.event_id
         RETURNING id, event_id, user_id, created_at`,
        [eventId, userId],
      );

      return mapEventRegistrationRow(result.rows[0]);
    },

    async listRegisteredEventIds(userId) {
      const result = await queryPostgres<EventIdRow>(
        `SELECT event_id
         FROM eduquest_event_registrations
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [userId],
      );

      return result.rows.map((row) => row.event_id);
    },
  },
};
