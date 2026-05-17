/**
 * FILE: Class11StreamSelector.tsx
 * LOCATION: src/app/class-11/Class11StreamSelector.tsx
 * PURPOSE: Client-only stream switcher for Class 11.
 *          Server page (page.tsx) handles metadata and banner; this component
 *          owns only tab state and the visible subject card grid.
 *          Uses dark-compatible semi-transparent icon backgrounds that work on
 *          the dark card surface (#161B22) without flashing light colors.
 * USED BY: src/app/class-11/page.tsx
 * DEPENDENCIES: react, next/link, lucide-react, Class11.module.css
 * LAST UPDATED: 2026-05-17
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
import styles from "./Class11.module.css";

/*
 * STREAMS data — Class 11 CBSE/ISC subject catalog.
 * Each subject uses dark-compatible transparent backgrounds (bg) and borders.
 * color = accent / icon color, bg = icon container fill (rgba transparent).
 */
const STREAMS = [
  {
    id: "science",
    name: "Science",
    desc: "Physics, Chemistry, Maths/Bio, CS — JEE and NEET foundation.",
    subjects: [
      {
        id: "physics",
        name: "Physics",
        desc: "Mechanics, thermodynamics, optics, electricity — formula-first approach.",
        icon: Atom,
        chapters: 15,
        color: "#58A6FF",
        bg: "rgba(88, 166, 255, 0.12)",
        border: "rgba(88, 166, 255, 0.2)",
      },
      {
        id: "chemistry",
        name: "Chemistry",
        desc: "Physical, organic, and inorganic — reactions, equations, periodic trends.",
        icon: Beaker,
        chapters: 14,
        color: "#3FB950",
        bg: "rgba(63, 185, 80, 0.12)",
        border: "rgba(63, 185, 80, 0.2)",
      },
      {
        id: "mathematics",
        name: "Mathematics",
        desc: "Calculus, algebra, trigonometry, vectors — deep problem solving.",
        icon: Calculator,
        chapters: 16,
        color: "#BC8CFF",
        bg: "rgba(188, 140, 255, 0.12)",
        border: "rgba(188, 140, 255, 0.2)",
      },
      {
        id: "biology",
        name: "Biology",
        desc: "Cell biology, genetics, human physiology, ecology — NEET prep.",
        icon: Dna,
        chapters: 14,
        color: "#F0883E",
        bg: "rgba(240, 136, 62, 0.12)",
        border: "rgba(240, 136, 62, 0.2)",
      },
      {
        id: "computer-science",
        name: "Computer Science",
        desc: "Python, data structures, SQL, networks — CBSE CS full syllabus.",
        icon: Code2,
        chapters: 10,
        color: "#79C0FF",
        bg: "rgba(121, 192, 255, 0.12)",
        border: "rgba(121, 192, 255, 0.2)",
      },
      {
        id: "english",
        name: "English",
        desc: "Hornbill, Snapshots — literature, grammar, and writing skills.",
        icon: Languages,
        chapters: 12,
        color: "#F85149",
        bg: "rgba(248, 81, 73, 0.12)",
        border: "rgba(248, 81, 73, 0.2)",
      },
    ],
  },
  {
    id: "commerce",
    name: "Commerce",
    desc: "Accountancy, Business Studies, Economics, Maths — CA/MBA foundation.",
    subjects: [
      {
        id: "accountancy",
        name: "Accountancy",
        desc: "Journal entries, ledgers, trial balance, final accounts — CBSE board prep.",
        icon: Receipt,
        chapters: 12,
        color: "#3FB950",
        bg: "rgba(63, 185, 80, 0.12)",
        border: "rgba(63, 185, 80, 0.2)",
      },
      {
        id: "business-studies",
        name: "Business Studies",
        desc: "Nature of business, management, organizing, controlling — long-answer focused.",
        icon: Briefcase,
        chapters: 12,
        color: "#58A6FF",
        bg: "rgba(88, 166, 255, 0.12)",
        border: "rgba(88, 166, 255, 0.2)",
      },
      {
        id: "economics",
        name: "Economics",
        desc: "Micro and macro economics — demand, supply, national income, money.",
        icon: TrendingUp,
        chapters: 10,
        color: "#F0883E",
        bg: "rgba(240, 136, 62, 0.12)",
        border: "rgba(240, 136, 62, 0.2)",
      },
      {
        id: "mathematics",
        name: "Mathematics",
        desc: "Applied maths for commerce — matrices, linear programming, statistics.",
        icon: Calculator,
        chapters: 16,
        color: "#BC8CFF",
        bg: "rgba(188, 140, 255, 0.12)",
        border: "rgba(188, 140, 255, 0.2)",
      },
      {
        id: "english",
        name: "English",
        desc: "Hornbill, Snapshots — literature comprehension and advanced writing.",
        icon: Languages,
        chapters: 12,
        color: "#F85149",
        bg: "rgba(248, 81, 73, 0.12)",
        border: "rgba(248, 81, 73, 0.2)",
      },
    ],
  },
  {
    id: "arts",
    name: "Arts / Humanities",
    desc: "History, Geography, Polity, Sociology, Psychology — UPSC and university prep.",
    subjects: [
      {
        id: "history",
        name: "History",
        desc: "Ancient, medieval, and modern India — source-based and essay questions.",
        icon: Clock,
        chapters: 11,
        color: "#F0883E",
        bg: "rgba(240, 136, 62, 0.12)",
        border: "rgba(240, 136, 62, 0.2)",
      },
      {
        id: "geography",
        name: "Geography",
        desc: "Physical geography, India's geography, map marking — CBSE board ready.",
        icon: MapPin,
        chapters: 10,
        color: "#3FB950",
        bg: "rgba(63, 185, 80, 0.12)",
        border: "rgba(63, 185, 80, 0.2)",
      },
      {
        id: "political-science",
        name: "Political Science",
        desc: "Indian constitution, governance, international relations — long answers.",
        icon: Landmark,
        chapters: 10,
        color: "#58A6FF",
        bg: "rgba(88, 166, 255, 0.12)",
        border: "rgba(88, 166, 255, 0.2)",
      },
      {
        id: "sociology",
        name: "Sociology",
        desc: "Indian society, social institutions, change and development.",
        icon: Users,
        chapters: 10,
        color: "#BC8CFF",
        bg: "rgba(188, 140, 255, 0.12)",
        border: "rgba(188, 140, 255, 0.2)",
      },
      {
        id: "psychology",
        name: "Psychology",
        desc: "Human development, motivation, cognition, perception — theory + application.",
        icon: Brain,
        chapters: 10,
        color: "#F85149",
        bg: "rgba(248, 81, 73, 0.12)",
        border: "rgba(248, 81, 73, 0.2)",
      },
      {
        id: "english",
        name: "English",
        desc: "Hornbill, Snapshots — literature, grammar, creative writing.",
        icon: Languages,
        chapters: 12,
        color: "#79C0FF",
        bg: "rgba(121, 192, 255, 0.12)",
        border: "rgba(121, 192, 255, 0.2)",
      },
    ],
  },
] as const;

