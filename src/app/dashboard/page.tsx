/**
 * FILE: page.tsx
 * LOCATION: src/app/dashboard/page.tsx
 * PURPOSE: Server page shell for the user dashboard. The interactive dashboard
 *          body lives in DashboardClient.tsx so only the parts that need hooks
 *          are shipped as client JavaScript.
 * USED BY: Next.js App Router — renders at "/dashboard"
 * DEPENDENCIES: DashboardClient
 * LAST UPDATED: 2026-05-11
 */

import DashboardClient from "./DashboardClient";

export const metadata = {
  title: "Dashboard",
  description: "Your EduQuest learning progress, streaks, XP, battles, and quick actions.",
};

/** Renders the dashboard client boundary. */
export default function DashboardPage() {
  return <DashboardClient />;
}
