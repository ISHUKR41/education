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

import { useEffect, useState } from "react";
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

/** Shape of the authenticated battle summary API response */
interface BattleSummary {
  totalTickets: number;
  queuedTickets: number;
  matchedTickets: number;
  wins: number;
  losses: number;
  winRate: number | null;
  categories: string[];
}

/** API envelope returned by GET /api/battles */
interface BattleSummaryResponse {
  ok: boolean;
  data?: {
    summary: BattleSummary;
  };
  error?: { message: string };
}

/** Minimal auth profile returned by GET /api/auth/me for the battle player card. */
interface CurrentUserResponse {
  ok: boolean;
  data?: {
    user: {
      name: string;
      level: number;
    };
  };
}

/* ==================== CONSTANTS ==================== */

/** Available battle categories the user can select from */
const CATEGORIES = ["All", "Mathematics", "Science", "English", "DSA", "Python", "C++"];

const EMPTY_SUMMARY: BattleSummary = {
  totalTickets: 0,
  queuedTickets: 0,
  matchedTickets: 0,
  wins: 0,
  losses: 0,
  winRate: null,
  categories: [],
};

/** Builds compact initials without exposing unnecessary profile details. */
function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

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
  const [summary, setSummary] = useState<BattleSummary>(EMPTY_SUMMARY);
  const [player, setPlayer] = useState<{ initials: string; label: string; meta: string }>({
    initials: "U",
    label: "You",
    meta: "Sign in required",
  });

  useEffect(() => {
    let isMounted = true;

    async function loadBattleSummary() {
      try {
        /*
         * API call: GET /api/battles
         * Why: shows stored battle queue data instead of hardcoded statistics.
         * Guests simply see zeroed stats until they sign in and queue matches.
         */
        const response = await fetch("/api/battles", { cache: "no-store" });
        const payload = (await response.json()) as BattleSummaryResponse;

        if (isMounted && response.ok && payload.ok && payload.data?.summary) {
          setSummary(payload.data.summary);
        }

        const meResponse = await fetch("/api/auth/me", { cache: "no-store" });
        const mePayload = (await meResponse.json()) as CurrentUserResponse;

        if (isMounted && meResponse.ok && mePayload.ok && mePayload.data?.user) {
          setPlayer({
            initials: getInitials(mePayload.data.user.name),
            label: mePayload.data.user.name.split(" ")[0],
            meta: `Level ${mePayload.data.user.level}`,
          });
        }
      } catch {
        /*
         * The battle card still works without summary data. Matchmaking itself
         * handles errors separately when the student presses Find Opponent.
         */
      }
    }

    loadBattleSummary();

    return () => {
      isMounted = false;
    };
  }, []);

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
      setSummary((current) => ({
        ...current,
        totalTickets: current.totalTickets + 1,
        queuedTickets: current.queuedTickets + 1,
        categories: current.categories.includes(payload.data!.category)
          ? current.categories
          : [...current.categories, payload.data!.category],
      }));
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
                {player.initials}
              </div>
              <span className={styles.playerName}>{player.label}</span>
              <span className={styles.playerLevel}>{player.meta}</span>
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
          {[
            /* Dark-theme stat colors: semi-transparent bg + matching foreground */
            { value: summary.totalTickets.toString(), label: "Tickets", icon: Trophy, color: "#3FB950", bg: "rgba(63, 185, 80, 0.15)" },
            { value: summary.queuedTickets.toString(), label: "Queued", icon: Target, color: "#F85149", bg: "rgba(248, 81, 73, 0.15)" },
            { value: summary.winRate === null ? "N/A" : `${summary.winRate}%`, label: "Win Rate", icon: TrendingUp, color: "#58A6FF", bg: "rgba(88, 166, 255, 0.15)" },
            { value: summary.categories.length.toString(), label: "Categories", icon: Flame, color: "#D29922", bg: "rgba(210, 153, 34, 0.15)" },
          ].map((stat) => (
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
