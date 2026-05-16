/**
 * FILE: route.ts
 * LOCATION: src/app/api/profile/route.ts
 * PURPOSE: Profile-specific API endpoint that returns a richer data format
 *          than the dashboard endpoint. Provides:
 *            - User stats (XP, level, streak, battles, questions, chapters)
 *            - Recent activity feed with typed events
 *            - Subject-wise progress bars
 *          The profile page uses this to populate XP bars, stat cards,
 *          progress rings, and the activity timeline.
 *          Falls back gracefully when no real user_stats row exists yet
 *          (new users see zeroed-out stats rather than an error).
 * USED BY: src/app/profile/page.tsx via TanStack Query
 * DEPENDENCIES: getAuthenticatedUser, postgres pool, api-response utils
 * LAST UPDATED: 2026-05-16
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────
 * Response Types
 * ───────────────────────────────────────────── */

interface ProfileStats {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  battlesWon: number;
  totalBattles: number;
  questionsSolved: number;
  chaptersCompleted: number;
}

interface ActivityItem {
  id: string;
  type: "question" | "battle" | "chapter" | "level_up" | "streak";
  title: string;
  xpEarned: number;
  timestamp: string;
}

interface SubjectProgress {
  subject: string;
  color: string;
  completedChapters: number;
  totalChapters: number;
  percentComplete: number;
}

interface ProfileResponse {
  stats: ProfileStats;
  recentActivity: ActivityItem[];
  subjectProgress: SubjectProgress[];
}

/* ─────────────────────────────────────────────
 * Subject Color Mapping
 * Used to colour the progress bars for each subject on the profile page
 * ───────────────────────────────────────────── */

const SUBJECT_COLORS: Record<string, string> = {
  mathematics: "#2563EB",
  "mathematics-standard": "#2563EB",
  "mathematics-basic": "#4F46E5",
  science: "#059669",
  "social-science": "#7C3AED",
  english: "#D97706",
  hindi: "#DC2626",
  "computer-applications": "#0891B2",
  physics: "#2563EB",
  chemistry: "#059669",
  biology: "#D97706",
  "computer-science": "#0891B2",
  accountancy: "#059669",
  "business-studies": "#2563EB",
  economics: "#D97706",
  history: "#D97706",
  geography: "#059669",
  "political-science": "#7C3AED",
};

/* ─────────────────────────────────────────────
 * GET Handler
 * ───────────────────────────────────────────── */

/**
 * GET /api/profile
 *
 * Returns the authenticated user's profile data including stats,
 * recent activity, and subject-wise progress.
 * Returns 401 if no valid session is found.
 */
export async function GET(request: NextRequest) {
  /* Verify the session cookie */
  const user = await getAuthenticatedUser(request);

  if (!user) {
    return apiError(
      "UNAUTHENTICATED",
      "Please sign in to view your profile.",
      401,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  const pool = getPostgresPool();

  try {
    /* ── 1. Fetch stats from eduquest_user_stats (if exists) ── */
    const statsResult = await pool.query<{
      questions_solved: string;
      chapters_completed: string;
      battles_won: string;
      total_battles: string;
      longest_streak: string;
    }>(
      `SELECT questions_solved, chapters_completed, battles_won, total_battles, longest_streak
       FROM eduquest_user_stats
       WHERE user_id = $1`,
      [user.id],
    );

    /* Use DB stats if they exist, otherwise fall back to user table values + zeros */
    const dbStats = statsResult.rows[0];
    const stats: ProfileStats = {
      xp:               user.xp,
      level:            user.level,
      streak:           user.streak,
      longestStreak:    dbStats ? parseInt(dbStats.longest_streak, 10) : user.streak,
      battlesWon:       dbStats ? parseInt(dbStats.battles_won, 10)    : 0,
      totalBattles:     dbStats ? parseInt(dbStats.total_battles, 10)   : 0,
      questionsSolved:  dbStats ? parseInt(dbStats.questions_solved, 10): 0,
      chaptersCompleted: dbStats ? parseInt(dbStats.chapters_completed, 10) : 0,
    };

    /* ── 2. Fetch recent activity from user_progress ── */
    const activityResult = await pool.query<{
      id: string;
      subject_slug: string;
      chapter_slug: string;
      status: string;
      score: number | null;
      xp_earned: number;
      completed_at: string | null;
      updated_at: string;
    }>(
      `SELECT up.id, up.subject_slug, up.chapter_slug, up.status,
              up.score, up.xp_earned, up.completed_at, up.updated_at
       FROM eduquest_user_progress up
       WHERE up.user_id = $1
       ORDER BY up.updated_at DESC
       LIMIT 10`,
      [user.id],
    );

    /*
     * Map progress rows to typed activity items.
     * "chapter_completed" → activity type "chapter"
     * "quiz_passed" → activity type "question"
     */
    const recentActivity: ActivityItem[] = activityResult.rows.map((row) => {
      const subjectLabel = row.subject_slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
      const chapterLabel = row.chapter_slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      const type: ActivityItem["type"] =
        row.status === "completed" ? "chapter" : "question";

      return {
        id: row.id,
        type,
        title: `${subjectLabel} — ${chapterLabel}`,
        xpEarned: row.xp_earned,
        timestamp: row.completed_at ?? row.updated_at,
      };
    });

    /* ── 3. Fetch subject-wise progress ── */
    const subjectResult = await pool.query<{
      subject_slug: string;
      completed_chapters: string;
      total_chapters: string;
    }>(
      `SELECT
         up.subject_slug,
         COUNT(CASE WHEN up.status = 'completed' THEN 1 END) AS completed_chapters,
         COUNT(*) AS total_chapters
       FROM eduquest_user_progress up
       WHERE up.user_id = $1
       GROUP BY up.subject_slug
       ORDER BY total_chapters DESC`,
      [user.id],
    );

    const subjectProgress: SubjectProgress[] = subjectResult.rows.map((row) => {
      const completed = parseInt(row.completed_chapters, 10);
      const total     = parseInt(row.total_chapters, 10);
      const label     = row.subject_slug
        .replace(/-/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());

      return {
        subject: label,
        color: SUBJECT_COLORS[row.subject_slug] ?? "var(--color-primary)",
        completedChapters: completed,
        totalChapters: total,
        percentComplete: total > 0 ? Math.round((completed / total) * 100) : 0,
      };
    });

    const response: ProfileResponse = { stats, recentActivity, subjectProgress };

    return apiSuccess(response, { headers: NO_STORE_HEADERS });

  } catch (error) {
    /* Log the error server-side but return a clean fallback to the client */
    console.error("[profile API] Database query error:", error);

    /*
     * Even if the DB query fails, return a valid profile with zeroed-out stats
     * rather than an error. This prevents the profile page from showing a crash
     * state for new users who haven't accumulated any data yet.
     */
    const fallback: ProfileResponse = {
      stats: {
        xp: user.xp,
        level: user.level,
        streak: user.streak,
        longestStreak: user.streak,
        battlesWon: 0,
        totalBattles: 0,
        questionsSolved: 0,
        chaptersCompleted: 0,
      },
      recentActivity: [],
      subjectProgress: [],
    };

    return apiSuccess(fallback, { headers: NO_STORE_HEADERS });
  }
}
