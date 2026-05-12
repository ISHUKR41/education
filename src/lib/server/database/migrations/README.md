# Database Migrations

This folder stores PostgreSQL migration files for EduQuest.

## Naming Rule

Use numeric prefixes so migrations run in the same order everywhere:

`001_initial_platform.sql`

## How To Run

Set `DATABASE_URL`, then run:

```bash
npm run db:migrate
```

## Safety Rule

Migrations should be additive whenever possible. Avoid destructive schema changes without a backup and a rollback plan because production student progress, registrations, and community posts are valuable data.
