/**
 * FILE: page.tsx
 * LOCATION: src/app/events/page.tsx
 * PURPOSE: Events page — shows upcoming competitions, hackathons, and tournaments.
 * USED BY: Next.js App Router — renders at "/events"
 * LAST UPDATED: 2026-05-11
 */

import { Trophy, Calendar, MapPin, Users, Zap, Code2, BookOpen, Swords } from "lucide-react";
import styles from "./Events.module.css";

export const metadata = {
  title: "Events",
  description: "Participate in academic competitions, coding hackathons, and knowledge tournaments.",
};

const EVENTS = [
  {
    id: 1, title: "Science Olympiad 2026", desc: "Test your science knowledge across Physics, Chemistry, and Biology in this national-level competition.",
    date: "Jan 25, 2026", location: "Online", participants: 1250, status: "upcoming" as const,
    gradient: "linear-gradient(135deg, #3B82F6, #06B6D4)", icon: BookOpen,
  },
  {
    id: 2, title: "Code Sprint — DSA Challenge", desc: "Solve 10 DSA problems in 2 hours. Top performers win premium subscriptions and certificates.",
    date: "Live Now!", location: "Online", participants: 890, status: "live" as const,
    gradient: "linear-gradient(135deg, #EF4444, #F97316)", icon: Code2,
  },
  {
    id: 3, title: "Math Battle Royale", desc: "50 players, 1 winner. Quick-fire math questions with elimination rounds. Last one standing wins!",
    date: "Feb 2, 2026", location: "Online", participants: 650, status: "upcoming" as const,
    gradient: "linear-gradient(135deg, #8B5CF6, #A855F7)", icon: Swords,
  },
  {
    id: 4, title: "Inter-College Hackathon", desc: "Build a full-stack project in 24 hours. Teams of 3-4. Open to all engineering students.",
    date: "Feb 15, 2026", location: "Delhi NCR", participants: 420, status: "upcoming" as const,
    gradient: "linear-gradient(135deg, #10B981, #14B8A6)", icon: Code2,
  },
  {
    id: 5, title: "Board Exam Mock Test — Class 10", desc: "Full-length mock exam simulating actual CBSE board exam conditions. Instant detailed analysis.",
    date: "Dec 18, 2025", location: "Online", participants: 2100, status: "completed" as const,
    gradient: "linear-gradient(135deg, #6B7280, #9CA3AF)", icon: BookOpen,
  },
  {
    id: 6, title: "Python Championship", desc: "Competitive programming contest focused on Python. Beginner to advanced problems included.",
    date: "Mar 1, 2026", location: "Online", participants: 780, status: "upcoming" as const,
    gradient: "linear-gradient(135deg, #F59E0B, #D97706)", icon: Trophy,
  },
];

export default function EventsPage() {
  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h1 className={styles.title}>Events & Competitions</h1>
          <p className={styles.subtitle}>Compete, win prizes, and prove your skills in academic and coding challenges.</p>
        </div>

        <div className={styles.eventGrid}>
          {EVENTS.map((event) => {
            const statusClass = event.status === "live" ? styles.statusLive
              : event.status === "upcoming" ? styles.statusUpcoming : styles.statusCompleted;
            const statusText = event.status === "live" ? "Live Now" : event.status === "upcoming" ? "Upcoming" : "Completed";

            return (
              <div key={event.id} className={styles.eventCard}>
                <div className={styles.eventBanner} style={{ background: event.gradient }}>
                  <div className={styles.eventBannerIcon}><event.icon size={80} /></div>
                  <h2 className={styles.eventBannerTitle}>{event.title}</h2>
                </div>

                <div className={styles.eventBody}>
                  <p className={styles.eventDesc}>{event.desc}</p>

                  <div className={styles.eventMeta}>
                    <div className={styles.eventMetaItem}><Calendar size={14} /> {event.date}</div>
                    <div className={styles.eventMetaItem}><MapPin size={14} /> {event.location}</div>
                    <div className={styles.eventMetaItem}><Users size={14} /> {event.participants.toLocaleString()} Participants</div>
                    <span className={`${styles.eventStatus} ${statusClass}`}>
                      {event.status === "live" && <Zap size={12} />}
                      {statusText}
                    </span>
                  </div>

                  <button
                    className={`${styles.registerBtn} ${event.status === "completed" ? styles.registerBtnDisabled : ""}`}
                    disabled={event.status === "completed"}
                  >
                    {event.status === "live" ? "Join Now" : event.status === "upcoming" ? "Register" : "Completed"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
