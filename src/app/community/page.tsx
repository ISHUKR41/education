/**
 * FILE: page.tsx
 * LOCATION: src/app/community/page.tsx
 * PURPOSE: Server page shell for the community area. The interactive feed and
 *          post form live in CommunityClient.tsx so metadata stays server-side.
 * USED BY: Next.js App Router — renders at "/community"
 * DEPENDENCIES: CommunityClient
 * LAST UPDATED: 2026-05-11
 */

import CommunityClient from "./CommunityClient";

export const metadata = {
  title: "Community",
  description: "Join discussions, ask questions, and help others on the EduQuest community forums.",
};

/** Renders the community client boundary. */
export default function CommunityPage() {
  return <CommunityClient />;
}
