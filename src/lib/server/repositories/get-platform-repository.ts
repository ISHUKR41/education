/**
 * FILE: get-platform-repository.ts
 * LOCATION: src/lib/server/repositories/get-platform-repository.ts
 * PURPOSE: Single backend storage entry point. Services call this getter so the
 *          concrete adapter can later change from JSON to PostgreSQL without
 *          route-level or service-level rewrites.
 * USED BY: Backend services and current-user lookup
 * LAST UPDATED: 2026-05-12
 */

import { jsonPlatformRepository } from "@/lib/server/repositories/json-platform-repository";
import { postgresPlatformRepository } from "@/lib/server/repositories/postgres-platform-repository";
import type { PlatformRepository } from "@/lib/server/repositories/platform-repository";

export type PersistenceAdapterName = "json-file-mvp" | "postgresql";

/**
 * Resolves which persistence adapter this runtime should use.
 * Production can explicitly opt into PostgreSQL with EDUQUEST_PERSISTENCE_ADAPTER.
 * Local development keeps the JSON adapter by default so the app remains easy
 * to run even when PostgreSQL is not installed on the developer machine.
 */
export function getPersistenceAdapterName(): PersistenceAdapterName {
  if (process.env.EDUQUEST_PERSISTENCE_ADAPTER === "postgres") {
    return "postgresql";
  }

  return "json-file-mvp";
}

/** Returns the active repository adapter for the current deployment. */
export function getPlatformRepository(): PlatformRepository {
  if (getPersistenceAdapterName() === "postgresql") {
    return postgresPlatformRepository;
  }

  return jsonPlatformRepository;
}
