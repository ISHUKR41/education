/**
 * FILE: page.tsx
 * LOCATION: src/app/page.tsx
 * PURPOSE: Home page — The main landing page (front door) of EduQuest.
 *          Designed to be highly engaging, fully responsive, and conversion-focused.
 *          Structured into six distinct sections:
 *            1. Hero Section — Full-screen banner with animated gradient
 *            2. Stats Bar — Platform achievement numbers
 *            3. How It Works — 3-step onboarding guide
 *            4. Class Cards Section — Navigate to class learning tracks
 *            5. Engineering Preview — Top 6 programming languages
 *            6. Features Section — Core gamification features
 *            7. CTA Section — Final sign-up prompt
 *          All data is defined as arrays outside the component for clean separation.
 *          Each section uses isolated CSS module classes for scoped styling.
 * USED BY: Next.js App Router — renders at root "/" route automatically
 * DEPENDENCIES:
 *   - next/link for client-side navigation
 *   - lucide-react for SVG icons
 *   - HomePage.module.css for scoped styles
 * LAST UPDATED: 2026-05-16
 */

import Link from "next/link";
import {
  ArrowRight, Zap, BookOpen, ClipboardCheck, GraduationCap, Code2,
  Flame, Swords, Trophy, Target, BarChart3,
  Shield, Sparkles, CheckCircle2, Users, Star,
  TrendingUp, Layers, Brain, Clock
} from "lucide-react";
import styles from "./HomePage.module.css";

/** SEO metadata for search engines and social sharing */
export const metadata = {
  title: "EduQuest — Learn. Battle. Level Up.",
  description: "India's gamified learning platform for Class 9-12 and Engineering students. Master subjects with day-wise plans, compete in real-time battles, maintain streaks.",
};

/**
 * CLASS_CARDS Array
 * Data for all four main class category navigation cards.
 * Defined outside the component so it's stable across renders and easy to update.
 */
const CLASS_CARDS = [
  {
    id: "class-9",
    name: "Class 9",
    description: "Build a rock-solid foundation across all core subjects with structured chapter plans.",
    subjectCount: 6,
    gradient: "linear-gradient(135deg, #2563EB, #0EA5E9)",
    href: "/class-9",
    badge: "Foundation",
  },
  {
    id: "class-10",
    name: "Class 10",
    description: "Board exam ready — structured revision with board-style practice tests.",
    subjectCount: 6,
    gradient: "linear-gradient(135deg, #0F766E, #14B8A6)",
    href: "/class-10",
    badge: "Board Prep",
  },
  {
    id: "class-11",
    name: "Class 11",
    description: "Stream-based deep learning — Science, Commerce, and Arts covered.",
    subjectCount: 18,
    gradient: "linear-gradient(135deg, #7C3AED, #2563EB)",
    href: "/class-11",
    badge: "Stream-Based",
  },
  {
    id: "class-12",
    name: "Class 12",
    description: "Board + entrance exam mastery — NCERT and competitive exam questions.",
    subjectCount: 18,
    gradient: "linear-gradient(135deg, #D97706, #EA580C)",
    href: "/class-12",
    badge: "Board + Entrance",
  },
];

/**
 * HOW_IT_WORKS Array
 * Three clear steps that explain the EduQuest onboarding flow to first-time visitors.
 * Each step has an icon, step number, title, and description.
 */
