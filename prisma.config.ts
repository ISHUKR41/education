/*
 * FILE: prisma.config.ts
 * PURPOSE: Prisma configuration — points to the PostgreSQL database.
 *          Uses DATABASE_URL environment variable for flexibility across
 *          development, staging, and production environments.
 *          The env var is always set by Replit's database integration.
 * LAST UPDATED: 2026-05-16
 */

import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    /*
     * DATABASE_URL is injected by Replit's PostgreSQL integration.
     * For local dev without Replit, create a .env file with:
     *   DATABASE_URL=postgresql://user:pass@localhost:5432/eduquest
     */
    url: process.env.DATABASE_URL ?? "postgresql://postgres:password@localhost:5432/eduquest",
  },
});
