/**
 * FILE: page.tsx
 * LOCATION: src/app/page.tsx
 * PURPOSE: The primary landing page for EduQuest — the very first screen every visitor sees.
 *          Designed to be highly engaging, mobile-first, and conversion-focused. It communicates
 *          the platform's value proposition through a cinematic hero section, statistics bar,
 *          class selection cards, features grid, and a final CTA.
 *          This is a React Server Component (RSC) — no "use client" directive needed.
 *          All sections are statically rendered for maximum performance (instant load).
 * USED BY: Next.js App Router — automatically renders at the root "/" route.
 * DEPENDENCIES:
 *   - next/link for client-side navigation (zero full-page reloads)
 *   - lucide-react for professional SVG icons (tree-shaken to only the ones used)
 *   - HomePage.module.css for all page-specific styles (zero CSS conflicts with other pages)
 * LAST UPDATED: 2026-05-17
 * AUTHOR NOTE: Keep this file as a Server Component. Move any interactive behavior
 *              into a separate "use client" component.
 */

import Link from "next/link";
import {
  ArrowRight, Zap, BookOpen, ClipboardCheck, GraduationCap, Code2,
  Flame, Swords, Trophy, Target, BarChart3, Shield, Sparkles,
  Users, Star, GitBranch, Cpu
} from "lucide-react";
import styles from "./HomePage.module.css";

/** SEO metadata for the landing page — overrides the root layout defaults */
export const metadata = {
  title: "EduQuest — Learn. Battle. Level Up.",
  description:
    "India's gamified learning platform for Class 9-12 and Engineering students. " +
    "Day-wise study plans, real-time quiz battles, XP system, streaks, and leaderboards.",
};

/*
 * ─── DATA: CLASS CARDS ───────────────────────────────────────────────────────
 * The four main class-level entry points. Defined outside the component
 * so they are not re-created on every render (they never change at runtime).
 * Each card links to a full class page with subjects and chapter plans.
 */
const CLASS_CARDS = [
  {
    id: "class-9",
    name: "Class 9",
    shortLabel: "Grade 9",
    description: "Build a rock-solid foundation in all core subjects with structured chapter plans.",
    subjectCount: 6,
    /* CSS linear-gradient applied inline for the thin top accent bar and icon bg */
    gradient: "linear-gradient(135deg, #2563EB, #0EA5E9)",
    href: "/class-9",
    icon: BookOpen,
  },
  {
    id: "class-10",
    name: "Class 10",
    shortLabel: "Board Year",
    description: "Board exam mastery — revision schedules, mock tests, and targeted practice.",
    subjectCount: 6,
    gradient: "linear-gradient(135deg, #0F766E, #14B8A6)",
    href: "/class-10",
    icon: ClipboardCheck,
  },
  {
    id: "class-11",
    name: "Class 11",
    shortLabel: "Stream Track",
    description: "Choose your stream — Science, Commerce, or Arts — and dive deep.",
    subjectCount: 18,
    gradient: "linear-gradient(135deg, #7C3AED, #6366F1)",
    href: "/class-11",
    icon: GraduationCap,
  },
  {
    id: "class-12",
    name: "Class 12",
    shortLabel: "Final Sprint",
    description: "Board + JEE / NEET / CUET preparation with full-length mock exams.",
    subjectCount: 18,
    gradient: "linear-gradient(135deg, #D97706, #EA580C)",
    href: "/class-12",
    icon: Trophy,
  },
];

/*
 * ─── DATA: PLATFORM FEATURES ──────────────────────────────────────────────────
 * Six feature cards that explain the gamification mechanics.
 * Each entry has a Lucide icon component, a title, and a description.
 * The icon background color pair (bg + color) is applied inline.
 */
