/**
 * FILE: page.tsx
 * LOCATION: src/app/class-10/page.tsx
 * PURPOSE: Class 10 landing page — board exam focused. Shows all subjects as
 *          interactive dark-themed cards. Server-rendered for fast SEO.
 * USED BY: Next.js App Router — renders at "/class-10"
 * DEPENDENCIES: next/link, lucide-react, Class10.module.css
 * LAST UPDATED: 2026-05-17
 */

import Link from "next/link";
import {
  BookOpen, Calculator, Atom, Globe, Languages, ArrowRight,
  CheckCircle2, Users, Clock
} from "lucide-react";
import styles from "./Class10.module.css";

export const metadata = {
  title: "Class 10 — Board Exam Preparation | EduQuest",
  description:
    "CBSE Class 10 structured board exam preparation — Mathematics (Standard & Basic), Science, " +
    "Social Science, English, Hindi. Chapter-wise practice with day-wise plans.",
};

/*
 * SUBJECTS — Class 10 CBSE syllabus with dark-compatible colors.
 * bg = icon container background (rgba semi-transparent),
 * border = icon border (rgba semi-transparent),
 * color = icon + accent color.
 */
const SUBJECTS = [
  {
    id: "mathematics-standard",
    name: "Maths (Standard)",
    desc: "Full syllabus for standard stream — all 13 chapters with proof-level practice.",
    icon: Calculator,
    chapters: 15,
    days: 90,
    students: "2.4k",
    color: "#58A6FF",
    bg: "rgba(88, 166, 255, 0.12)",
    border: "rgba(88, 166, 255, 0.2)",
  },
  {
    id: "mathematics-basic",
    name: "Maths (Basic)",
    desc: "Simplified coverage for basic-level students with exam-pattern shortcuts.",
    icon: Calculator,
    chapters: 15,
    days: 75,
    students: "1.1k",
    color: "#BC8CFF",
    bg: "rgba(188, 140, 255, 0.12)",
    border: "rgba(188, 140, 255, 0.2)",
  },
  {
    id: "science",
    name: "Science",
    desc: "Physics, Chemistry, Biology — definitions, reactions, and diagram practice.",
    icon: Atom,
    chapters: 16,
    days: 90,
    students: "2.1k",
    color: "#3FB950",
    bg: "rgba(63, 185, 80, 0.12)",
    border: "rgba(63, 185, 80, 0.2)",
  },
  {
    id: "social-science",
    name: "Social Science",
    desc: "History, Geography, Civics, Economics — board-pattern answer practice.",
    icon: Globe,
    chapters: 20,
    days: 60,
    students: "1.8k",
    color: "#79C0FF",
    bg: "rgba(121, 192, 255, 0.12)",
    border: "rgba(121, 192, 255, 0.2)",
  },
  {
    id: "english",
    name: "English",
    desc: "First Flight, Footprints — literature comprehension + grammar drills.",
    icon: BookOpen,
    chapters: 12,
    days: 45,
    students: "1.5k",
    color: "#F0883E",
    bg: "rgba(240, 136, 62, 0.12)",
    border: "rgba(240, 136, 62, 0.2)",
  },
  {
    id: "hindi",
    name: "Hindi",
    desc: "Sparsh, Sanchayan — comprehension, poetry appreciation, grammar.",
    icon: Languages,
    chapters: 12,
    days: 45,
    students: "980",
    color: "#F85149",
    bg: "rgba(248, 81, 73, 0.12)",
    border: "rgba(248, 81, 73, 0.2)",
  },
];

const TOTAL_CHAPTERS = SUBJECTS.reduce((sum, s) => sum + s.chapters, 0);

/** Class 10 landing page — board exam prep hub */
export default function Class10Page() {
  return (
    <div className={styles.page}>

      {/* ═══════════════ HERO BANNER ═══════════════ */}
      <div className={styles.classBanner}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerLabel}>
            <BookOpen size={13} />
            CBSE Board Prep · Class 10
          </div>

          <h1 className={styles.bannerTitle}>Class 10</h1>
          <p className={styles.bannerSubtitle}>
            Board exam mastery with structured revision schedules, chapter-level mock tests,
            and targeted practice for every question type.
          </p>

          <div className={styles.bannerStats}>
            <div className={styles.bannerStat}>
              <span className={styles.bannerStatValue}>{SUBJECTS.length}</span>
              <span className={styles.bannerStatLabel}>Subjects</span>
            </div>
            <div className={styles.bannerDivider} aria-hidden="true" />
            <div className={styles.bannerStat}>
              <span className={styles.bannerStatValue}>{TOTAL_CHAPTERS}</span>
              <span className={styles.bannerStatLabel}>Chapters</span>
            </div>
            <div className={styles.bannerDivider} aria-hidden="true" />
            <div className={styles.bannerStat}>
              <span className={styles.bannerStatValue}>650+</span>
              <span className={styles.bannerStatLabel}>Questions</span>
            </div>
            <div className={styles.bannerDivider} aria-hidden="true" />
            <div className={styles.bannerStat}>
              <span className={styles.bannerStatValue}>9.8k</span>
              <span className={styles.bannerStatLabel}>Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════ SUBJECT GRID ═══════════════ */}
      <div className={styles.pageBody}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Choose a Subject</h2>
          <p className={styles.sectionSubtitle}>
            Select a subject to access CBSE-aligned chapter plans, board-pattern questions,
            and detailed solutions.
          </p>
        </div>

        <div className={styles.subjectGrid}>
          {SUBJECTS.map((subject) => {
            const SubjectIcon = subject.icon;
            return (
              <Link key={subject.id} href={`/class-10/${subject.id}`} className={styles.subjectCard}>
                <div
                  className={styles.cardAccent}
                  style={{ background: subject.color }}
                  aria-hidden="true"
                />

                <div className={styles.cardHeader}>
                  <div
                    className={styles.subjectIcon}
                    style={{ background: subject.bg, border: `1px solid ${subject.border}` }}
                    aria-hidden="true"
                  >
                    <SubjectIcon size={20} color={subject.color} />
                  </div>
                  <div className={styles.cardMeta}>
                    <h3 className={styles.subjectName}>{subject.name}</h3>
                    <span className={styles.chapterCount}>{subject.chapters} chapters</span>
                  </div>
                </div>

                <p className={styles.subjectDesc}>{subject.desc}</p>

                <div className={styles.cardFooter}>
                  <div className={styles.cardFooterMeta}>
                    <span className={styles.footerChip}>
                      <Clock size={11} />
                      {subject.days} days
                    </span>
                    <span className={styles.footerChip}>
                      <Users size={11} />
                      {subject.students}
                    </span>
                  </div>
                  <span className={styles.cardArrow} style={{ color: subject.color }}>
                    Explore <ArrowRight size={13} />
                  </span>
                </div>

                <div className={styles.readyBadge}>
                  <CheckCircle2 size={11} color={subject.color} />
                  <span style={{ color: subject.color }}>Ready</span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className={styles.loginTip}>
          <Atom size={14} />
          <span>
            <Link href="/sign-in" className={styles.loginLink}>Sign in</Link>
            {" "}to unlock personal progress tracking, XP rewards, and board prep streaks.
          </span>
        </div>
      </div>
    </div>
  );
}
