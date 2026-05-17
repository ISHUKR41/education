/**
 * FILE: page.tsx
 * LOCATION: src/app/class-12/page.tsx
 * PURPOSE: Server route shell for the Class 12 landing page. Static metadata and
 *          board-prep copy stay server-rendered while only the stream selector
 *          hydrates on the client.
 * USED BY: Next.js App Router — renders at "/class-12"
 * LAST UPDATED: 2026-05-12
 */

import { GraduationCap } from "lucide-react";
import Class12StreamSelector from "./Class12StreamSelector";
import styles from "./Class12.module.css";

export const metadata = {
  title: "Class 12",
  description: "Choose a Class 12 stream and open exam-focused learning plans through a lighter server-first route shell.",
};

export default function Class12Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Banner: no inline style — background handled entirely in Class12.module.css */}
        <div className={styles.classBanner}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerLabel}><GraduationCap size={14} /> Board + Entrance Prep · Class 12</div>
            <h1 className={styles.bannerTitle}>Class 12</h1>
            <p className={styles.bannerSubtitle}>
              Master board exams and crack entrance tests. Structured revision schedules,
              mock tests, and formula revision for Science, Commerce, and Arts.
            </p>
            <div className={styles.bannerStats}>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>3</span>
                <span className={styles.bannerStatLabel}>Streams</span>
              </div>
              <div className={styles.bannerDivider} aria-hidden="true" />
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>5-6</span>
                <span className={styles.bannerStatLabel}>Subjects / Stream</span>
              </div>
              <div className={styles.bannerDivider} aria-hidden="true" />
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>100%</span>
                <span className={styles.bannerStatLabel}>Catalog Ready</span>
              </div>
            </div>
          </div>
        </div>

        <Class12StreamSelector />
      </div>
    </div>
  );
}