const FEATURES = [
  {
    icon: Flame,
    title: "Daily Streaks",
    desc: "Build study consistency with GitHub-style streak chains. Lose a day — break the streak.",
    iconBg: "rgba(240, 136, 62, 0.15)",
    iconColor: "#F0883E",
  },
  {
    icon: Swords,
    title: "Real-Time Battles",
    desc: "Challenge friends or get matched with opponents at your exact skill level in live quiz duels.",
    iconBg: "rgba(248, 81, 73, 0.15)",
    iconColor: "#F85149",
  },
  {
    icon: Trophy,
    title: "XP & Level System",
    desc: "Earn XP for every answer, lesson, and battle. Progress from Newcomer to Ultimate Legend.",
    iconBg: "rgba(88, 166, 255, 0.15)",
    iconColor: "#58A6FF",
  },
  {
    icon: Target,
    title: "Day-Wise Plans",
    desc: "Follow expert-designed 15-60 day study plans that break any subject into daily chunks.",
    iconBg: "rgba(63, 185, 80, 0.15)",
    iconColor: "#3FB950",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "Track performance with detailed charts — see exactly which topics need more attention.",
    iconBg: "rgba(188, 140, 255, 0.15)",
    iconColor: "#BC8CFF",
  },
  {
    icon: Shield,
    title: "Anti-Cheat Engine",
    desc: "Fair, trustworthy competitions. Tab-switch detection, timer integrity, and answer locking.",
    iconBg: "rgba(210, 153, 34, 0.15)",
    iconColor: "#D29922",
  },
];

/*
 * ─── DATA: HOW IT WORKS — 3 STEPS ────────────────────────────────────────────
 * Simple numbered steps explaining the platform flow.
 */
const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Pick Your Track",
    desc: "Select your class (9–12) or engineering language. Every track has structured day-wise content ready to go.",
  },
  {
    step: "02",
    title: "Learn & Practice",
    desc: "Follow the daily plan, answer questions, earn XP, and maintain your streak — one day at a time.",
  },
  {
    step: "03",
    title: "Battle & Climb",
    desc: "Join real-time quiz battles, check your rank on the leaderboard, and unlock achievement badges.",
  },
];

/*
 * ─── DATA: PLATFORM STATS ────────────────────────────────────────────────────
 * Large-number statistics that build trust and FOMO.
 */
const PLATFORM_STATS = [
  { num: "4", label: "School Classes", icon: BookOpen },
  { num: "12+", label: "Coding Languages", icon: Code2 },
  { num: "100+", label: "Study Routes", icon: GitBranch },
  { num: "Live", label: "Battle Arena", icon: Swords },
];

/*
 * ─── DATA: ENGINEERING LANGUAGE PILLS ───────────────────────────────────────
 * Short language names shown as code-style pills in the engineering card.
 */
const ENG_LANGS = ["C", "C++", "Java", "Python", "JavaScript", "TypeScript", "Rust", "Kotlin", "Swift", "PHP"];

/*
 * ─── COMPONENT: HomePage ─────────────────────────────────────────────────────
 * The main landing page component. Organized into semantic <section> elements:
 *   1. Hero — headline, subtitle, CTAs, quick stats
 *   2. Class Cards — four class entry points
 *   3. Engineering Card — engineering track teaser
 *   4. Features Grid — six feature cards
 *   5. How It Works — three-step process
 *   6. Platform Stats — four large numbers
 *   7. CTA Banner — final conversion push
 */
