/**
 * FILE: dashboard.ts
 * LOCATION: src/lib/server/data/dashboard.ts
 * PURPOSE: Builds the dashboard API response from user profile data. Today this
 *          is deterministic MVP data; later these fields should come from
 *          Postgres progress tables and Redis leaderboard counters.
 * USED BY: /api/dashboard route handler
 * DEPENDENCIES: shared auth types
 * LAST UPDATED: 2026-05-11
 */

import type { PublicUser } from "@/types/auth";

export interface DashboardSnapshot {
  user: PublicUser;
  stats: Array<{
    label: string;
    value: string;
    tone: "streak" | "xp" | "battle" | "rank";
  }>;
  xpToNextLevel: number;
  streakDays: Array<{
    isoDate: string;
    status: "active" | "missed" | "today";
  }>;
  quickActions: Array<{
    title: string;
    description: string;
    href: string;
    tone: "learn" | "battle" | "code" | "community";
  }>;
  recentActivity: Array<{
    text: string;
    time: string;
    tone: "success" | "battle" | "streak" | "learn";
  }>;
}

/** Creates a 28-day streak grid without using random values during rendering. */
function buildStreakDays(streak: number): DashboardSnapshot["streakDays"] {
  const today = new Date();

  return Array.from({ length: 28 }, (_, index) => {
    const daysAgo = 27 - index;
    const date = new Date(today);
    date.setDate(today.getDate() - daysAgo);

    if (daysAgo === 0) {
      return { isoDate: date.toISOString(), status: "today" };
    }

    return {
      isoDate: date.toISOString(),
      status: daysAgo <= streak ? "active" : "missed",
    };
  });
}

/** Builds the student dashboard payload used by the frontend client. */
export function buildDashboardSnapshot(user: PublicUser): DashboardSnapshot {
  const xpToNextLevel = Math.max(1200, (user.level + 1) * 300);
  const battleWins = Math.max(0, Math.floor(user.xp / 180));
  const globalRank = Math.max(1, 500 - user.level * 17);

  return {
    user,
    xpToNextLevel,
    streakDays: buildStreakDays(user.streak),
    stats: [
      { label: "Current Streak", value: `${user.streak}d`, tone: "streak" },
      { label: "Total XP", value: user.xp.toLocaleString(), tone: "xp" },
      { label: "Battles Won", value: battleWins.toString(), tone: "battle" },
      { label: "Global Rank", value: `#${globalRank}`, tone: "rank" },
    ],
    quickActions: [
      { title: "Continue Learning", description: "Resume your selected track", href: `/${user.track}`, tone: "learn" },
      { title: "Start a Battle", description: "Find a fair skill match", href: "/battle", tone: "battle" },
      { title: "Practice Coding", description: "Engineering plans and DSA", href: "/engineering", tone: "code" },
      { title: "Community", description: "Ask and answer doubts", href: "/community", tone: "community" },
    ],
    recentActivity: [
      { text: "Account created and learning track selected", time: "Today", tone: "success" },
      { text: "Dashboard profile initialized", time: "Today", tone: "learn" },
      { text: "Battle readiness score prepared", time: "Today", tone: "battle" },
      { text: "Daily streak tracker is ready", time: "Today", tone: "streak" },
    ],
  };
}
