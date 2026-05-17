/**
 * FILE: Class12StreamSelector.tsx
 * LOCATION: src/app/class-12/Class12StreamSelector.tsx
 * PURPOSE: Client-only stream switcher for Class 12.
 *          Server page handles metadata and banner; this component owns only
 *          tab state and the rendered subject cards.
 *          Uses dark-compatible semi-transparent icon backgrounds.
 * USED BY: src/app/class-12/page.tsx
 * DEPENDENCIES: react, next/link, lucide-react, Class12.module.css
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
import styles from "./Class12.module.css";

/*
 * STREAMS data — Class 12 CBSE/ISC final-year subject catalog.
 * bg/border use rgba transparent colors compatible with dark #161B22 card backgrounds.
 */
const STREAMS = [
  {
    id: "science",
    name: "Science",
    desc: "Physics, Chemistry, Maths/Bio, CS — JEE Advanced, NEET UG, and board exam prep.",
    subjects: [
      {
        id: "physics",
        name: "Physics",
        desc: "Electric charges, magnetism, optics, modern physics — board + JEE formula bank.",
        icon: Atom,
        chapters: 14,
        color: "#58A6FF",
        bg: "rgba(88, 166, 255, 0.12)",
        border: "rgba(88, 166, 255, 0.2)",
      },
      {
        id: "chemistry",
        name: "Chemistry",
        desc: "Solutions, electro, organic reactions, p-block, d-block — exam-pattern coverage.",
        icon: Beaker,
        chapters: 16,
        color: "#3FB950",
        bg: "rgba(63, 185, 80, 0.12)",
        border: "rgba(63, 185, 80, 0.2)",
      },
      {
        id: "mathematics",
        name: "Mathematics",
        desc: "Relations, calculus, vectors, 3D geometry, probability — complete JEE syllabus.",
        icon: Calculator,
        chapters: 13,
        color: "#BC8CFF",
        bg: "rgba(188, 140, 255, 0.12)",
        border: "rgba(188, 140, 255, 0.2)",
      },
      {
        id: "biology",
        name: "Biology",
        desc: "Reproduction, genetics, evolution, human health, biotechnology — NEET ready.",
        icon: Dna,
        chapters: 13,
        color: "#F0883E",
        bg: "rgba(240, 136, 62, 0.12)",
        border: "rgba(240, 136, 62, 0.2)",
      },
      {
        id: "computer-science",
        name: "Computer Science",
        desc: "Python, DBMS, networking, recursion, file handling — full CBSE CS.",
        icon: Code2,
        chapters: 12,
        color: "#79C0FF",
        bg: "rgba(121, 192, 255, 0.12)",
        border: "rgba(121, 192, 255, 0.2)",
      },
      {
        id: "english",
        name: "English",
        desc: "Flamingo, Vistas — literature, writing, grammar — board exam pattern.",
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
    desc: "Accountancy, Business Studies, Economics — CA Foundation and B.Com prep.",
    subjects: [
      {
        id: "accountancy",
        name: "Accountancy",
        desc: "Partnership accounts, company accounts, cash flow — board + CA Foundation.",
        icon: Receipt,
        chapters: 12,
        color: "#3FB950",
        bg: "rgba(63, 185, 80, 0.12)",
        border: "rgba(63, 185, 80, 0.2)",
      },
      {
        id: "business-studies",
        name: "Business Studies",
        desc: "Marketing management, consumer protection, financial markets — board ready.",
        icon: Briefcase,
        chapters: 12,
        color: "#58A6FF",
        bg: "rgba(88, 166, 255, 0.12)",
        border: "rgba(88, 166, 255, 0.2)",
      },
      {
        id: "economics",
        name: "Economics",
        desc: "National income, money and banking, government budget — macro + micro.",
        icon: TrendingUp,
        chapters: 10,
        color: "#F0883E",
        bg: "rgba(240, 136, 62, 0.12)",
        border: "rgba(240, 136, 62, 0.2)",
      },
      {
        id: "mathematics",
        name: "Mathematics",
        desc: "Applied maths — LPP, probability, matrices — board pattern solutions.",
        icon: Calculator,
        chapters: 13,
        color: "#BC8CFF",
        bg: "rgba(188, 140, 255, 0.12)",
        border: "rgba(188, 140, 255, 0.2)",
      },
      {
        id: "english",
        name: "English",
        desc: "Flamingo, Vistas — literature analysis and board writing skills.",
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
    desc: "History, Geography, Polity, Sociology, Psychology — UPSC and DU entry.",
    subjects: [
      {
        id: "history",
        name: "History",
        desc: "Bricks, beads, bones — ancient to contemporary India. Board essay practice.",
        icon: Clock,
        chapters: 15,
        color: "#F0883E",
        bg: "rgba(240, 136, 62, 0.12)",
        border: "rgba(240, 136, 62, 0.2)",
      },
      {
        id: "geography",
        name: "Geography",
        desc: "Human geography, India and world — map skills and long-answer practice.",
        icon: MapPin,
        chapters: 10,
        color: "#3FB950",
        bg: "rgba(63, 185, 80, 0.12)",
        border: "rgba(63, 185, 80, 0.2)",
      },
      {
        id: "political-science",
        name: "Political Science",
        desc: "Cold War, democratic politics, Indian constitution — structured notes.",
        icon: Landmark,
        chapters: 10,
        color: "#58A6FF",
        bg: "rgba(88, 166, 255, 0.12)",
        border: "rgba(88, 166, 255, 0.2)",
      },
      {
        id: "sociology",
        name: "Sociology",
        desc: "Indian society, demographic structure, cultural diversity — UPSC foundation.",
        icon: Users,
        chapters: 10,
        color: "#BC8CFF",
        bg: "rgba(188, 140, 255, 0.12)",
        border: "rgba(188, 140, 255, 0.2)",
      },
      {
        id: "psychology",
        name: "Psychology",
        desc: "Psychological disorders, therapeutic approaches, intelligence — board paper.",
        icon: Brain,
        chapters: 10,
        color: "#F85149",
        bg: "rgba(248, 81, 73, 0.12)",
        border: "rgba(248, 81, 73, 0.2)",
      },
      {
        id: "english",
        name: "English",
        desc: "Flamingo, Vistas — in-depth literature and creative writing.",
        icon: Languages,
        chapters: 12,
        color: "#79C0FF",
        bg: "rgba(121, 192, 255, 0.12)",
        border: "rgba(121, 192, 255, 0.2)",
      },
    ],
  },
] as const;

/** Class 12 interactive stream selector — tabs + subject cards */
export default function Class12StreamSelector() {
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

      {/* Subject card grid for the active stream */}
      <div className={styles.streamGrid} role="tabpanel">
        {currentStream.subjects.map((subject) => {
          const SubjectIcon = subject.icon;
          return (
            <Link
              key={subject.id}
              href={`/class-12/${currentStream.id}/${subject.id}`}
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
