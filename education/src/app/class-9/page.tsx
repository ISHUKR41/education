/**
 * FILE: page.tsx
 * LOCATION: src/app/class-9/page.tsx
 * PURPOSE: Class 9 landing page. Shows all six CBSE subjects as interactive cards.
 *          Dark-themed, fully responsive, server-rendered for SEO performance.
 *          Clicking any card routes to the subject page at /class-9/[subject].
 * USED BY: Next.js App Router — renders at "/class-9"
 * DEPENDENCIES: next/link, lucide-react, Class9.module.css
 * LAST UPDATED: 2026-05-17
 */

import Link from "next/link";
import {
  BookOpen, Calculator, Atom, Globe, Languages, Monitor,
  ArrowRight, CheckCircle2, Users, Clock
} from "lucide-react";
import styles from "./Class9.module.css";

export const metadata = {
  title: "Class 9 — All Subjects | EduQuest",
  description:
    "CBSE Class 9 complete learning path — Mathematics, Science, Social Science, English, Hindi, Computer Applications. " +
    "Day-wise plans, chapter-level practice, and gamified progress tracking.",
};

/*
 * ─── SUBJECTS DATA ────────────────────────────────────────────────────────────
 * Each subject card uses dark-compatible semi-transparent background (bg) so the
 * icon looks vibrant on the #161B22 card background without flashing light colors.
 * color = icon / text accent, bg = icon container background (rgba transparent).
 */
const SUBJECTS = [
  {
    id: "mathematics",
    name: "Mathematics",
    desc: "Algebra, geometry, statistics — full CBSE syllabus with chapter-wise drills.",
    icon: Calculator,
    chapters: 15,
    days: 90,
    students: "2.1k",
    color: "#58A6FF",
    bg: "rgba(88, 166, 255, 0.12)",
    border: "rgba(88, 166, 255, 0.2)",
  },
  {
    id: "science",
    name: "Science",
    desc: "Physics, Chemistry, Biology — concept explanations + formula banks.",
    icon: Atom,
    chapters: 15,
    days: 90,
    students: "1.8k",
    color: "#3FB950",
    bg: "rgba(63, 185, 80, 0.12)",
    border: "rgba(63, 185, 80, 0.2)",
  },
  {
    id: "social-science",
    name: "Social Science",
    desc: "History, Geography, Civics, Economics — map skills and long-answer practice.",
    icon: Globe,
    chapters: 20,
    days: 60,
    students: "1.5k",
    color: "#BC8CFF",
    bg: "rgba(188, 140, 255, 0.12)",
    border: "rgba(188, 140, 255, 0.2)",
  },
  {
    id: "english",
    name: "English",
    desc: "Beehive, Moments, grammar drills — literature + writing skills combined.",
    icon: BookOpen,
    chapters: 12,
    days: 45,
    students: "1.2k",
    color: "#F0883E",
    bg: "rgba(240, 136, 62, 0.12)",
    border: "rgba(240, 136, 62, 0.2)",
  },
  {
    id: "hindi",
    name: "Hindi",
    desc: "Kshitij, Kritika, Sparsh — comprehension, grammar and essay practice.",
    icon: Languages,
    chapters: 12,
    days: 45,
    students: "980",
    color: "#F85149",
    bg: "rgba(248, 81, 73, 0.12)",
    border: "rgba(248, 81, 73, 0.2)",
  },
  {
    id: "computer-applications",
    name: "Computer Applications",
    desc: "Hardware, software, internet, Python basics — CBSE CS fundamentals.",
    icon: Monitor,
    chapters: 8,
    days: 30,
    students: "760",
    color: "#79C0FF",
    bg: "rgba(121, 192, 255, 0.12)",
    border: "rgba(121, 192, 255, 0.2)",
  },
];

/** Aggregate stats for the banner quick-stat strip */
const TOTAL_CHAPTERS = SUBJECTS.reduce((sum, s) => sum + s.chapters, 0);

/*
 * ─── COMPONENT: Class9Page ────────────────────────────────────────────────────
 * Server Component — no "use client" needed. All data is static per-build.
 * Structure:
 *   1. Class Banner — hero with gradient, label, title, stats
 *   2. Subject Grid — 6 subject cards, 2→3 column responsive
 */
export default function Class9Page() {
  return (
    <div className={styles.page}>

      {/* ═══════════════════════════════════════
          SECTION 1: CLASS BANNER
          Full-width hero with grid background,
          class name, subtitle, and quick stats.
          ═══════════════════════════════════════ */}
      <div className={styles.classBanner}>
        <div className={styles.bannerContent}>
          {/* Small label pill above the title */}
          <div className={styles.bannerLabel}>
            <BookOpen size={13} />
            CBSE Curriculum · Class 9
          </div>

          <h1 className={styles.bannerTitle}>Class 9</h1>
          <p className={styles.bannerSubtitle}>
            Build a rock-solid foundation across all subjects. Master the concepts
            that every future chapter and exam depends on.
          </p>

          {/* Quick stats strip — shows aggregate numbers at a glance */}
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
              <span className={styles.bannerStatValue}>500+</span>
              <span className={styles.bannerStatLabel}>Questions</span>
            </div>
            <div className={styles.bannerDivider} aria-hidden="true" />
            <div className={styles.bannerStat}>
              <span className={styles.bannerStatValue}>7.3k</span>
              <span className={styles.bannerStatLabel}>Students</span>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════
          SECTION 2: SUBJECT CARDS GRID
          6 subject cards in a responsive 2→3 column grid.
          Each card links to /class-9/[subject.id].
          ═══════════════════════════════════════ */}
      <div className={styles.pageBody}>
        {/* Section heading */}
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Choose a Subject</h2>
          <p className={styles.sectionSubtitle}>
            Select any subject below to see chapter-wise plans, practice questions, and progress tracking.
          </p>
        </div>

        {/* Grid of subject cards — 2 columns mobile, 3 columns tablet+ */}
        <div className={styles.subjectGrid}>
          {SUBJECTS.map((subject) => {
            /* Extract icon as component so JSX can render it */
            const SubjectIcon = subject.icon;
            return (
              <Link key={subject.id} href={`/class-9/${subject.id}`} className={styles.subjectCard}>

                {/* Thin colored left accent bar */}
                <div
                  className={styles.cardAccent}
                  style={{ background: subject.color }}
                  aria-hidden="true"
                />

                {/* Card header: icon + subject name + chapter count */}
                <div className={styles.cardHeader}>
                  {/* Icon box — dark transparent background so icon color pops */}
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

                {/* Short description of what the subject covers */}
                <p className={styles.subjectDesc}>{subject.desc}</p>

                {/* Card footer: student count + days + explore arrow */}
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

                  {/* Explore arrow — gains gap on hover for a subtle micro-interaction */}
                  <span className={styles.cardArrow} style={{ color: subject.color }}>
                    Explore <ArrowRight size={13} />
                  </span>
                </div>

                {/* Ready badge — bottom-right indicator */}
                <div className={styles.readyBadge}>
                  <CheckCircle2 size={11} color={subject.color} />
                  <span style={{ color: subject.color }}>Ready</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom tip for logged-out students */}
        <div className={styles.loginTip}>
          <Atom size={14} />
          <span>
            <Link href="/sign-in" className={styles.loginLink}>Sign in</Link>
            {" "}to track your personal progress, earn XP, and maintain your daily streak.
          </span>
        </div>
      </div>
    </div>
  );
}
