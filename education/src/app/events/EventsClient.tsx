/**
 * FILE: EventsClient.tsx
 * LOCATION: src/app/events/EventsClient.tsx
 * PURPOSE: Interactive Events page UI. It loads the backend-backed event catalog,
 *          shows real registration state for signed-in students, and persists new
 *          registrations through the protected events API.
 * USED BY: src/app/events/page.tsx
 * DEPENDENCIES: next/image, next/link, lucide-react, Events.module.css
 * LAST UPDATED: 2026-05-12
 */

"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  AlertCircle,
  BookOpen,
  Calendar,
  CheckCircle2,
  Code2,
  Loader2,
  MapPin,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import styles from "./Events.module.css";

interface SerializableEvent {
  id: string;
  title: string;
  desc: string;
  date: string;
  location: string;
  participants: number;
  status: "live" | "upcoming" | "completed";
  gradient: string;
}

interface EventsApiResponse {
  ok: boolean;
  data?: {
    events: SerializableEvent[];
    registeredEventIds: string[];
  };
  error?: { message: string };
}

interface RegistrationApiResponse {
  ok: boolean;
  data?: {
    registration: {
      id: string;
      eventId: string;
      userId: string;
      createdAt: string;
    };
  };
  error?: { message: string };
}

const EVENT_ICONS = {
  "science-olympiad-2026": BookOpen,
  "code-sprint-dsa": Code2,
  "math-battle-royale": Swords,
  "inter-college-hackathon": Code2,
  "class-10-board-mock": BookOpen,
  "python-championship": Trophy,
} as const;

type NoticeTone = "success" | "error" | "info";

/** Converts backend event status into the UI label used on each event card. */
function getStatusText(status: SerializableEvent["status"]): string {
  if (status === "live") {
    return "Live Now";
  }

  if (status === "upcoming") {
    return "Upcoming";
  }

  return "Completed";
}

/** Renders the backend-connected events catalog and protected registration flow. */
export default function EventsClient() {
  const [events, setEvents] = useState<SerializableEvent[]>([]);
  const [registeredEventIds, setRegisteredEventIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [busyEventId, setBusyEventId] = useState("");
  const [notice, setNotice] = useState("");
  const [noticeTone, setNoticeTone] = useState<NoticeTone>("info");

  useEffect(() => {
    let isMounted = true;

    async function loadEvents() {
      setIsLoading(true);
      setNotice("");

      try {
        /*
         * API call: GET /api/events
         * Why: keeps the event cards and registration state synchronized with
         * backend rules instead of duplicating those rules in the UI.
         */
        const response = await fetch("/api/events", { cache: "no-store" });
        const payload = (await response.json()) as EventsApiResponse;

        if (!isMounted) {
          return;
        }

        if (!response.ok || !payload.ok || !payload.data) {
          setNotice(payload.error?.message ?? "Unable to load events right now.");
          setNoticeTone("error");
          return;
        }

        setEvents(payload.data.events);
        setRegisteredEventIds(payload.data.registeredEventIds);
      } catch {
        if (isMounted) {
          setNotice("Network error while loading events.");
          setNoticeTone("error");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadEvents();

    return () => {
      isMounted = false;
    };
  }, []);

  /** Registers the signed-in student for a live or upcoming event. */
  const handleRegister = async (eventId: string) => {
    setBusyEventId(eventId);
    setNotice("");

    try {
      /*
       * API call: POST /api/events/register
       * Why: registration must be validated by the backend so completed events
       * cannot be joined and duplicate registrations stay idempotent.
       */
      const response = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId }),
      });
      const payload = (await response.json()) as RegistrationApiResponse;

      if (response.status === 401) {
        setNotice("Please sign in before registering for an event.");
        setNoticeTone("error");
        return;
      }

      if (!response.ok || !payload.ok || !payload.data?.registration) {
        setNotice(payload.error?.message ?? "Unable to save your registration.");
        setNoticeTone("error");
        return;
      }

      setRegisteredEventIds((current) =>
        current.includes(eventId) ? current : [...current, eventId],
      );
      setNotice("Registration saved. You are on the event list.");
      setNoticeTone("success");
    } catch {
      setNotice("Network error while saving your registration.");
      setNoticeTone("error");
    } finally {
      setBusyEventId("");
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <Image
            src="/images/community-events-hero.png"
            alt="Students collaborating around academic events and competitions"
            fill
            priority
            className={styles.headerMedia}
            sizes="(max-width: 1280px) 100vw, 1280px"
          />
          <div className={styles.headerOverlay} aria-hidden="true" />
          <div className={styles.headerContent}>
            <h1 className={styles.title}>Events & Competitions</h1>
            <p className={styles.subtitle}>
              Compete, register cleanly, and follow only events the backend still marks as available.
            </p>
          </div>
        </div>

        {notice && (
          <div
            className={`${styles.notice} ${
              noticeTone === "success"
                ? styles.noticeSuccess
                : noticeTone === "error"
                  ? styles.noticeError
                  : styles.noticeInfo
            }`}
            role={noticeTone === "error" ? "alert" : "status"}
          >
            {noticeTone === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
            <span>{notice}</span>
            {noticeTone === "error" && <Link href="/sign-in">Sign In</Link>}
          </div>
        )}

        {isLoading ? (
          <div className={styles.loadingPanel} aria-busy="true" aria-live="polite">
            <Loader2 size={18} className={styles.spinner} />
            Loading live event data...
          </div>
        ) : (
          <div className={styles.eventGrid}>
            {events.map((event) => {
              const Icon = EVENT_ICONS[event.id as keyof typeof EVENT_ICONS] ?? Trophy;
              const statusClass =
                event.status === "live"
                  ? styles.statusLive
                  : event.status === "upcoming"
                    ? styles.statusUpcoming
                    : styles.statusCompleted;
              const isRegistered = registeredEventIds.includes(event.id);
              const isCompleted = event.status === "completed";
              const isBusy = busyEventId === event.id;

              return (
                <article key={event.id} className={styles.eventCard}>
                  <div className={styles.eventBanner} style={{ background: event.gradient }}>
                    <div className={styles.eventBannerIcon}><Icon size={80} /></div>
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
                        {getStatusText(event.status)}
                      </span>
                    </div>

                    <button
                      className={`${styles.registerBtn} ${
                        isCompleted ? styles.registerBtnDisabled : ""
                      } ${isRegistered ? styles.registerBtnSuccess : ""}`}
                      disabled={isCompleted || isRegistered || isBusy}
                      onClick={() => handleRegister(event.id)}
                      type="button"
                    >
                      {isBusy ? (
                        <>
                          <Loader2 size={16} className={styles.spinner} />
                          Saving...
                        </>
                      ) : isRegistered ? (
                        <>
                          <CheckCircle2 size={16} />
                          Registered
                        </>
                      ) : isCompleted ? (
                        "Completed"
                      ) : event.status === "live" ? (
                        "Join Live Event"
                      ) : (
                        "Register"
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
