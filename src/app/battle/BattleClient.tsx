/**
 * FILE: BattleClient.tsx
 * LOCATION: src/app/battle/BattleClient.tsx
 * PURPOSE: Client-side interactive Battle Arena component — extracted from page.tsx
 *          so the page can remain a server component that exports metadata, while
 *          all the interactive matchmaking logic stays in this client boundary.
 *          This component is dynamically imported with next/dynamic for lazy loading.
 * USED BY: src/app/battle/page.tsx (via next/dynamic)
 * DEPENDENCIES: React, lucide-react, Battle.module.css
 * LAST UPDATED: 2026-05-11
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Loader2, Swords, Trophy, TrendingUp, Target, Flame } from "lucide-react";
import styles from "./Battle.module.css";

/* ==================== TYPES ==================== */

/** Shape of the matchmaking API response from the backend */
interface MatchmakingResponse {
  ok: boolean;
  data?: {
    ticketId: string;
    category: string;
    status: string;
    estimatedWaitSeconds: number;
    opponentPool: string;
  };
  error?: { message: string };
}

/* ==================== CONSTANTS ==================== */

/** Available battle categories the user can select from */
const CATEGORIES = ["All", "Mathematics", "Science", "English", "DSA", "Python", "C++"];

/** Mock battle statistics — will be replaced by real API data later */
const BATTLE_STATS = [
  { value: "18", label: "Wins", icon: Trophy, color: "#10B981", bg: "#ECFDF5" },
  { value: "7", label: "Losses", icon: Target, color: "#EF4444", bg: "#FEF2F2" },
  { value: "72%", label: "Win Rate", icon: TrendingUp, color: "#4F46E5", bg: "#EEF2FF" },
  { value: "5", label: "Win Streak", icon: Flame, color: "#D97706", bg: "#FFFBEB" },
];

/* ==================== COMPONENT ==================== */

/**
 * BattleClient Component
 *
 * The complete interactive Battle Arena experience — includes:
 * 1. Player VS Player matchmaking card
 * 2. Category selection pills
 * 3. Matchmaking API integration
 * 4. Battle stats display
 *
 * This component is lazy-loaded via next/dynamic to reduce initial bundle size.
 */
export default function BattleClient() {
  /* Category the user has selected for matchmaking */
  const [selectedCategory, setSelectedCategory] = useState("all");

  /* Matchmaking state machine: idle → loading → queued | error */
  const [status, setStatus] = useState<"idle" | "loading" | "queued" | "error">("idle");

  /* Status message shown to the user after matchmaking attempt */
  const [message, setMessage] = useState("");

  /* Server-assigned ticket ID after successful queue join */
  const [ticketId, setTicketId] = useState("");

  /**
   * Starts the matchmaking process by calling the protected backend API.
   * The API creates a server-side queue ticket for authenticated users.
   */
  const handleFindOpponent = async () => {
    setStatus("loading");
    setMessage("");
    setTicketId("");

    try {
      /*
       * API call: POST /api/battle/matchmaking
       * Why: creates a server-side queue ticket for a safe, authenticated battle match.
       * Requires: valid session cookie (httpOnly, secure)
       */
      const response = await fetch("/api/battle/matchmaking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory }),
      });
      const payload = (await response.json()) as MatchmakingResponse;

      /* Handle authentication failures */
      if (response.status === 401) {
        setStatus("error");
        setMessage("Please sign in before starting a battle.");
        return;
      }

      /* Handle API errors */
      if (!response.ok || !payload.ok || !payload.data) {
        setStatus("error");
        setMessage(payload.error?.message ?? "Unable to start matchmaking.");
        return;
      }

      /* Matchmaking successful — show ticket info */
      setStatus("queued");
      setTicketId(payload.data.ticketId);
      setMessage(`Queued for ${payload.data.category}. Estimated wait: ${payload.data.estimatedWaitSeconds}s.`);
    } catch {
      setStatus("error");
      setMessage("Network error while joining the battle queue.");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ==================== HEADER ==================== */}
        <div className={styles.header}>
          <h1 className={styles.title}>Battle Arena</h1>
          <p className={styles.subtitle}>
            Challenge opponents in real-time quiz battles. Win XP and climb the ranks!
          </p>
        </div>

        {/* ==================== MATCHMAKING CARD ==================== */}
        <div className={styles.matchCard}>
          <div className={styles.vsRow}>
            {/* Current user player card */}
            <div className={styles.player}>
              <div
                className={styles.playerAvatar}
                style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}
              >
                AS
              </div>
              <span className={styles.playerName}>You</span>
              <span className={styles.playerLevel}>Level 12</span>
            </div>

            {/* VS separator */}
            <span className={styles.vsText}>VS</span>

            {/* Opponent placeholder (unknown until matched) */}
            <div className={styles.player}>
              <div
                className={styles.playerAvatar}
                style={{ background: "linear-gradient(135deg, #6B7280, #9CA3AF)" }}
              >
                ?
              </div>
              <span className={styles.playerName}>Finding...</span>
              <span className={styles.playerLevel}>Matchmaking</span>
            </div>
          </div>

          {/* ==================== CATEGORY PILLS ==================== */}
          <div className={styles.categories}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.categoryBtn} ${
                  selectedCategory === cat.toLowerCase() ? styles.categoryBtnActive : ""
                }`}
                onClick={() => setSelectedCategory(cat.toLowerCase())}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ==================== FIND OPPONENT BUTTON ==================== */}
          <button
            className={styles.startBtn}
            onClick={handleFindOpponent}
            disabled={status === "loading"}
            aria-busy={status === "loading"}
          >
            {status === "loading" ? (
              <Loader2 size={24} className={styles.spinner} />
            ) : (
              <Swords size={24} />
            )}
            {status === "loading" ? "Finding..." : "Find Opponent"}
          </button>

          {/* ==================== MATCHMAKING STATUS ==================== */}
          {message && (
            <div
              className={`${styles.matchStatus} ${
                status === "queued" ? styles.matchStatusSuccess : styles.matchStatusError
              }`}
              role="status"
            >
              {status === "queued" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
              <span>{message}</span>
              {ticketId && <code>{ticketId.slice(0, 8)}</code>}
              {status === "error" && <Link href="/sign-in">Sign In</Link>}
            </div>
          )}
        </div>

        {/* ==================== BATTLE STATS ==================== */}
        <div className={styles.battleStats}>
          {BATTLE_STATS.map((stat) => (
            <div key={stat.label} className={styles.battleStatCard}>
              <div
                className={styles.battleStatIcon}
                style={{ background: stat.bg, color: stat.color }}
              >
                <stat.icon size={20} />
              </div>
              <div className={styles.battleStatValue}>{stat.value}</div>
              <div className={styles.battleStatLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