/** Class 11 interactive stream selector — tabs + subject cards */
export default function Class11StreamSelector() {
  const [activeStream, setActiveStream] = useState<(typeof STREAMS)[number]["id"]>("science");
  const currentStream = STREAMS.find((s) => s.id === activeStream) ?? STREAMS[0];

  return (
    <div className={styles.streamSection}>
      {/* Stream tab bar */}
      <div className={styles.streamTabs} role="tablist">
        {STREAMS.map((stream) => (
          <button
            key={stream.id}
            role="tab"
            aria-selected={activeStream === stream.id}
            className={`${styles.streamTab} ${activeStream === stream.id ? styles.streamTabActive : ""}`}
            onClick={() => setActiveStream(stream.id)}
          >
            {stream.name}
          </button>
        ))}
      </div>

      {/* Subject cards grid for the active stream */}
      <div className={styles.streamGrid} role="tabpanel">
        {currentStream.subjects.map((subject) => {
          const SubjectIcon = subject.icon;
          return (
            <Link
              key={subject.id}
              href={`/class-11/${currentStream.id}/${subject.id}`}
              className={styles.subjectCard}
            >
              {/* Thin colored left accent bar */}
              <div
                className={styles.cardAccent}
                style={{ background: subject.color }}
                aria-hidden="true"
              />

              {/* Icon + name row */}
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

              {/* Short description */}
              <p className={styles.subjectDesc}>{subject.desc}</p>

              {/* Explore arrow */}
              <div className={styles.cardFooter}>
                <span className={styles.cardArrow} style={{ color: subject.color }}>
                  Explore <ArrowRight size={13} />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
