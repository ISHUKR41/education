/**
 * FILE: page.tsx
 * LOCATION: src/app/page.tsx
 * PURPOSE: Home page — This is the primary landing page (the front door) of the EduQuest platform.
 *          It is designed to be highly engaging and responsive, immediately capturing the user's attention.
 *          It showcases the platform using a beautifully designed hero section, displays all available
 *          class categories using interactive cards, outlines the core gamification features in a grid,
 *          presents a live statistics bar, and concludes with a strong call-to-action (CTA) banner.
 *          The entire page is built to be responsive from the smallest mobile device (e.g., iPhone SE)
 *          to the largest desktop monitor.
 * USED BY: Next.js App Router — This file automatically renders at the root ("/") route of the application.
 * DEPENDENCIES: 
 *   - next/link for client-side routing.
 *   - next/image for highly optimized image rendering.
 *   - lucide-react for lightweight, scalable SVG icons.
 *   - HomePage.module.css for completely isolated, scoped styling (ensuring no CSS conflicts).
 * LAST UPDATED: 2026-05-12
 */

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, Zap, BookOpen, ClipboardCheck, GraduationCap, Code2,
  Flame, Swords, Trophy, Target, BarChart3,
  Shield, Sparkles
} from "lucide-react";
import styles from "./HomePage.module.css";

/** SEO metadata specific to the Home page */
export const metadata = {
  title: "EduQuest — Learn. Battle. Level Up.",
  description: "India's gamified learning platform for Class 9-12 and Engineering students. Master subjects with day-wise plans, compete in battles, maintain streaks.",
};

/**
 * CLASS_CARDS Array
 * This array contains the data for all four main class categories (Class 9 to Class 12).
 * By defining this data outside the component, we keep the rendering logic clean and
 * make it incredibly easy to add or modify class cards in the future.
 * Each object represents a card and includes:
 * - id: A unique string identifier.
 * - name: The display name of the class.
 * - description: A short, engaging subtitle explaining what the class offers.
 * - subjectCount: The total number of subjects available in that class.
 * - gradient: A visually striking CSS linear gradient used for styling the card's header and icon.
 * - href: The internal route link where the user will be redirected upon clicking.
 */
const CLASS_CARDS = [
  {
    id: "class-9", name: "Class 9", description: "Build a rock-solid foundation across all subjects",
    subjectCount: 6, gradient: "linear-gradient(135deg, #2563EB, #0EA5E9)", href: "/class-9",
  },
  {
    id: "class-10", name: "Class 10", description: "Board exam ready — structured revision & practice tests",
    subjectCount: 6, gradient: "linear-gradient(135deg, #0F766E, #14B8A6)", href: "/class-10",
  },
  {
    id: "class-11", name: "Class 11", description: "Stream-based deep learning — Science, Commerce, Arts",
    subjectCount: 18, gradient: "linear-gradient(135deg, #7C3AED, #2563EB)", href: "/class-11",
  },
  {
    id: "class-12", name: "Class 12", description: "Board + entrance exam mastery with mock tests",
    subjectCount: 18, gradient: "linear-gradient(135deg, #D97706, #EA580C)", href: "/class-12",
  },
];

/**
 * FEATURES Array
 * This array holds the core gamification and learning features of the EduQuest platform.
 * These are the selling points that make EduQuest unique and highly interactive.
 * Each object includes:
 * - icon: A specific Lucide React icon component for visual representation.
 * - title: The name of the feature.
 * - desc: A detailed explanation of what the feature does for the user.
 */
const FEATURES = [
  {
    icon: Flame, title: "Daily Streaks",
    desc: "Build consistency with GitHub-style streak tracking. Never break the chain!",
  },
  {
    icon: Swords, title: "Real-Time Battles",
    desc: "Challenge friends or get matched with opponents at your skill level.",
  },
  {
    icon: Trophy, title: "Level System",
    desc: "Earn XP for everything you do. Progress from Newcomer to Ultimate Legend.",
  },
  {
    icon: Target, title: "Day-Wise Plans",
    desc: "Structured learning paths — follow a 15 to 60 day plan for any subject.",
  },
  {
    icon: BarChart3, title: "Smart Analytics",
    desc: "Track your progress with detailed charts showing strengths and weaknesses.",
  },
  {
    icon: Shield, title: "Anti-Cheat System",
    desc: "Fair competitions with tab-switch detection and copy-paste protection.",
  },
];

/**
 * HomePage Component
 *
 * This is the main default export function that renders the landing page of EduQuest.
 * It is structured into multiple distinct, semantic sections to ensure a flawless user experience.
 * Every section is fully responsive and designed to convert visitors into registered users.
 * 
 * Page Structure:
 * 1. Hero Section: The massive visual banner at the top.
 * 2. Stats Bar: Quick numerical achievements of the platform.
 * 3. Class Cards Section: Navigation to different grade levels.
 * 4. Features Section: Showcasing what makes the platform amazing.
 * 5. CTA (Call To Action) Section: The final prompt to sign up.
 */