export default function HomePage() {
  return (
    <>
      {/* ════════════════════════════════════════════════════
          SECTION 1: HERO
          First impression — full-height cinematic section.
          Background: deep navy + grid lines + glow radials.
          Content: badge + headline + subtitle + CTA buttons + stats.
          ════════════════════════════════════════════════════ */}
      <section className={styles.hero} aria-label="Platform hero">
        <div className={styles.heroInner}>

          {/* Platform Badge — draws attention before the headline */}
          <div className={styles.heroBadge} aria-hidden="true">
            <Sparkles size={12} />
            India&apos;s #1 Gamified Learning Platform
          </div>

          {/* Main Headline — Space Grotesk, large, with gradient highlight */}
          <h1 className={styles.heroTitle}>
            Master Every Subject.{" "}
            <span className={styles.heroHighlight}>Level Up For Life.</span>
          </h1>

          {/* Subtitle — explains the platform in 2 lines */}
          <p className={styles.heroSubtitle}>
            From Class 9 to Engineering — structured day-wise plans, real-time quiz battles,
            XP streaks, and leaderboards. Learning that feels like a game.
          </p>

          {/* CTA Buttons — primary action + 2 secondary links */}
          <div className={styles.heroActions}>
            {/* Primary CTA — the most important action on the page */}
            <Link href="/sign-up" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
              <Zap size={17} />
              Start Learning Free
            </Link>

            {/* Secondary CTA — browse the test center */}
            <Link href="/test" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>
              <ClipboardCheck size={17} />
              Open Test Center
            </Link>

            {/* Tertiary CTA — engineering section */}
            <Link href="/engineering" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>
              <Code2 size={17} />
              Engineering Tracks
            </Link>
          </div>

          {/* Quick Stats Bar — four short numbers that build credibility */}
          <div className={styles.statsBar} aria-label="Quick platform statistics">
            {PLATFORM_STATS.map((stat) => (
              /* Each stat is a number + label stacked vertically */
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statNumber}>{stat.num}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 2: CLASS SELECTION CARDS
          Four cards arranged in a responsive grid.
          Users click a card to enter that class's subject list.
          ════════════════════════════════════════════════════ */}
      <section className={styles.classSection} aria-label="Class selection">
        <div className={styles.sectionInner}>

          {/* Section header — label + title + subtitle */}
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Choose Your Class</span>
            <h2 className={styles.sectionTitle}>Start Your Learning Journey</h2>
            <p className={styles.sectionSubtitle}>
              Pick your grade to access subject-wise chapters, day-wise study plans, and
              chapter-level practice tests — all structured for CBSE.
            </p>
          </div>

          {/* 
           * Class Cards Grid — 1 column on mobile, 2 on tablet, 4 on desktop.
           * Each card is a Next.js <Link> so navigation is instant.
           */}
          <div className={styles.classGrid}>
            {CLASS_CARDS.map((card) => {
              /* Extract the icon component so JSX can render it */
              const CardIcon = card.icon;
              return (
                <Link href={card.href} key={card.id} className={styles.classCard}>
                  {/* Thin gradient accent bar at the top of each card */}
                  <div
                    className={styles.classCardGradient}
                    style={{ background: card.gradient }}
                    aria-hidden="true"
                  />

                  {/* Icon box — uses the same gradient as the top bar */}
                  <div
                    className={styles.classCardIcon}
                    style={{ background: card.gradient }}
                    aria-hidden="true"
                  >
                    <CardIcon size={22} color="white" />
                  </div>

                  {/* Class name */}
                  <h3 className={styles.classCardName}>{card.name}</h3>

                  {/* Short description */}
                  <p className={styles.classCardDesc}>{card.description}</p>

                  {/* Card footer: subject count + explore arrow */}
                  <div className={styles.classCardFooter}>
                    <span>{card.subjectCount} Subjects</span>
                    <span className={styles.classCardArrow}>
                      Explore <ArrowRight size={13} />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 3: ENGINEERING TRACK CARD
          A single wide card that teases the engineering section.
          Shows language pills + a CTA button.
          ════════════════════════════════════════════════════ */}
      <section className={styles.engineeringSection} aria-label="Engineering tracks">
        <div className={styles.sectionInner}>
          <div className={styles.engineeringCard}>

            {/* Left: title, description, CTA */}
            <div className={styles.engineeringContent}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-3)" }}>
                <div style={{
                  width: "3rem", height: "3rem", display: "flex", alignItems: "center",
                  justifyContent: "center", background: "var(--color-primary-dim)",
                  border: "1px solid var(--color-primary-border)", borderRadius: "var(--radius-lg)"
                }}>
                  <Cpu size={22} color="var(--color-primary)" />
                </div>
                <div>
                  <h2 className={styles.engineeringTitle}>Engineering &amp; Programming</h2>
                  <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
                    12 languages · 30-day plans each
                  </p>
                </div>
              </div>
              <p className={styles.engineeringDesc}>
                Master C, C++, Java, Python, JavaScript, TypeScript, Rust, and more
                through expert-designed 30-day learning plans with daily exercises.
              </p>
              <Link href="/engineering" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}
                style={{ marginTop: "var(--space-4)", alignSelf: "flex-start", display: "inline-flex" }}>
                Explore Tracks <ArrowRight size={16} />
              </Link>
            </div>

            {/* Right: programming language pills */}
            <div>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)", marginBottom: "var(--space-3)", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                Available Languages
              </p>
              <div className={styles.engineeringLangs}>
                {/* Iterate over language list to create pill-shaped badges */}
                {ENG_LANGS.map((lang) => (
                  <span key={lang} className={styles.langPill}>
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 4: FEATURES GRID
          Six feature cards in a 3-column grid.
          Each shows an icon, title, and one-line description.
          ════════════════════════════════════════════════════ */}
      <section className={styles.featuresSection} aria-label="Platform features">
        <div className={styles.sectionInner}>

          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Why EduQuest</span>
            <h2 className={styles.sectionTitle}>Learning, Reimagined</h2>
            <p className={styles.sectionSubtitle}>
              We mix structured academics with gaming mechanics to make studying addictive —
              in the best possible way.
            </p>
          </div>

          {/* Features grid — 1 → 2 → 3 columns depending on screen width */}
          <div className={styles.featuresGrid}>
            {FEATURES.map((feature, idx) => {
              /* Extract the icon component to render it as JSX */
              const FeatureIcon = feature.icon;
              return (
                <div key={idx} className={styles.featureCard}>
                  {/* Icon box with per-feature background color */}
                  <div
                    className={styles.featureIcon}
                    style={{ background: feature.iconBg }}
                    aria-hidden="true"
                  >
                    <FeatureIcon size={22} color={feature.iconColor} />
                  </div>
                  <h3 className={styles.featureTitle}>{feature.title}</h3>
                  <p className={styles.featureDesc}>{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 5: HOW IT WORKS
          Three numbered steps explaining the user journey.
          ════════════════════════════════════════════════════ */}
      <section className={styles.howSection} aria-label="How EduQuest works">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Simple Process</span>
            <h2 className={styles.sectionTitle}>How It Works</h2>
            <p className={styles.sectionSubtitle}>
              Three simple steps to go from confused student to confident top ranker.
            </p>
          </div>

          {/* Steps grid — 1 column mobile, 3 columns desktop */}
          <div className={styles.stepsGrid}>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className={styles.step}>
                {/* Numbered circle — monospace font for that data-science feel */}
                <div className={styles.stepNumber}>{step.step}</div>
                <h3 className={styles.stepTitle}>{step.title}</h3>
                <p className={styles.stepDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 6: PLATFORM STATS
          Four large-number stats — builds FOMO and trust.
          ════════════════════════════════════════════════════ */}
      <section className={styles.platformStats} aria-label="Platform statistics">
        <div className={styles.sectionInner}>
          <div className={styles.platformStatsGrid}>
            {/* Stat cards with large numbers and short labels */}
            <div className={styles.platformStat}>
              <span className={styles.platformStatNum}>4</span>
              <span className={styles.platformStatLabel}>School Classes</span>
            </div>
            <div className={styles.platformStat}>
              <span className={styles.platformStatNum}>12+</span>
              <span className={styles.platformStatLabel}>Coding Languages</span>
            </div>
            <div className={styles.platformStat}>
              <span className={styles.platformStatNum}>100+</span>
              <span className={styles.platformStatLabel}>Study Routes</span>
            </div>
            <div className={styles.platformStat}>
              <span className={styles.platformStatNum}>∞</span>
              <span className={styles.platformStatLabel}>Battle Matches</span>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
          SECTION 7: CTA BANNER
          The final conversion push — large button, no distractions.
          ════════════════════════════════════════════════════ */}
      <section className={styles.ctaSection} aria-label="Sign up call to action">
        <div className={styles.sectionInner}>
          <div className={styles.ctaCard}>
            {/* Icon above the headline */}
            <div style={{
              width: "4rem", height: "4rem", display: "flex", alignItems: "center",
              justifyContent: "center", background: "var(--color-primary-dim)",
              border: "1px solid var(--color-primary-border)", borderRadius: "var(--radius-xl)",
              margin: "0 auto var(--space-6)"
            }}>
              <Star size={28} color="var(--color-primary)" />
            </div>

            <h2 className={styles.ctaTitle}>Ready to Level Up?</h2>
            <p className={styles.ctaSubtitle}>
              Join thousands of Indian students who are learning smarter, competing harder,
              and climbing higher every single day.
            </p>

            {/* CTA action buttons */}
            <div className={styles.ctaActions}>
              <Link href="/sign-up" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
                <Zap size={17} />
                Get Started — It&apos;s Free
              </Link>
              <Link href="/class-9" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>
                <Users size={17} />
                Explore Classes
              </Link>
            </div>

            {/* Trust note — reduces friction */}
            <p className={styles.ctaNote}>
              No credit card required · CBSE aligned · 100% free to start
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
