/**
 * FILE: LeaderboardClient.tsx
 * LOCATION: src/app/leaderboard/LeaderboardClient.tsx
 * PURPOSE: Client-side interactive Leaderboard component — extracted from page.tsx
 *          so the page stays a server component exporting metadata.
 *          Includes API-backed top rankings, filter tabs, and current-user highlight.
 *          This component is dynamically imported via next/dynamic for lazy loading.
 * USED BY: src/app/leaderboard/page.tsx (via next/dynamic)
 * DEPENDENCIES: React, lucide-react, Leaderboard.module.css
 * LAST UPDATED: 2026-05-11
 */

"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertCircle, Crown, Loader2 } from "lucide-react";
import styles from "./Leaderboard.module.css";

/* ==================== CONSTANTS ==================== */

/** Filter options for the leaderboard — each maps to a backend scope */
const FILTERS = [
  { label: "Global", scope: "global" },
  { label: "Class 9", scope: "class-9" },
  { label: "Class 10", scope: "class-10" },
  { label: "Class 11", scope: "class-11" },
  { label: "Class 12", scope: "class-12" },
  { label: "Engineering", scope: "engineering" },
] as const;

interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  initials: string;
  level: number;
  xp: number;
  track: string;
  isSelf: boolean;
}

interface LeaderboardApiResponse {
  ok: boolean;
  data?: {
    scope: string;
    entries: LeaderboardEntry[];
    currentUserId: string | null;
  };
  error?: { message: string };
}

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #F59E0B, #F97316)",
  "linear-gradient(135deg, #64748B, #94A3B8)",
  "linear-gradient(135deg, #B45309, #D97706)",
  "linear-gradient(135deg, #2563EB, #06B6D4)",
  "linear-gradient(135deg, #0F766E, #14B8A6)",
  "linear-gradient(135deg, #7C3AED, #2563EB)",
];

/** Picks a stable avatar gradient based on rank for visual variety. */
function getAvatarGradient(rank: number): string {
  return AVATAR_GRADIENTS[(rank - 1) % AVATAR_GRADIENTS.length];
}

/* ==================== COMPONENT ==================== */

/**
 * LeaderboardClient Component
 *
 * The complete leaderboard experience — includes:
 * 1. Filter tabs (Global, Class 9-12, Engineering)
 * 2. Top 3 podium with crown icon for #1
 * 3. Full rankings table with avatar, rank, level, and XP
 * 4. Current user row highlighted
 *
 * This component is lazy-loaded via next/dynamic to reduce initial bundle size.
 */
export default function LeaderboardClient() {
  /* Currently active filter for the leaderboard scope */
  const [activeScope, setActiveScope] = useState("global");
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [status, setStatus] = useState<"loading" | "idle" | "error">("loading");
  const [message, setMessage] = useState("");
  const podiumLeaders = useMemo(() => leaders.filter((leader) => leader.rank <= 3), [leaders]);
  const tableLeaders = useMemo(() => leaders.filter((leader) => leader.rank > 3), [leaders]);

  useEffect(() => {
    let isMounted = true;

    async function loadLeaderboard() {
      setStatus("loading");
      setMessage("");

      try {
        /*
         * API call: GET /api/leaderboard
         * Why: ranking data belongs on the backend so it reflects the active
         * repository adapter and the signed-in user's real highlight state.
         */
        const response = await fetch(`/api/leaderboard?scope=${activeScope}`, { cache: "no-store" });
        const payload = (await response.json()) as LeaderboardApiResponse;

        if (!isMounted) {
          return;
        }

        if (!response.ok || !payload.ok || !payload.data) {
          setStatus("error");
          setMessage(payload.error?.message ?? "Unable to load leaderboard.");
          return;
        }

        setLeaders(payload.data.entries);
        setStatus("idle");
      } catch {
        if (isMounted) {
          setStatus("error");
          setMessage("Network error while loading leaderboard.");
        }
      }
    }

    loadLeaderboard();

    return () => {
      isMounted = false;
    };
  }, [activeScope]);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ==================== HEADER ==================== */}
        <div className={styles.header}>
          <h1 className={styles.title}>Leaderboard</h1>
          <p className={styles.subtitle}>See where you stand among the best learners.</p>
        </div>

        {/* ==================== FILTER TABS ==================== */}
        <div className={styles.filters}>
          {FILTERS.map((filter) => (
            <button
              key={filter.scope}
              className={`${styles.filterBtn} ${
                activeScope === filter.scope ? styles.filterBtnActive : ""
              }`}
              onClick={() => setActiveScope(filter.scope)}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {status === "loading" ? (
          <div className={styles.statePanel} aria-busy="true" aria-live="polite">
            <Loader2 className={styles.spinner} size={18} />
            Loading live rankings...
          </div>
        ) : status === "error" ? (
          <div className={styles.statePanel} role="alert">
            <AlertCircle size={18} />
            {message}
          </div>
        ) : leaders.length === 0 ? (
          <div className={styles.statePanel}>
            No ranked learners yet. Create an account and earn XP to enter this board.
          </div>
        ) : (
          <>
            {/* ==================== TOP 3 PODIUM ==================== */}
            <div className={styles.podium}>
              {podiumLeaders.map((user) => (
                <div
                  key={user.userId}
                  className={`${styles.podiumItem} ${user.rank === 1 ? styles.podiumFirst : ""}`}
                >
                  {user.rank === 1 && <Crown size={28} style={{ color: "#F59E0B" }} />}
                  <div className={styles.podiumAvatar} style={{ background: getAvatarGradient(user.rank) }}>
                    {user.initials}
                  </div>
                  <span className={styles.podiumRank}>{user.rank}</span>
                  <span className={styles.podiumName}>{user.name}{user.isSelf ? " (You)" : ""}</span>
                  <span className={styles.podiumXP}>{user.xp.toLocaleString()} XP</span>
                </div>
              ))}
            </div>

            {/* ==================== RANKINGS TABLE ==================== */}
            <div className={styles.table}>
              {tableLeaders.map((user) => (
                <div
                  key={user.userId}
                  className={`${styles.tableRow} ${user.isSelf ? styles.tableRowSelf : ""}`}
                >
                  <span className={`${styles.rank} ${user.rank <= 10 ? styles.rankTop : ""}`}>
                    #{user.rank}
                  </span>
                  <div className={styles.userAvatar} style={{ background: getAvatarGradient(user.rank) }}>
                    {user.initials}
                  </div>
                  <span className={styles.userName}>{user.name}{user.isSelf ? " (You)" : ""}</span>
                  <span className={styles.userLevel}>Lv.{user.level}</span>
                  <span className={styles.userXP}>{user.xp.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
