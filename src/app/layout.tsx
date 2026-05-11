/**
 * FILE: layout.tsx
 * LOCATION: src/app/layout.tsx
 * PURPOSE: Root layout for the entire EduQuest application. Wraps every page with
 *          the Navbar, Footer, global styles, font imports, and meta tags.
 *          This file controls the HTML structure, SEO defaults, and shared UI shell.
 * USED BY: Next.js automatically wraps every page with this layout
 * DEPENDENCIES: globals.css, Navbar, Footer, self-hosted @fontsource files
 * LAST UPDATED: 2026-05-11
 */

import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import Navbar from "@/components/layout/Navbar/Navbar";
import Footer from "@/components/layout/Footer/Footer";
import "@/styles/globals.css";

/**
 * SEO Metadata — applied to every page by default.
 * Individual pages can override these values with their own metadata exports.
 */
export const metadata: Metadata = {
  title: {
    default: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "education", "learning platform", "CBSE", "Class 9", "Class 10",
    "Class 11", "Class 12", "engineering", "coding", "gamified learning",
    "competitive learning", "streaks", "battles", "India education"
  ],
  authors: [{ name: SITE_CONFIG.name }],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_CONFIG.name} — ${SITE_CONFIG.tagline}`,
    description: SITE_CONFIG.description,
  },
  robots: {
    index: true,
    follow: true,
  },
};

/**
 * RootLayout Component
 *
 * The top-level layout that wraps the entire application.
 * Structure: html > body > Navbar + main content + Footer
 *
 * @param children - The page content rendered by Next.js App Router
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        {/* Global Navigation Bar — appears on every page */}
        <Navbar />

        {/* Main Content Area — each page renders here */}
        <main style={{ flex: 1 }}>
          {children}
        </main>

        {/* Global Footer — appears on every page */}
        <Footer />
      </body>
    </html>
  );
}
