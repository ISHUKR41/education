/**
 * FILE: page.tsx
 * LOCATION: src/app/class-11/page.tsx
 * PURPOSE: Class 11 landing page — features stream selector tabs (Science/Commerce/Arts)
 *          with different subjects shown per stream. Stream-based deep learning.
 * USED BY: Next.js App Router — renders at "/class-11"
 * LAST UPDATED: 2026-05-11
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap, Atom, Calculator, Languages, ArrowRight,
  Beaker, Dna, Code2, Receipt, Briefcase, TrendingUp,
  Clock, MapPin, Landmark, Users, Brain
} from "lucide-react";
import styles from "@/styles/ClassPage.module.css";

/** Streams and their subjects for Class 11 */
const STREAMS = [
  {
    id: "science", name: "Science",
    subjects: [
      { id: "physics", name: "Physics", icon: Atom, chapters: 15, progress: 20, color: "#3B82F6", bg: "#EFF6FF" },
      { id: "chemistry", name: "Chemistry", icon: Beaker, chapters: 14, progress: 15, color: "#10B981", bg: "#ECFDF5" },
      { id: "mathematics", name: "Mathematics", icon: Calculator, chapters: 16, progress: 25, color: "#8B5CF6", bg: "#F5F3FF" },
      { id: "biology", name: "Biology", icon: Dna, chapters: 14, progress: 10, color: "#F59E0B", bg: "#FFFBEB" },
      { id: "computer-science", name: "Computer Science", icon: Code2, chapters: 10, progress: 35, color: "#06B6D4", bg: "#ECFEFF" },
      { id: "english", name: "English", icon: Languages, chapters: 12, progress: 40, color: "#EF4444", bg: "#FEF2F2" },
    ],
  },
  {
    id: "commerce", name: "Commerce",
    subjects: [
      { id: "accountancy", name: "Accountancy", icon: Receipt, chapters: 12, progress: 30, color: "#10B981", bg: "#ECFDF5" },
      { id: "business-studies", name: "Business Studies", icon: Briefcase, chapters: 12, progress: 20, color: "#3B82F6", bg: "#EFF6FF" },
      { id: "economics", name: "Economics", icon: TrendingUp, chapters: 10, progress: 25, color: "#F59E0B", bg: "#FFFBEB" },
      { id: "mathematics", name: "Mathematics", icon: Calculator, chapters: 16, progress: 15, color: "#8B5CF6", bg: "#F5F3FF" },
      { id: "english", name: "English", icon: Languages, chapters: 12, progress: 45, color: "#EF4444", bg: "#FEF2F2" },
    ],
  },
  {
    id: "arts", name: "Arts / Humanities",
    subjects: [
      { id: "history", name: "History", icon: Clock, chapters: 11, progress: 10, color: "#F59E0B", bg: "#FFFBEB" },
      { id: "geography", name: "Geography", icon: MapPin, chapters: 10, progress: 20, color: "#10B981", bg: "#ECFDF5" },
      { id: "political-science", name: "Political Science", icon: Landmark, chapters: 10, progress: 15, color: "#3B82F6", bg: "#EFF6FF" },
      { id: "sociology", name: "Sociology", icon: Users, chapters: 10, progress: 5, color: "#8B5CF6", bg: "#F5F3FF" },
      { id: "psychology", name: "Psychology", icon: Brain, chapters: 10, progress: 12, color: "#EF4444", bg: "#FEF2F2" },
      { id: "english", name: "English", icon: Languages, chapters: 12, progress: 40, color: "#06B6D4", bg: "#ECFEFF" },
    ],
  },
];

export default function Class11Page() {
  /** Track which stream tab is currently selected */
  const [activeStream, setActiveStream] = useState("science");

  /** Get the subjects for the currently selected stream */
  const currentStream = STREAMS.find((s) => s.id === activeStream) || STREAMS[0];

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        {/* Banner */}
        <div className={styles.classBanner} style={{ background: "linear-gradient(135deg, #10B981, #14B8A6)" }}>
          <div className={styles.bannerContent}>
            <div className={styles.bannerLabel}><GraduationCap size={14} /> Stream Selection</div>
            <h1 className={styles.bannerTitle}>Class 11</h1>
            <p className={styles.bannerSubtitle}>
              Deep learning in your chosen stream — Science, Commerce, or Arts.
            </p>
            <div className={styles.bannerStats}>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>3</span>
                <span className={styles.bannerStatLabel}>Streams</span>
              </div>
              <div className={styles.bannerStat}>
                <span className={styles.bannerStatValue}>{currentStream.subjects.length}</span>
                <span className={styles.bannerStatLabel}>Subjects</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stream Tabs */}
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

        {/* Subject Cards */}
        <div className={styles.subjectGrid}>
          {currentStream.subjects.map((s) => (
            <Link key={s.id} href={`/class-11/${currentStream.id}/${s.id}`} className={styles.subjectCard}>
              <div className={styles.subjectCardHeader}>
                <div className={styles.subjectIcon} style={{ background: s.bg, color: s.color }}><s.icon size={22} /></div>
                <div>
                  <h3 className={styles.subjectName}>{s.name}</h3>
                  <span className={styles.subjectMeta}>{s.chapters} Chapters</span>
                </div>
              </div>
              <div className={styles.subjectProgress}>
                <div className={styles.progressBar}>
                  <div className={styles.progressFill} style={{ width: `${s.progress}%`, background: s.color }} />
                </div>
                <div className={styles.progressText}>
                  <span>{s.progress}% Complete</span>
                  <span>{Math.round(s.chapters * s.progress / 100)}/{s.chapters}</span>
                </div>
              </div>
              <div className={styles.subjectFooter}>Continue <ArrowRight size={14} /></div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
