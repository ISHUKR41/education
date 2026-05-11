/**
 * FILE: page.tsx
 * LOCATION: src/app/leaderboard/page.tsx
 * PURPOSE: Server page shell for the Leaderboard. The interactive rankings UI
 *          lives in LeaderboardClient.tsx and is lazily loaded via next/dynamic
 *          to keep the initial bundle small for 100+ concurrent users.
 * USED BY: Next.js App Router — renders at "/leaderboard"
 * DEPENDENCIES: next/dynamic, LeaderboardClient (lazy-loaded)
 * LAST UPDATED: 2026-05-11
 */

import dynamic from "next/dynamic";

/**
 * SEO metadata for the Leaderboard page — stays server-side because page.tsx
 * is a server component. The heavy client JS loads asynchronously.
 */
export const metadata = {
  title: "Leaderboard",
  description: "See where you stand among the best learners on EduQuest. Global and class-specific rankings.",
};

/**
 * LeaderboardLoading — lightweight inline skeleton shown while LeaderboardClient loads.
 * Uses pure CSS (no client components) to avoid server/client boundary issues.
 */
function LeaderboardLoading() {
  const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
    borderRadius: "0.75rem",
  };

  return (
    <div style={{ padding: "2rem 0 4rem", maxWidth: 720, margin: "0 auto" }}>
      {/* Skeleton header */}
      <div style={{ ...shimmer, width: "30%", height: "2rem", marginBottom: "0.5rem" }} />
      <div style={{ ...shimmer, width: "50%", height: "1rem", marginBottom: "2rem" }} />
      {/* Skeleton filter tabs */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "2rem" }}>
        <div style={{ ...shimmer, width: 80, height: 36 }} />
        <div style={{ ...shimmer, width: 80, height: 36 }} />
        <div style={{ ...shimmer, width: 80, height: 36 }} />
        <div style={{ ...shimmer, width: 80, height: 36 }} />
      </div>
      {/* Skeleton podium */}
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", marginBottom: "2rem" }}>
        <div style={{ ...shimmer, width: 160, height: 180 }} />
        <div style={{ ...shimmer, width: 180, height: 220 }} />
        <div style={{ ...shimmer, width: 160, height: 180 }} />
      </div>
      {/* Skeleton table rows */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <div style={{ ...shimmer, height: 56 }} />
        <div style={{ ...shimmer, height: 56 }} />
        <div style={{ ...shimmer, height: 56 }} />
        <div style={{ ...shimmer, height: 56 }} />
      </div>
    </div>
  );
}

/**
 * Dynamically import the interactive LeaderboardClient component.
 * This prevents the rankings table, filter logic, and crown icons from being
 * included in the initial page JavaScript bundle.
 */
const LeaderboardClient = dynamic(() => import("./LeaderboardClient"), {
  loading: () => <LeaderboardLoading />,
});

/** Renders the lazily-loaded Leaderboard client boundary. */
export default function LeaderboardPage() {
  return <LeaderboardClient />;
}