const HOW_IT_WORKS = [
  {
    step: "01",
    icon: Layers,
    title: "Choose Your Track",
    desc: "Select your class (9th to 12th) or pick a programming language from the Engineering track. Every track has a structured, day-by-day plan.",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    step: "02",
    icon: Brain,
    title: "Study & Practice Daily",
    desc: "Follow your day plan, solve questions, and maintain your streak. Every correct answer earns XP and keeps your streak alive.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
  {
    step: "03",
    icon: Swords,
    title: "Battle & Climb Ranks",
    desc: "Jump into real-time battles against students at your level. Win battles to earn bonus XP, climb the leaderboard, and unlock new ranks.",
    color: "#D97706",
    bg: "#FFFBEB",
  },
];

/**
 * ENGINEERING_PREVIEW Array
 * Top 6 programming languages shown on the homepage as a teaser.
 * Each entry links to the full engineering plan for that language.
 */
const ENGINEERING_PREVIEW = [
  { id: "python", name: "Python", days: 45, emoji: "🐍", color: "#3776AB", bg: "#EBF5FB" },
  { id: "javascript", name: "JavaScript", days: 30, emoji: "⚡", color: "#F0B429", bg: "#FEFCE8" },
  { id: "java", name: "Java", days: 45, emoji: "☕", color: "#ED8B00", bg: "#FFF7ED" },
  { id: "cpp", name: "C++", days: 30, emoji: "⚙️", color: "#00599C", bg: "#EFF6FF" },
  { id: "typescript", name: "TypeScript", days: 25, emoji: "🔷", color: "#3178C6", bg: "#EFF6FF" },
  { id: "rust", name: "Rust", days: 40, emoji: "🦀", color: "#CE412B", bg: "#FEF2F2" },
];

/**
 * FEATURES Array
 * Core gamification and platform features of EduQuest.
 * These selling points make EduQuest unique compared to regular study platforms.
 */
const FEATURES = [
  {
    icon: Flame,
    title: "Daily Streaks",
    desc: "Build consistency with GitHub-style streak tracking. A visual calendar keeps you accountable every day.",
    color: "#D97706",
    bg: "#FFFBEB",
  },
  {
    icon: Swords,
    title: "Real-Time Battles",
    desc: "Challenge matched opponents in live quiz battles. Fastest and most accurate answer wins the round.",
    color: "#EF4444",
    bg: "#FEF2F2",
  },
  {
    icon: Trophy,
    title: "Level System",
    desc: "Earn XP for everything you do. Progress from Newcomer to Ultimate Legend across 100 levels.",
    color: "#F59E0B",
    bg: "#FFFBEB",
  },
  {
    icon: Target,
    title: "Day-Wise Plans",
    desc: "Structured 15 to 60 day learning plans. Know exactly what to study on Day 1, Day 15, Day 30.",
    color: "#10B981",
    bg: "#ECFDF5",
  },
  {
    icon: BarChart3,
    title: "Smart Analytics",
    desc: "See detailed progress charts showing your strengths, weak areas, and improvement over time.",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  {
    icon: Shield,
    title: "Anti-Cheat System",
    desc: "Fair play guaranteed — tab-switch detection, copy-paste prevention, and sandboxed competitions.",
    color: "#7C3AED",
    bg: "#F5F3FF",
  },
];

/**
 * STATS Array
 * Platform achievement numbers shown in the hero stats bar.
 * These numbers communicate scale and credibility to new visitors.
 */
const STATS = [
  { number: "4", label: "School Tracks", icon: BookOpen },
  { number: "12", label: "Coding Tracks", icon: Code2 },
  { number: "100+", label: "Learning Plans", icon: Target },
  { number: "1,000+", label: "Practice Questions", icon: ClipboardCheck },
];

/**
 * SOCIAL_PROOF Array
 * Testimonial-style trust signals displayed in the social proof section.
 */
const SOCIAL_PROOF = [
  {
    text: "Finally a platform that makes studying feel like a game. I haven't missed a day in 3 weeks!",
    name: "Arjun Sharma",
    role: "Class 11, Science",
    level: "Level 18",
    color: "#2563EB",
  },
  {
    text: "The Python 45-day plan is incredibly well structured. I completed it and landed my first internship.",
    name: "Priya Verma",
    role: "Engineering Student",
    level: "Level 32",
    color: "#7C3AED",
  },
  {
    text: "Real-time battles are addictive. Competing against classmates makes revision so much more engaging.",
    name: "Rohan Gupta",
    role: "Class 10, Board Prep",
    level: "Level 24",
    color: "#D97706",
  },
];

/**
 * HomePage Component
 *
 * The main landing page. Structured into distinct sections, each semantic and responsive.
 * Uses only CSS module classes — no inline Tailwind to keep styles scoped and maintainable.
 *
 * Section order:
 * 1. Hero → 2. Stats → 3. How It Works → 4. Class Cards → 5. Engineering Preview → 6. Features → 7. Social Proof → 8. CTA
 */
export default function HomePage() {
  return (
    <>
      {/* ==================== SECTION 1: HERO ==================== */}
      {/*
       * Full-screen hero section with gradient background animation.
       * Contains platform badge, main headline, subtitle, action buttons, and stats.
       * The gradient replaces the image dependency so it loads instantly on all connections.
       */}
      <section className={styles.hero} aria-label="EduQuest hero">
        {/* Animated gradient background overlay */}
        <div className={styles.heroGradient} aria-hidden="true" />

        {/* Decorative floating orbs for depth */}
        <div className={styles.heroOrb1} aria-hidden="true" />
        <div className={styles.heroOrb2} aria-hidden="true" />
        <div className={styles.heroOrb3} aria-hidden="true" />

        {/* Inner content container — max-width constrained and centered */}
        <div className={styles.heroInner}>

          {/* Platform Badge — pill above the headline */}
          <div className={styles.heroBadge}>
            <Sparkles size={13} aria-hidden="true" />
            India&apos;s Gamified Learning Platform
          </div>

          {/* Main Headline */}
          <h1 className={styles.heroTitle}>
            Master Your Subjects,{" "}
            <span className={styles.heroHighlight}>Level Up Your Future</span>
          </h1>

          {/* Hero Subtitle */}
          <p className={styles.heroSubtitle}>
            From Class 9 to Engineering — follow structured day-wise plans,
            compete in real-time battles, earn XP, and climb the leaderboard.
          </p>

          {/* Trust signals — quick facts below the subtitle */}
          <div className={styles.heroTrust}>
            <span className={styles.heroTrustItem}>
              <CheckCircle2 size={14} aria-hidden="true" />
              Free to start
            </span>
            <span className={styles.heroTrustItem}>
              <CheckCircle2 size={14} aria-hidden="true" />
              CBSE aligned
            </span>
            <span className={styles.heroTrustItem}>
              <CheckCircle2 size={14} aria-hidden="true" />
              Anti-cheat battles
            </span>
          </div>

          {/* CTA Buttons — stacked on mobile, side-by-side on desktop */}
          <div className={styles.heroActions}>
            <Link href="/sign-up" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
              <Zap size={17} aria-hidden="true" />
              Start Learning Free
            </Link>
            <Link href="/test" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>
              <ClipboardCheck size={17} aria-hidden="true" />
              Open Test Center
            </Link>
            <Link href="/engineering" className={`${styles.heroBtn} ${styles.heroBtnGhost}`}>
              <Code2 size={17} aria-hidden="true" />
              Explore Engineering
            </Link>
          </div>

          {/* Stats Bar — platform credibility numbers */}
          <div className={styles.statsBar}>
            {STATS.map((stat) => (
              <div key={stat.label} className={styles.statItem}>
                <span className={styles.statNumber}>{stat.number}</span>
                <span className={styles.statLabel}>{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 2: HOW IT WORKS ==================== */}
      {/*
       * Three-step explainer section. Tells new visitors exactly what to do.
       * Keeps cards in a 3-column grid on desktop and single column on mobile.
       */}
      <section className={styles.howSection} aria-label="How EduQuest works">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Simple Process</span>
            <h2 className={styles.sectionTitle}>How EduQuest Works</h2>
            <p className={styles.sectionSubtitle}>
              Three simple steps from sign-up to leveling up. No complexity, no confusion.
            </p>
          </div>

          <div className={styles.howGrid}>
            {HOW_IT_WORKS.map((step) => (
              <div key={step.step} className={styles.howCard}>
                {/* Step number — large display text in corner */}
                <span className={styles.howStepNum}>{step.step}</span>

                {/* Icon container with brand color */}
                <div
                  className={styles.howIcon}
                  style={{ background: step.bg, color: step.color }}
                  aria-hidden="true"
                >
                  <step.icon size={24} />
                </div>

                <h3 className={styles.howTitle}>{step.title}</h3>
                <p className={styles.howDesc}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 3: CLASS CARDS ==================== */}
      {/*
       * Four class category cards (Class 9 through 12).
       * Each card has a unique gradient accent, subject count, and badge label.
       * Cards are responsive: 1 column on mobile, 2 on tablet, 4 on desktop.
       */}
      <section className={styles.classSection} aria-label="Class tracks">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>School Learning</span>
            <h2 className={styles.sectionTitle}>Start Your Learning Journey</h2>
            <p className={styles.sectionSubtitle}>
              Select your class to access subject-wise chapters, practice tests, and day-wise study plans.
            </p>
          </div>

          <div className={styles.classGrid}>
            {CLASS_CARDS.map((card) => (
              <Link href={card.href} key={card.id} className={styles.classCard}>
                {/* Top gradient accent bar */}
                <div
                  className={styles.classCardGradient}
                  style={{ background: card.gradient }}
                  aria-hidden="true"
                />

                {/* Class icon */}
                <div
                  className={styles.classCardIcon}
                  style={{ background: card.gradient }}
                  aria-hidden="true"
                >
                  {card.id.includes("11") || card.id.includes("12")
                    ? <GraduationCap size={20} />
                    : <BookOpen size={20} />
                  }
                </div>

                {/* Badge */}
                <span className={styles.classCardBadge}>{card.badge}</span>

                {/* Card content */}
                <h3 className={styles.classCardName}>{card.name}</h3>
                <p className={styles.classCardDesc}>{card.description}</p>

                {/* Card footer with subject count and CTA arrow */}
                <div className={styles.classCardFooter}>
                  <span className={styles.classCardCount}>{card.subjectCount} Subjects</span>
                  <span className={styles.classCardArrow}>
                    Explore <ArrowRight size={13} aria-hidden="true" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 4: ENGINEERING PREVIEW ==================== */}
      {/*
       * Shows 6 of the 12 programming languages available as an appetizer.
       * Each language card has a color-coded emoji, day plan duration, and a link.
       * A "View All" CTA sends users to the full engineering page.
       */}
      <section className={styles.engSection} aria-label="Engineering track preview">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Engineering Track</span>
            <h2 className={styles.sectionTitle}>Master Programming Languages</h2>
            <p className={styles.sectionSubtitle}>
              Structured day-by-day plans for 12+ languages. Start from zero, finish interview-ready.
            </p>
          </div>

          <div className={styles.engGrid}>
            {ENGINEERING_PREVIEW.map((lang) => (
              <Link
                key={lang.id}
                href={`/engineering/${lang.id}`}
                className={styles.engCard}
              >
                {/* Language emoji icon */}
                <div
                  className={styles.engEmoji}
                  style={{ background: lang.bg }}
                  aria-hidden="true"
                >
                  {lang.emoji}
                </div>

                {/* Language name */}
                <h3 className={styles.engName}>{lang.name}</h3>

                {/* Duration */}
                <div className={styles.engMeta}>
                  <Clock size={12} aria-hidden="true" />
                  {lang.days}-Day Plan
                </div>

                {/* Learn more arrow */}
                <span className={styles.engArrow} style={{ color: lang.color }}>
                  Start <ArrowRight size={13} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </div>

          {/* View all engineering languages CTA */}
          <div className={styles.engCta}>
            <Link href="/engineering" className={styles.engCtaBtn}>
              View All 12 Languages
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 5: FEATURES ==================== */}
      {/*
       * Six feature cards showing EduQuest's core gamification systems.
       * Each card has a color-coded icon, title, and description.
       * Background is slightly off-white to visually separate from surrounding sections.
       */}
      <section className={styles.featuresSection} aria-label="Platform features">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Why EduQuest?</span>
            <h2 className={styles.sectionTitle}>Learning, Reimagined</h2>
            <p className={styles.sectionSubtitle}>
              We combine structured academics with gaming mechanics to make learning addictive and consistent.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                {/* Color-coded icon */}
                <div
                  className={styles.featureIcon}
                  style={{ background: feature.bg, color: feature.color }}
                  aria-hidden="true"
                >
                  <feature.icon size={21} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== SECTION 6: SOCIAL PROOF ==================== */}
      {/*
       * Three user testimonial cards. Each shows a quote, student name, role, and level badge.
       * Provides trust and social validation for prospective new users.
       */}
      <section className={styles.socialSection} aria-label="Student testimonials">
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Student Stories</span>
            <h2 className={styles.sectionTitle}>Students Love EduQuest</h2>
            <p className={styles.sectionSubtitle}>
              Thousands of students across India are leveling up their academics every day.
            </p>
          </div>

          <div className={styles.socialGrid}>
            {SOCIAL_PROOF.map((proof, idx) => (
              <div key={idx} className={styles.socialCard}>
                {/* Quote text */}
                <p className={styles.socialQuote}>&ldquo;{proof.text}&rdquo;</p>

                {/* Author info */}
                <div className={styles.socialAuthor}>
                  {/* Avatar initial circle */}
                  <div
                    className={styles.socialAvatar}
                    style={{ background: `${proof.color}20`, color: proof.color }}
                    aria-hidden="true"
                  >
                    {proof.name.charAt(0)}
                  </div>

                  <div className={styles.socialAuthorInfo}>
                    <span className={styles.socialName}>{proof.name}</span>
                    <span className={styles.socialRole}>{proof.role}</span>
                  </div>

                  {/* Level badge */}
                  <span className={styles.socialLevel} style={{ color: proof.color }}>
                    <Star size={11} aria-hidden="true" />
                    {proof.level}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Quick trust stat strip under testimonials */}
          <div className={styles.trustStrip}>
            <div className={styles.trustItem}>
              <TrendingUp size={18} aria-hidden="true" />
              <span>Average 40% improvement in test scores</span>
            </div>
            <div className={styles.trustSeparator} aria-hidden="true" />
            <div className={styles.trustItem}>
              <Users size={18} aria-hidden="true" />
              <span>Students from 200+ schools across India</span>
            </div>
            <div className={styles.trustSeparator} aria-hidden="true" />
            <div className={styles.trustItem}>
              <Flame size={18} aria-hidden="true" />
              <span>Top streak: 365 days of consecutive learning</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== SECTION 7: CTA ==================== */}
      {/*
       * Final call-to-action banner at the bottom of the page.
       * Gradient background, compelling headline, and a single primary button.
       * Responsive padding adjustments for mobile.
       */}
      <section className={styles.ctaSection} aria-label="Sign up call to action">
        <div className={styles.sectionInner}>
          <div className={styles.ctaCard}>
            {/* Decorative background orbs inside the CTA card */}
            <div className={styles.ctaOrb1} aria-hidden="true" />
            <div className={styles.ctaOrb2} aria-hidden="true" />

            <div className={styles.ctaContent}>
              <span className={styles.ctaBadge}>
                <Sparkles size={12} aria-hidden="true" />
                100% Free to Start
              </span>
              <h2 className={styles.ctaTitle}>Ready to Level Up?</h2>
              <p className={styles.ctaSubtitle}>
                Join thousands of students who study smarter, compete harder, and grow faster with EduQuest.
              </p>
              <div className={styles.ctaActions}>
                <Link href="/sign-up" className={styles.ctaBtn}>
                  Get Started Free
                  <ArrowRight size={15} aria-hidden="true" />
                </Link>
                <Link href="/features" className={styles.ctaBtnSecondary}>
                  See All Features
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
