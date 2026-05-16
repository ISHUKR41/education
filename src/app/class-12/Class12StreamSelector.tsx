/**
 * FILE: Class12StreamSelector.tsx
 * LOCATION: src/app/class-12/Class12StreamSelector.tsx
 * PURPOSE: Small client-only stream switcher for the Class 12 landing page.
 *          The server page owns metadata and static copy; this file owns just
 *          the stream tab state and the visible subject cards.
 * USED BY: src/app/class-12/page.tsx
 * DEPENDENCIES: react, next/link, lucide-react, Class12.module.css
 * LAST UPDATED: 2026-05-12
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Atom,
  Beaker,
  Brain,
  Briefcase,
  Calculator,
  Clock,
  Code2,
  Dna,
  Landmark,
  Languages,
  MapPin,
  Receipt,
  TrendingUp,
  Users,
} from "lucide-react";
import styles from "./Class12.module.css";

const STREAMS = [
  {
    id: "science",
    name: "Science",
    subjects: [
      { id: "physics", name: "Physics", icon: Atom, chapters: 14, progress: 30, color: "#3B82F6", bg: "#EFF6FF" },
      { id: "chemistry", name: "Chemistry", icon: Beaker, chapters: 16, progress: 20, color: "#10B981", bg: "#ECFDF5" },
      { id: "mathematics", name: "Mathematics", icon: Calculator, chapters: 13, progress: 35, color: "#8B5CF6", bg: "#F5F3FF" },
      { id: "biology", name: "Biology", icon: Dna, chapters: 13, progress: 18, color: "#F59E0B", bg: "#FFFBEB" },
      { id: "computer-science", name: "Computer Science", icon: Code2, chapters: 12, progress: 45, color: "#06B6D4", bg: "#ECFEFF" },
      { id: "english", name: "English", icon: Languages, chapters: 12, progress: 50, color: "#EF4444", bg: "#FEF2F2" },
    ],
  },
  {
    id: "commerce",
    name: "Commerce",
    subjects: [
      { id: "accountancy", name: "Accountancy", icon: Receipt, chapters: 12, progress: 25, color: "#10B981", bg: "#ECFDF5" },
      { id: "business-studies", name: "Business Studies", icon: Briefcase, chapters: 12, progress: 30, color: "#3B82F6", bg: "#EFF6FF" },
      { id: "economics", name: "Economics", icon: TrendingUp, chapters: 10, progress: 20, color: "#F59E0B", bg: "#FFFBEB" },
      { id: "mathematics", name: "Mathematics", icon: Calculator, chapters: 13, progress: 22, color: "#8B5CF6", bg: "#F5F3FF" },
      { id: "english", name: "English", icon: Languages, chapters: 12, progress: 55, color: "#EF4444", bg: "#FEF2F2" },
    ],
  },
  {
    id: "arts",
    name: "Arts / Humanities",
    subjects: [
      { id: "history", name: "History", icon: Clock, chapters: 15, progress: 10, color: "#F59E0B", bg: "#FFFBEB" },
      { id: "geography", name: "Geography", icon: MapPin, chapters: 10, progress: 15, color: "#10B981", bg: "#ECFDF5" },
      { id: "political-science", name: "Political Science", icon: Landmark, chapters: 10, progress: 20, color: "#3B82F6", bg: "#EFF6FF" },
      { id: "sociology", name: "Sociology", icon: Users, chapters: 10, progress: 8, color: "#8B5CF6", bg: "#F5F3FF" },
      { id: "psychology", name: "Psychology", icon: Brain, chapters: 10, progress: 15, color: "#EF4444", bg: "#FEF2F2" },
      { id: "english", name: "English", icon: Languages, chapters: 12, progress: 45, color: "#06B6D4", bg: "#ECFEFF" },
    ],
  },
] as const;

/** Renders the interactive stream tabs and subject cards for Class 12. */
export default function Class12StreamSelector() {
  const [activeStream, setActiveStream] = useState<(typeof STREAMS)[number]["id"]>("science");
  const currentStream = STREAMS.find((stream) => stream.id === activeStream) ?? STREAMS[0];

  return (
    <>
      <div className={styles.streamSummary}>
        <span>{currentStream.name}</span>
        <strong>{currentStream.subjects.length} subjects ready</strong>
      </div>

      <div className={styles.streamTabs}>
        {STREAMS.map((stream) => (
          <button
            key={stream.id}
            className={`${styles.streamTab} ${activeStream === stream.id ? styles.streamTabActive : ""}`}
            onClick={() => setActiveStream(stream.id)}
          >
            {stream.name}
          </button>
        ))}
      </div>

      <div className={styles.subjectGrid}>
        {currentStream.subjects.map((subject) => {
          const SubjectIcon = subject.icon;
          const completedChapters = Math.round((subject.chapters * subject.progress) / 100);

          return (
            <Link
              key={subject.id}
              href={`/class-12/${currentStream.id}/${subject.id}`}
              className={styles.subjectCard}
            >
              <div className={styles.subjectCardHeader}>
                <div className={styles.subjectIcon} style={{ background: subject.bg, color: subject.color }}>
                  <SubjectIcon size={22} />
                </div>
                <div>
                  <h3 className={styles.subjectName}>{subject.name}</h3>
                  <span className={styles.subjectMeta}>{subject.chapters} Chapters</span>
                </div>
              </div>
              <div className={styles.subjectProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{ width: `${subject.progress}%`, background: subject.color }}
                  />
                </div>
                <div className={styles.progressText}>
                  <span>{subject.progress}% Complete</span>
                  <span>{completedChapters}/{subject.chapters}</span>
                </div>
              </div>
              <div className={styles.subjectFooter}>Continue <ArrowRight size={14} /></div>
            </Link>
          );
        })}
      </div>
    </>
  );
}
