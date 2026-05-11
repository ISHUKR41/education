/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/page.tsx
 * PURPOSE: Class 9 landing page — shows all subjects available for Class 9
 *          with progress tracking and chapter counts. Uses shared ClassPage styles.
 * USED BY: Next.js App Router — renders at "/class-9"
 * DEPENDENCIES: lucide-react, ClassPage.module.css
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import {
  BookOpen, Calculator, Atom, Globe, Languages, Monitor,
  ArrowRight
} from "lucide-react";
import styles from "@/styles/ClassPage.module.css";

/** SEO metadata for Class 9 page */
export const metadata = {
  title: "Class 9 — All Subjects",
  description: "CBSE Class 9 complete learning path — Mathematics, Science, Social Science, English, Hindi, and more.",
};

/** Subject data for Class 9 with mock progress values */
const SUBJECTS = [
  { id: "mathematics", name: "Mathematics", icon: Calculator, chapters: 15, progress: 45, color: "#3B82F6", bg: "#EFF6FF" },
  { id: "science", name: "Science", icon: Atom, chapters: 15, progress: 30, color: "#10B981", bg: "#ECFDF5" },
  { id: "social-science", name: "Social Science", icon: Globe, chapters: 20, progress: 20, color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "english", name: "English", icon: Languages, chapters: 12, progress: 55, color: "#F59E0B", bg: "#FFFBEB" },
  { id: "hindi", name: "Hindi", icon: Languages, chapters: 12, progress: 40, color: "#EF4444", bg: "#FEF2F2" },
  { id: "computer-applications", name: "Computer Applications", icon: Monitor, chapters: 8, progress: 60, color: "#06B6D4", bg: "#ECFEFF" },
];

/**
 * Class9Page Component
 * 
 * Shows a hero banner with class info and a grid of subject cards.
 * Each card shows progress percentage and links to the subject's chapters.
 */
export default function Class9Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Class Banner */}
        <div className={styles.classBanner} style={{ background: "linear-gradient(135deg, #3B82F6, #06B6D4)" }}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerLabel}><BookOpen size={14} /> CBSE Curriculum</div>
            <h1 className={styles.bannerTitle}>Class 9</h1>
            <p className={styles.bannerSubtitle}>
              Build a rock-solid foundation across all subjects. Master the basics that everything else builds upon.
            </p>
            <div className={styles.bannerStats}>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>{SUBJECTS.length}</span>
                <span className={styles.bannerStatLabel}>Subjects</span>
              </div>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>{SUBJECTS.reduce((a, b) => a + b.chapters, 0)}</span>
                <span className={styles.bannerStatLabel}>Chapters</span>
              </div>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>500+</span>
                <span className={styles.bannerStatLabel}>Questions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject Cards Grid */}
        <div className={styles.subjectGrid}>
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              href={`/class-9/${subject.id}`}
              className={styles.subjectCard}
            >
              <div className={styles.subjectCardHeader}>
                <div className={styles.subjectIcon} style={{ background: subject.bg, color: subject.color }}>
                  <subject.icon size={22} />
                </div>
                <div>
                  <h3 className={styles.subjectName}>{subject.name}</h3>
                  <span className={styles.subjectMeta}>{subject.chapters} Chapters</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className={styles.subjectProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${subject.progress}%`, background: subject.color }}
                  />
                </div>
                <div className={styles.progressText}>
                  <span>{subject.progress}% Complete</span>
                  <span>{Math.round(subject.chapters * subject.progress / 100)}/{subject.chapters}</span>
                </div>
              </div>

              <div className={styles.subjectFooter}>
                Continue <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
