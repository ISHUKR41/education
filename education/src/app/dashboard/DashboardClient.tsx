/**
 * FILE: DashboardClient.tsx
 * LOCATION: src/app/dashboard/DashboardClient.tsx
 * PURPOSE: Interactive dashboard UI that fetches protected dashboard data from
 *          the backend API, shows loading/error states, and redirects guests to
 *          sign in. Keeping this separate from page.tsx preserves page metadata.
 * USED BY: src/app/dashboard/page.tsx
 * DEPENDENCIES: next/navigation, lucide-react, Dashboard.module.css
 * LAST UPDATED: 2026-05-11
 */

"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Clock,
  Code2,
  Flame,
  Star,
  Swords,
  TrendingUp,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import type { DashboardSnapshot } from "@/lib/server/data/dashboard";
import styles from "./Dashboard.module.css";

const STAT_ICONS = {
  streak: Flame,
  xp: Zap,
  battle: Swords,
  rank: Trophy,
} as const;

const STAT_COLORS = {
  streak: { color: "#D97706", bg: "#FFFBEB" },
  xp: { color: "#4F46E5", bg: "#EEF2FF" },
  battle: { color: "#DC2626", bg: "#FEF2F2" },
  rank: { color: "#059669", bg: "#ECFDF5" },
} as const;

const ACTION_ICONS = {
  learn: BookOpen,
  battle: Swords,
  code: Code2,
  community: Users,
} as const;

const ACTIVITY_COLORS = {
  success: "#10B981",
  battle: "#EF4444",
  streak: "#F59E0B",
  learn: "#4F46E5",
} as const;

interface DashboardApiResponse {
  ok: boolean;
  data?: DashboardSnapshot;
  error?: { message: string };
}

/** Skeleton UI shown while the protected dashboard API responds. */
function DashboardSkeleton() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.skeletonHeader} />
        <div className={styles.statsGrid}>
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className={`${styles.statCard} ${styles.skeletonCard}`} />
          ))}
        </div>
        <div className={styles.mainGrid}>
          <div className={styles.card}><div className={styles.skeletonBlock} /></div>
          <div className={styles.card}><div className={styles.skeletonBlock} /></div>
        </div>
      </div>
    </div>
  );
}

/** Fetches personalized dashboard data and renders the student workspace. */
export default function DashboardClient() {
  const router = useRouter();
  const [snapshot, setSnapshot] = useState<DashboardSnapshot | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadDashboard() {
      setIsLoading(true);
      setError("");

      try {
        /*
         * API call: GET /api/dashboard
         * Why: loads the signed-in student's private progress using the secure session cookie.
         */
        const response = await fetch("/api/dashboard", { cache: "no-store" });
        const payload = (await response.json()) as DashboardApiResponse;

        if (!isMounted) {
          return;
        }

        if (response.status === 401) {
          router.push("/sign-in");
          return;
        }

        if (!response.ok || !payload.ok || !payload.data) {
          setError(payload.error?.message ?? "Unable to load dashboard.");
          return;
        }

        setSnapshot(payload.data);
      } catch {
        if (isMounted) {
          setError("Network error while loading your dashboard.");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      isMounted = false;
    };
  }, [router]);

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error || !snapshot) {
    return (
      <div className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.errorState} role="alert">
            <AlertCircle size={22} />
            <div>
              <h1>Dashboard could not load</h1>
              <p>{error || "Please sign in again to continue."}</p>
            </div>
            <Link href="/sign-in" className={styles.errorAction}>Sign In</Link>
          </div>
        </div>
      </div>
    );
  }

  const xpProgress = Math.min(100, (snapshot.user.xp / snapshot.xpToNextLevel) * 100);

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.welcomeRow}>
          <div>
            <h1 className={styles.welcomeTitle}>Welcome back, {snapshot.user.name.split(" ")[0]}!</h1>
            <p className={styles.welcomeSub}>
              Your {snapshot.user.track.replace("-", " ")} workspace is ready for today.
            </p>
          </div>
          <span className={styles.levelBadge}>
            <Star size={14} /> Level {snapshot.user.level} — {snapshot.user.role}
          </span>
        </div>

        <div className={styles.statsGrid}>
          {snapshot.stats.map((stat) => {
            const Icon = STAT_ICONS[stat.tone];
            const tone = STAT_COLORS[stat.tone];
            return (
              <div key={stat.label} className={styles.statCard}>
                <div className={styles.statCardIcon} style={{ background: tone.bg, color: tone.color }}>
                  <Icon size={20} />
                </div>
                <span className={styles.statCardValue}>{stat.value}</span>
                <span className={styles.statCardLabel}>{stat.label}</span>
              </div>
            );
          })}
        </div>

        <div className={styles.mainGrid}>
          <div className={styles.columnStack}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <TrendingUp size={18} />
                Level Progress
              </h2>
              <div className={styles.xpBar}>
                <div className={styles.xpBarFill} style={{ width: `${xpProgress}%` }} />
              </div>
              <div className={styles.xpInfo}>
                <span>{snapshot.user.xp} XP</span>
                <span>{snapshot.xpToNextLevel} XP to Level {snapshot.user.level + 1}</span>
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>Quick Actions</h2>
              <div className={styles.quickActions}>
                {snapshot.quickActions.map((action) => {
                  const Icon = ACTION_ICONS[action.tone];
                  return (
                    <Link key={action.title} href={action.href} className={styles.actionCard}>
                      <div className={`${styles.actionIcon} ${styles[`actionIcon${action.tone}`]}`}>
                        <Icon size={18} />
                      </div>
                      <div>
                        <div className={styles.actionTitle}>{action.title}</div>
                        <div className={styles.actionDesc}>{action.description}</div>
                      </div>
                      <ArrowRight size={15} className={styles.actionArrow} />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className={styles.columnStack}>
            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Flame size={18} className={styles.streakIcon} />
                Streak — {snapshot.user.streak} Days
              </h2>
              <div className={styles.streakGrid}>
                {snapshot.streakDays.map((day) => (
                  <div
                    key={day.isoDate}
                    className={`${styles.streakDay} ${day.status === "active" ? styles.streakDayActive : ""} ${day.status === "today" ? styles.streakDayToday : ""} ${day.status === "missed" ? styles.streakDayMissed : ""}`}
                    title={day.status}
                  />
                ))}
              </div>
            </div>

            <div className={styles.card}>
              <h2 className={styles.cardTitle}>
                <Clock size={18} />
                Recent Activity
              </h2>
              <ul className={styles.activityList}>
                {snapshot.recentActivity.map((item) => (
                  <li key={`${item.text}-${item.time}`} className={styles.activityItem}>
                    <span className={styles.activityDot} style={{ background: ACTIVITY_COLORS[item.tone] }} />
                    <span className={styles.activityText}>{item.text}</span>
                    <span className={styles.activityTime}>{item.time}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
