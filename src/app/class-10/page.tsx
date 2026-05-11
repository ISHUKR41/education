/**
 * FILE: page.tsx
 * LOCATION: src/app/class-10/page.tsx
 * PURPOSE: Class 10 landing page — board exam focused, all subjects with progress.
 * USED BY: Next.js App Router — renders at "/class-10"
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import { BookOpen, Calculator, Atom, Globe, Languages, ArrowRight } from "lucide-react";
import styles from "@/styles/ClassPage.module.css";

export const metadata = {
  title: "Class 10 — Board Exam Preparation",
  description: "CBSE Class 10 complete board exam preparation — Maths, Science, Social Science, English.",
};

const SUBJECTS = [
  { id: "mathematics-standard", name: "Maths (Standard)", icon: Calculator, chapters: 15, progress: 35, color: "#3B82F6", bg: "#EFF6FF" },
  { id: "mathematics-basic", name: "Maths (Basic)", icon: Calculator, chapters: 15, progress: 25, color: "#6366F1", bg: "#EEF2FF" },
  { id: "science", name: "Science", icon: Atom, chapters: 16, progress: 40, color: "#10B981", bg: "#ECFDF5" },
  { id: "social-science", name: "Social Science", icon: Globe, chapters: 20, progress: 15, color: "#8B5CF6", bg: "#F5F3FF" },
  { id: "english", name: "English", icon: Languages, chapters: 12, progress: 50, color: "#F59E0B", bg: "#FFFBEB" },
  { id: "hindi", name: "Hindi", icon: Languages, chapters: 12, progress: 35, color: "#EF4444", bg: "#FEF2F2" },
];

export default function Class10Page() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.classBanner} style={{ background: "linear-gradient(135deg, #8B5CF6, #A855F7)" }}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerLabel}><BookOpen size={14} /> Board Exam Ready</div>
            <h1 className={styles.bannerTitle}>Class 10</h1>
            <p className={styles.bannerSubtitle}>
              Structured revision and practice tests designed for board exam success.
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
            </div>
          </div>
        </div>

        <div className={styles.subjectGrid}>
          {SUBJECTS.map((s) => (
            <Link key={s.id} href={`/class-10/${s.id}`} className={styles.subjectCard}>
              <div className={styles.subjectCardHeader}>
                <div className={styles.subjectIcon} style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
                <div>
                  <h3 className={styles.subjectName}>{s.name}</h3>
                  <span className={styles.subjectMeta}>{s.chapters} Chapters</span>
                </div>
              </div>
              <div className={styles.subjectProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${s.progress}%`, background: s.color }} />
                </div>
                <div className={styles.progressText}>
                  <span>{s.progress}% Complete</span>
                  <span>{Math.round(s.chapters * s.progress / 100)}/{s.chapters}</span>
                </div>
              </div>
              <div className={styles.subjectFooter}>Continue <ArrowRight size={14} /></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
