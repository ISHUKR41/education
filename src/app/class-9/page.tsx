/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/page.tsx
 * PURPOSE: Class 9 landing page — This page displays all the subjects available for a Class 9 student.
 *          It is designed to give the student an overview of their curriculum, displaying subjects as 
 *          interactive cards with catalog readiness, chapter counts, and a clear visual hierarchy.
 *          It uses route-local CSS modules, meaning the styles here apply ONLY to Class 9.
 * USED BY: Next.js App Router — This page is rendered when a user navigates to "/class-9".
 * DEPENDENCIES: 
 *   - next/link for internal routing without page reloads.
 *   - lucide-react for consistent, crisp SVG icons.
 *   - Class9.module.css for all styling (scoped only to this component).
 * LAST UPDATED: 2026-05-12
 */

import Link from "next/link";
import {
  BookOpen, Calculator, Atom, Globe, Languages, Monitor,
  ArrowRight
} from "lucide-react";
import styles from "./Class9.module.css";

/** SEO metadata for Class 9 page */
export const metadata = {
  title: "Class 9 — All Subjects",
  description: "CBSE Class 9 complete learning path — Mathematics, Science, Social Science, English, Hindi, and more.",
};

/** 
 * SUBJECTS Array
 * This array acts as the primary data source for the Class 9 subjects. 
 * By separating data from the UI code, it becomes very easy to add a new subject later.
 * 
 * Each subject object contains:
 * - id: Used for the URL routing (e.g., /class-9/mathematics)
 * - name: The display name of the subject on the UI
 * - icon: The specific Lucide React icon component representing the subject
 * - chapters: Total number of chapters in the syllabus
 * - coverage: Catalog-readiness percentage for public pages. Personal progress
 *   is intentionally loaded only after sign-in from dashboard APIs.
 * - color & bg: Brand colors used to style the card and progress bar uniquely for each subject
 */
const SUBJECTS = [
  { id: "mathematics", name: "Mathematics", icon: Calculator, chapters: 15, coverage: 100, color: "#3B82F6", bg: "#EFF6FF" },
  { id: "science", name: "Science", icon: Atom, chapters: 15, coverage: 100, color: "#10B981", bg: "#ECFDF5" },
  { id: "social-science", name: "Social Science", icon: Globe, chapters: 20, coverage: 100, color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "english", name: "English", icon: Languages, chapters: 12, coverage: 100, color: "#F59E0B", bg: "#FFFBEB" },
  { id: "hindi", name: "Hindi", icon: Languages, chapters: 12, coverage: 100, color: "#EF4444", bg: "#FEF2F2" },
  { id: "computer-applications", name: "Computer Applications", icon: Monitor, chapters: 8, coverage: 100, color: "#06B6D4", bg: "#ECFEFF" },
];

/**
 * Class9Page Component
 * 
 * This is the main functional component that renders the Class 9 page.
 * It is structured into two main sections:
 * 1. A Hero Banner: Introduces the class, provides a motivating subtitle, and summarizes total stats (subjects, chapters, questions).
 * 2. A Grid of Subject Cards: Maps through the SUBJECTS array and creates a highly interactive, responsive card for each.
 */
export default function Class9Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* ==================== CLASS BANNER ==================== */}
        {/* The top hero section specific to Class 9. Uses an inline style gradient for a unique look. */}
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

        {/* ==================== SUBJECT CARDS GRID ==================== */}
        {/* Maps over the SUBJECTS array to dynamically generate a card for every subject.
            This grid automatically adjusts columns based on screen size (responsive). */}
        <div className={styles.subjectGrid}>
          {SUBJECTS.map((subject) => (
            <Link
              key={subject.id}
              href={`/class-9/${subject.id}`}
              className={styles.subjectCard}
            >
              {/* Card Header: Contains the specific subject icon and the title */}
              <div className={styles.subjectCardHeader}>
                <div className={styles.subjectIcon} style={{ background: subject.bg, color: subject.color }}>
                  <subject.icon size={22} />
                </div>
                <div>
                  <h3 className={styles.subjectName}>{subject.name}</h3>
                  <span className={styles.subjectMeta}>{subject.chapters} Chapters</span>
                </div>
              </div>

              {/* Catalog readiness bar — this is not user progress. */}
              <div className={styles.subjectProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${subject.coverage}%`, background: subject.color }}
                  />
                </div>
                <div className={styles.progressText}>
                  <span>Catalog Ready</span>
                  <span>{subject.chapters} chapters</span>
                </div>
              </div>

              <div className={styles.subjectFooter}>
                Open Plan <ArrowRight size={14} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