export default function HomePage() {
  return (
    <>
      {/* ==================== HERO SECTION ==================== */}
      {/* The hero section is the first thing users see. It includes a background image,
          a dark overlay shade, and the main introductory text with action buttons. */}
      <section className={styles.hero}>
        {/* Optimized background image covering the entire hero area */}
        <Image
          src="/images/eduquest-home-hero.png"
          alt="Students learning and competing inside a modern digital education platform"
          fill
          priority
          className={styles.heroMedia}
          sizes="100vw"
        />
        {/* A semi-transparent dark gradient overlay to ensure text remains readable over the image */}
        <div className={styles.heroShade} aria-hidden="true" />
        
        {/* The inner container that centers and restricts the maximum width of the content */}
        <div className={styles.heroInner}>
          
          {/* Platform Badge: A small, attractive pill-shaped badge above the main title */}
          <div className={styles.heroBadge}>
            <Sparkles size={14} />
            India&apos;s Gamified Learning Platform
          </div>

          {/* Main Headline: Huge, bold text using a gradient highlight for visual impact */}
          <h1 className={styles.heroTitle}>
            Master Your Subjects,{" "}
            <span className={styles.heroHighlight}>Level Up Your Future</span>
          </h1>

          {/* Subtitle: A descriptive paragraph explaining the platform's core offering */}
          <p className={styles.heroSubtitle}>
            From Class 9 to Engineering — follow structured day-wise plans,
            compete in real-time battles, earn XP, and climb the leaderboard.
          </p>

          {/* CTA Buttons: The primary actions we want the user to take right away.
              These buttons stack neatly on mobile screens and align side-by-side on desktop. */}
          <div className={styles.heroActions}>
            <Link href="/sign-up" className={`${styles.heroBtn} ${styles.heroBtnPrimary}`}>
              <Zap size={18} />
              Start Learning Free
            </Link>
            <Link href="/test" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>
              <ClipboardCheck size={18} />
              Open Test Center
            </Link>
            <Link href="/engineering" className={`${styles.heroBtn} ${styles.heroBtnSecondary}`}>
              <Code2 size={18} />
              Explore Engineering
            </Link>
          </div>

          {/* Stats Bar */}
          <div className={styles.statsBar}>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>4</span>
              <span className={styles.statLabel}>School Tracks</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>12</span>
              <span className={styles.statLabel}>Coding Tracks</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>100+</span>
              <span className={styles.statLabel}>Prebuilt Routes</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statNumber}>5</span>
              <span className={styles.statLabel}>Live API Areas</span>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== CLASS CARDS SECTION ==================== */}
      <section className={styles.classSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Choose Your Class</span>
            <h2 className={styles.sectionTitle}>Start Your Learning Journey</h2>
            <p className={styles.sectionSubtitle}>
              Select your class to access subject-wise chapters, practice tests, and day-wise study plans.
            </p>
          </div>

          <div className={styles.classGrid}>
            {CLASS_CARDS.map((card) => (
              <Link href={card.href} key={card.id} className={styles.classCard}>
                {/* Top gradient bar */}
                <div className={styles.classCardGradient} style={{ background: card.gradient }} />

                {/* Icon */}
                <div className={styles.classCardIcon} style={{ background: card.gradient }}>
                  {card.id.includes("11") || card.id.includes("12")
                    ? <GraduationCap size={22} />
                    : <BookOpen size={22} />
                  }
                </div>

                {/* Content */}
                <h3 className={styles.classCardName}>{card.name}</h3>
                <p className={styles.classCardDesc}>{card.description}</p>

                {/* Footer */}
                <div className={styles.classCardFooter}>
                  <span>{card.subjectCount} Subjects</span>
                  <span className={styles.classCardArrow}>
                    Explore <ArrowRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className={styles.featuresSection}>
        <div className={styles.sectionInner}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionLabel}>Why EduQuest</span>
            <h2 className={styles.sectionTitle}>Learning, Reimagined</h2>
            <p className={styles.sectionSubtitle}>
              We combine structured academics with gaming mechanics to make learning addictive.
            </p>
          </div>

          <div className={styles.featuresGrid}>
            {FEATURES.map((feature, idx) => (
              <div key={idx} className={styles.featureCard}>
                <div className={styles.featureIcon}>
                  <feature.icon size={22} />
                </div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDesc}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className={styles.ctaSection}>
        <div className={styles.sectionInner}>
          <div className={styles.ctaCard}>
            <h2 className={styles.ctaTitle}>Ready to Level Up?</h2>
            <p className={styles.ctaSubtitle}>
              Start with the routes that already work today, then keep expanding into deeper practice and competition modules.
            </p>
            <Link href="/sign-up" className={styles.ctaBtn}>
              Get Started Free <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
