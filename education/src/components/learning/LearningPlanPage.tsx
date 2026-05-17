/**
 * FILE: LearningPlanPage.tsx
 * LOCATION: src/components/learning/LearningPlanPage.tsx
 * PURPOSE: Reusable detail-page renderer for class subjects and engineering
 *          plans. Dynamic route files provide the data; this component keeps
 *          the UX consistent and avoids broken placeholder pages.
 * USED BY: class subject dynamic routes and engineering dynamic route
 * DEPENDENCIES: next/link, lucide-react, LearningPlanPage.module.css
 * LAST UPDATED: 2026-05-11
 */

import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, CheckCircle2, Clock, Target } from "lucide-react";
import type { LearningPlan } from "@/lib/curriculum/learning-catalog";
import styles from "./LearningPlanPage.module.css";

interface LearningPlanPageProps {
  plan: LearningPlan;
}

/** Renders a working learning-plan detail route from catalog data. */
export default function LearningPlanPage({ plan }: LearningPlanPageProps) {
  return (
    <div className={styles.page}>
      <Link href={plan.backHref} className={styles.backLink}>
        <ArrowLeft size={16} />
        Back
      </Link>

      <section className={styles.hero} style={{ borderTopColor: plan.accent }}>
        <span className={styles.eyebrow}>{plan.eyebrow}</span>
        <h1>{plan.title}</h1>
        <p>{plan.description}</p>
        <div className={styles.metrics}>
          <span><Clock size={16} /> {plan.durationDays} days</span>
          <span><BookOpen size={16} /> {plan.chapters.length} modules</span>
          <span><Target size={16} /> Practice first</span>
        </div>
      </section>

      <section className={styles.grid}>
        <div className={styles.card}>
          <h2>Learning Modules</h2>
          <ol className={styles.moduleList}>
            {plan.chapters.map((chapter, index) => (
              <li key={chapter}>
                <span>{index + 1}</span>
                <div>
                  <strong>{chapter}</strong>
                  <small>Read, practice, revise, then unlock a checkpoint quiz.</small>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <aside className={styles.sideCard}>
          <h2>Start Plan</h2>
          <p>Use this route as the production-ready base for chapters, tests, and battle eligibility.</p>
          <ul>
            <li><CheckCircle2 size={15} /> Chapter list ready</li>
            <li><CheckCircle2 size={15} /> Progress API ready to connect</li>
            <li><CheckCircle2 size={15} /> Battle CTA ready</li>
          </ul>
          <Link href="/dashboard" className={styles.primaryAction}>
            Open Dashboard <ArrowRight size={16} />
          </Link>
        </aside>
      </section>
    </div>
  );
}
