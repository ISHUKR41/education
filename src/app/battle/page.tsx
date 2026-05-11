/**
 * FILE: page.tsx
 * LOCATION: src/app/battle/page.tsx
 * PURPOSE: Server page shell for the Battle Arena. The interactive matchmaking
 *          UI lives in BattleClient.tsx and is lazily loaded via next/dynamic
 *          to keep the initial bundle small for 100+ concurrent users.
 * USED BY: Next.js App Router — renders at "/battle"
 * DEPENDENCIES: next/dynamic, BattleClient (lazy-loaded)
 * LAST UPDATED: 2026-05-11
 */

import dynamic from "next/dynamic";

/**
 * SEO metadata for the Battle page — stays server-side because page.tsx
 * is a server component. The heavy client JS loads asynchronously.
 */
export const metadata = {
  title: "Battle Arena",
  description: "Challenge opponents in real-time quiz battles. Win XP and climb the ranks on EduQuest.",
};

/**
 * BattleLoading — lightweight inline skeleton shown while BattleClient loads.
 * Uses pure CSS (no client components) to avoid server/client boundary issues.
 */
function BattleLoading() {
  const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
    borderRadius: "0.75rem",
  };

  return (
    <div style={{ padding: "2rem 0 4rem", maxWidth: 720, margin: "0 auto", textAlign: "center" }}>
      {/* Skeleton header */}
      <div style={{ ...shimmer, width: "40%", height: "2rem", margin: "0 auto 0.5rem" }} />
      <div style={{ ...shimmer, width: "60%", height: "1rem", margin: "0 auto 2rem" }} />
      {/* Skeleton matchmaking card */}
      <div style={{ ...shimmer, width: "100%", height: 280, marginBottom: "2rem" }} />
      {/* Skeleton stats grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
        <div style={{ ...shimmer, height: 100 }} />
        <div style={{ ...shimmer, height: 100 }} />
        <div style={{ ...shimmer, height: 100 }} />
        <div style={{ ...shimmer, height: 100 }} />
      </div>
    </div>
  );
}

/**
 * Dynamically import the interactive BattleClient component.
 * This prevents the matchmaking logic, icons, and event handlers from being
 * included in the initial page JavaScript bundle.
 */
const BattleClient = dynamic(() => import("./BattleClient"), {
  loading: () => <BattleLoading />,
});

/** Renders the lazily-loaded Battle client boundary. */
export default function BattlePage() {
  return <BattleClient />;
}
