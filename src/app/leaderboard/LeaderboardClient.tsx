/**
 * FILE: LeaderboardClient.tsx
 * LOCATION: src/app/leaderboard/LeaderboardClient.tsx
 * PURPOSE: Client-side interactive Leaderboard component — extracted from page.tsx
 *          so the page stays a server component exporting metadata.
 *          Includes top-3 podium, filterable rankings table, and current user highlight.
 *          This component is dynamically imported via next/dynamic for lazy loading.
 * USED BY: src/app/leaderboard/page.tsx (via next/dynamic)
 * DEPENDENCIES: React, lucide-react, Leaderboard.module.css
 * LAST UPDATED: 2026-05-11
 */

"use client";

import { useState } from "react";
import { Crown } from "lucide-react";
import styles from "./Leaderboard.module.css";

/* ==================== CONSTANTS ==================== */

/** Filter options for the leaderboard — each maps to a backend scope */
const FILTERS = ["Global", "Class 9", "Class 10", "Class 11", "Class 12", "Engineering"];

/**
 * Mock leaderboard data — will be fetched from the backend API later.
 * Each entry contains rank, display name, initials for avatar, level, XP total,
 * and a unique gradient for the avatar background.
 */
const LEADERS = [
  { rank: 1, name: "Arjun P.", initials: "AP", level: 28, xp: 28500, gradient: "linear-gradient(135deg, #F59E0B, #F97316)" },
  { rank: 2, name: "Neha S.", initials: "NS", level: 25, xp: 24200, gradient: "linear-gradient(135deg, #6B7280, #9CA3AF)" },
  { rank: 3, name: "Karan M.", initials: "KM", level: 23, xp: 21800, gradient: "linear-gradient(135deg, #CD7F32, #B87333)" },
  { rank: 4, name: "Priya R.", initials: "PR", level: 22, xp: 20100, gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)" },
  { rank: 5, name: "Aditya K.", initials: "AK", level: 21, xp: 18900, gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)" },
  { rank: 6, name: "Riya T.", initials: "RT", level: 20, xp: 17500, gradient: "linear-gradient(135deg, #10B981, #14B8A6)" },
  { rank: 7, name: "Harsh V.", initials: "HV", level: 19, xp: 16200, gradient: "linear-gradient(135deg, #EF4444, #F97316)" },
  { rank: 8, name: "Simran J.", initials: "SJ", level: 18, xp: 14800, gradient: "linear-gradient(135deg, #F59E0B, #D97706)" },
  { rank: 9, name: "Dev P.", initials: "DP", level: 17, xp: 13500, gradient: "linear-gradient(135deg, #3B82F6, #6366F1)" },
  { rank: 10, name: "Ananya B.", initials: "AB", level: 16, xp: 12100, gradient: "linear-gradient(135deg, #EC4899, #F43F5E)" },
  /* Current user entry — highlighted with special styling */
  { rank: 156, name: "Aarav S. (You)", initials: "AS", level: 12, xp: 2850, gradient: "linear-gradient(135deg, #4F46E5, #818CF8)", isSelf: true },
];

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
  const [activeFilter, setActiveFilter] = useState("global");

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
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`${styles.filterBtn} ${
                activeFilter === f.toLowerCase() ? styles.filterBtnActive : ""
              }`}
              onClick={() => setActiveFilter(f.toLowerCase())}
            >
              {f}
            </button>
          ))}
        </div>

        {/* ==================== TOP 3 PODIUM ==================== */}
        <div className={styles.podium}>
          {/* 2nd Place — positioned left */}
          <div className={styles.podiumItem}>
            <div className={styles.podiumAvatar} style={{ background: LEADERS[1].gradient }}>
              {LEADERS[1].initials}
            </div>
            <span className={styles.podiumRank}>2</span>
            <span className={styles.podiumName}>{LEADERS[1].name}</span>
            <span className={styles.podiumXP}>{LEADERS[1].xp.toLocaleString()} XP</span>
          </div>

          {/* 1st Place — positioned center, elevated */}
          <div className={`${styles.podiumItem} ${styles.podiumFirst}`}>
            <Crown size={28} style={{ color: "#F59E0B" }} />
            <div className={styles.podiumAvatar} style={{ background: LEADERS[0].gradient }}>
              {LEADERS[0].initials}
            </div>
            <span className={styles.podiumRank} style={{ color: "#F59E0B" }}>1</span>
            <span className={styles.podiumName}>{LEADERS[0].name}</span>
            <span className={styles.podiumXP}>{LEADERS[0].xp.toLocaleString()} XP</span>
          </div>

          {/* 3rd Place — positioned right */}
          <div className={styles.podiumItem}>
            <div className={styles.podiumAvatar} style={{ background: LEADERS[2].gradient }}>
              {LEADERS[2].initials}
            </div>
            <span className={styles.podiumRank}>3</span>
            <span className={styles.podiumName}>{LEADERS[2].name}</span>
            <span className={styles.podiumXP}>{LEADERS[2].xp.toLocaleString()} XP</span>
          </div>
        </div>

        {/* ==================== RANKINGS TABLE ==================== */}
        <div className={styles.table}>
          {LEADERS.slice(3).map((user) => (
            <div
              key={user.rank}
              className={`${styles.tableRow} ${
                "isSelf" in user && user.isSelf ? styles.tableRowSelf : ""
              }`}
            >
              <span className={`${styles.rank} ${user.rank <= 10 ? styles.rankTop : ""}`}>
                #{user.rank}
              </span>
              <div className={styles.userAvatar} style={{ background: user.gradient }}>
                {user.initials}
              </div>
              <span className={styles.userName}>{user.name}</span>
              <span className={styles.userLevel}>Lv.{user.level}</span>
              <span className={styles.userXP}>{user.xp.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
