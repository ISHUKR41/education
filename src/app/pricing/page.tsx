/**
 * FILE: page.tsx
 * LOCATION: src/app/pricing/page.tsx
 * PURPOSE: Pricing page with a safe MVP plan structure. It avoids unsafe cash
 *          battle messaging and keeps school learning access clear.
 * USED BY: Footer platform links
 * DEPENDENCIES: lucide-react, Pricing.module.css
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import styles from "./Pricing.module.css";

export const metadata = {
  title: "Pricing",
  description: "EduQuest pricing for free learning access and future premium study features.",
};

/** Public pricing page for MVP transparency. */
export default function PricingPage() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <span>Pricing</span>
        <h1>Start free. Upgrade only when premium tools are ready.</h1>
      </header>
      <section className={styles.card}>
        <div>
          <h2>Free Student Plan</h2>
          <p>Class pages, engineering tracks, dashboard basics, community reading, and safe battle queue access.</p>
        </div>
        <ul>
          <li><CheckCircle2 size={16} /> Learning tracks</li>
          <li><CheckCircle2 size={16} /> Streak and XP dashboard</li>
          <li><CheckCircle2 size={16} /> Safe skill battles</li>
        </ul>
        <Link href="/sign-up" className={styles.button}>Create Free Account</Link>
      </section>
    </div>
  );
}
