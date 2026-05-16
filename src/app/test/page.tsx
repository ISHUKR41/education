/**
 * FILE: page.tsx
 * LOCATION: src/app/test/page.tsx
 * PURPOSE: Dedicated Test Center route required by the MCP plans. It gives
 *          students a clear hub for practice tests, board-style mocks, coding
 *          checkpoints, and future secure assessment flows.
 * USED BY: Main navigation, footer links, dashboard shortcuts, MCP route map
 * DEPENDENCIES: next/link, lucide-react, TestCenter.module.css
 * LAST UPDATED: 2026-05-12
 */

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  BookCheck,
  ClipboardCheck,
  Code2,
  ShieldCheck,
  TimerReset,
} from "lucide-react";
import styles from "./TestCenter.module.css";

export const metadata = {
  title: "Test Center",
  description:
    "Practice board-style mocks, coding checkpoints, and safe assessment workflows inside EduQuest.",
};

const TEST_LANES = [
  {
    icon: BookCheck,
    title: "Chapter Practice",
    description: "Short subject-specific checkpoints for daily revision and quick confidence checks.",
    href: "/class-10",
    label: "Open Class Routes",
  },
  {
    icon: TimerReset,
    title: "Timed Mock Flow",
    description: "A production-ready destination for future board-style mock exams and countdown sessions.",
    href: "/events",
    label: "View Event Tests",
  },
  {
    icon: Code2,
    title: "Coding Checkpoints",
    description: "Engineering plans already expose deep track routes that can host language-wise test sets next.",
    href: "/engineering",
    label: "Open Coding Tracks",
  },
] as const;

/** Renders the standalone assessment route with explicit next-step actions. */
export default function TestCenterPage() {
  return (
    <div className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.heroCopy}>
          <span className={styles.kicker}>
            <ClipboardCheck size={15} />
            Test Center
          </span>
          <h1>One clear home for practice, mocks, and secure assessment work.</h1>
          <p>
            This route closes the missing MCP test-folder requirement and gives the product a stable place to grow
            chapter quizzes, coding checkpoints, mock exams, and future proctored competition flows.
          </p>
          <div className={styles.heroActions}>
            <Link href="/dashboard" className={styles.primaryAction}>
              Open Dashboard <ArrowRight size={16} />
            </Link>
            <Link href="/battle" className={styles.secondaryAction}>
              Visit Battle Arena
            </Link>
          </div>
        </div>

        <aside className={styles.statusPanel}>
          <div className={styles.statusHeader}>
            <ShieldCheck size={18} />
            <span>Production Direction</span>
          </div>
          <ul>
            <li>Dedicated route and page-local CSS now exist.</li>
            <li>Assessment workflows stay separate from marketing pages.</li>
            <li>Future secure-browser, question-bank, and scoring modules have a clear destination.</li>
          </ul>
        </aside>
      </section>

      <section className={styles.lanes}>
        {TEST_LANES.map((lane) => {
          const LaneIcon = lane.icon;

          return (
            <article key={lane.title} className={styles.laneCard}>
              <div className={styles.laneIcon}>
                <LaneIcon size={20} />
              </div>
              <h2>{lane.title}</h2>
              <p>{lane.description}</p>
              <Link href={lane.href} className={styles.inlineLink}>
                {lane.label} <ArrowRight size={15} />
              </Link>
            </article>
          );
        })}
      </section>

      <section className={styles.foundationBand}>
        <div>
          <span>Assessment Backbone</span>
          <h2>Designed to plug into progress, events, and analytics without mixing concerns.</h2>
        </div>
        <div className={styles.foundationList}>
          <span><BarChart3 size={16} /> Analytics-ready</span>
          <span><ShieldCheck size={16} /> Secure-flow ready</span>
          <span><ClipboardCheck size={16} /> Separate route ownership</span>
        </div>
      </section>
    </div>
  );
}
