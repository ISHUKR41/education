/**
 * FILE: page.tsx
 * LOCATION: src/app/community/page.tsx
 * PURPOSE: Server page shell for the community area. The interactive feed and
 *          post form live in CommunityClient.tsx and are dynamically loaded so
 *          metadata stays server-side without front-loading unnecessary JS.
 * USED BY: Next.js App Router — renders at "/community"
 * DEPENDENCIES: next/dynamic, CommunityClient
 * LAST UPDATED: 2026-05-12
 */

import dynamic from "next/dynamic";

export const metadata = {
  title: "Community",
  description: "Join discussions, ask questions, and help others on the EduQuest community forums.",
};

/** Route skeleton shown while the interactive community bundle loads. */
function CommunityLoading() {
  const shimmer: React.CSSProperties = {
    background: "linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s ease-in-out infinite",
    borderRadius: "0.75rem",
  };

  return (
    <div style={{ padding: "2rem 0 4rem", maxWidth: 1120, margin: "0 auto" }}>
      <div style={{ ...shimmer, width: "36%", height: "2rem", marginBottom: "1rem" }} />
      <div style={{ ...shimmer, width: "58%", height: "1rem", marginBottom: "1.5rem" }} />
      <div style={{ display: "grid", gridTemplateColumns: "1.35fr 0.65fr", gap: "1.5rem" }}>
        <div style={{ display: "grid", gap: "1rem" }}>
          <div style={{ ...shimmer, height: 180 }} />
          <div style={{ ...shimmer, height: 180 }} />
        </div>
        <div style={{ ...shimmer, height: 380 }} />
      </div>
    </div>
  );
}

/** Lazy client boundary keeps the community route responsive on first load. */
const CommunityClient = dynamic(() => import("./CommunityClient"), {
  loading: () => <CommunityLoading />,
});

/** Renders the lazily-loaded community client boundary. */
export default function CommunityPage() {
  return <CommunityClient />;
}
