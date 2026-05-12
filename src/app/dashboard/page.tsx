/**
 * FILE: page.tsx
 * LOCATION: src/app/dashboard/page.tsx
 * PURPOSE: Server page shell for the user dashboard. The interactive dashboard
 *          body lives in DashboardClient.tsx and is dynamically loaded so only
 *          the parts that need hooks are shipped as client JavaScript.
 * USED BY: Next.js App Router — renders at "/dashboard"
 * DEPENDENCIES: next/dynamic, DashboardClient, DashboardLoadingSkeleton
 * LAST UPDATED: 2026-05-12
 */

import dynamic from "next/dynamic";
import DashboardLoadingSkeleton from "./DashboardLoadingSkeleton";

export const metadata = {
  title: "Dashboard",
  description: "Your EduQuest learning progress, streaks, XP, battles, and quick actions.",
};

/** Lazy client boundary keeps the dashboard route lightweight before hydration. */
const DashboardClient = dynamic(() => import("./DashboardClient"), {
  loading: () => <DashboardLoadingSkeleton />,
});

/** Renders the lazily-loaded dashboard client boundary. */
export default function DashboardPage() {
  return <DashboardClient />;
}
