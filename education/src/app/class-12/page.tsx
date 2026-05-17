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
        <div className={styles.classBanner} style={{ background: "linear-gradient(135deg, #F59E0B, #F97316)" }}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerLabel}><GraduationCap size={14} /> Board + Entrance Prep</div>
            <h1 className={styles.bannerTitle}>Class 12</h1>
            <p className={styles.bannerSubtitle}>
              Master board exams and ace entrance tests with structured revision and mock tests.
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

        <Class12StreamSelector />
      </div>
    </div>
  );
}
