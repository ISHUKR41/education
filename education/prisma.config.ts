// This file configures Prisma 7 — database connection, schema path, migrations.
// Prisma 7 requires datasource URL in this config file, NOT in schema.prisma.
// The DATABASE_URL env variable is set by Replit's built-in PostgreSQL provisioning.
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use the Replit-provisioned PostgreSQL URL (set automatically as DATABASE_URL).
    // Falls back to the legacy local dev URL only if DATABASE_URL is not set.
    url: process.env.DATABASE_URL ?? "postgresql://postgres:password@localhost:5432/eduquest",
  },
});
