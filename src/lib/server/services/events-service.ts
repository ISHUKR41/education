/**
 * FILE: events-service.ts
 * LOCATION: src/lib/server/services/events-service.ts
 * PURPOSE: Backend events orchestration. It builds the user-aware event catalog
 *          snapshot and owns event registration writes behind one service layer.
 * USED BY: Events API route handlers
 * DEPENDENCIES: event catalog, platform store, validation input types
 * LAST UPDATED: 2026-05-12
 */

import { canRegisterForEvent, getSerializableEvents } from "@/lib/events/event-catalog";
import { getPlatformRepository } from "@/lib/server/repositories/get-platform-repository";
import type { EventRegistrationInput } from "@/lib/validation/auth";

export interface EventCatalogSnapshot {
  events: ReturnType<typeof getSerializableEvents>;
  registeredEventIds: string[];
}

/** Builds the public event list plus signed-in user registration state. */
export async function buildEventCatalogSnapshot(userId?: string): Promise<EventCatalogSnapshot> {
  const repository = getPlatformRepository();

  return {
    events: getSerializableEvents(),
    registeredEventIds: userId ? await repository.events.listRegisteredEventIds(userId) : [],
  };
}

/** Saves one event registration only when the backend still marks it registerable. */
export async function registerStudentForEvent(
  userId: string,
  input: EventRegistrationInput,
) {
  if (!canRegisterForEvent(input.eventId)) {
    throw new Error("EVENT_NOT_AVAILABLE");
  }

  return getPlatformRepository().events.register(input.eventId, userId);
}
