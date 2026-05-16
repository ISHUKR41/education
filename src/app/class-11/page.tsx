/**
 * FILE: page.tsx
 * LOCATION: src/app/class-11/page.tsx
 * PURPOSE: Server route shell for the Class 11 landing page. Static metadata and
 *          banner content stay server-rendered while the interactive stream
 *          switcher lives in a small client component.
 * USED BY: Next.js App Router — renders at "/class-11"
 * LAST UPDATED: 2026-05-12
 */

import { GraduationCap } from "lucide-react";
import Class11StreamSelector from "./Class11StreamSelector";
import styles from "./Class11.module.css";

export const metadata = {
  title: "Class 11",
  description: "Choose a Class 11 stream and open subject-wise learning plans with a lighter server-first page shell.",
};

export default function Class11Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Banner */}
        <div className={styles.classBanner} style={{ background: "linear-gradient(135deg, #10B981, #14B8A6)" }}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerLabel}><GraduationCap size={14} /> Stream Selection</div>
            <h1 className={styles.bannerTitle}>Class 11</h1>
            <p className={styles.bannerSubtitle}>
              Deep learning in your chosen stream — Science, Commerce, or Arts.
            </p>
            <div className={styles.bannerStats}>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>3</span>
                <span className={styles.bannerStatLabel}>Streams</span>
              </div>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>5-6</span>
                <span className={styles.bannerStatLabel}>Subjects / Stream</span>
              </div>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>100%</span>
                <span className={styles.bannerStatLabel}>Route Ready</span>
              </div>
            </div>
          </div>
        </div>

        <Class11StreamSelector />
      </div>
    </div>
  );
}
