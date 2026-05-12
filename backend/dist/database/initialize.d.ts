/**
 * FILE: initialize.ts
 * LOCATION: backend/src/database/initialize.ts
 * PURPOSE: Database initialization module using sql.js (pure-JS SQLite).
 *          Creates all tables required by the EduQuest platform.
 *          Tables cover: users, profiles, classes, subjects, chapters, topics,
 *          questions, tests, points, levels, streaks, badges, community, events,
 *          progress, battles. Also seeds initial data.
 * USED BY: server.ts — called once during server startup
 * DEPENDENCIES: sql.js, fs, path
 * LAST UPDATED: 2026-05-12
 */
import { Database as SqlJsDatabase, type SqlValue } from "sql.js";
type DatabaseRow = Record<string, SqlValue | undefined>;
interface PreparedStatementHelper {
    run: (...params: unknown[]) => void;
    get: (...params: unknown[]) => DatabaseRow | undefined;
    all: (...params: unknown[]) => DatabaseRow[];
}
/**
 * getDb() — Returns the database instance.
 * Throws if called before initialization.
 */
export declare function getDb(): SqlJsDatabase;
/**
 * DbHelper — Wraps sql.js with a better-sqlite3-like API.
 * sql.js has a different interface; this helper provides prepare/run/get/all methods
 * so our route files can use a clean, synchronous-looking API.
 */
export declare const dbHelper: {
    /** Run a SQL statement (INSERT, UPDATE, DELETE) */
    run(sql: string, ...params: unknown[]): void;
    /** Get a single row from a query */
    get(sql: string, ...params: unknown[]): DatabaseRow | undefined;
    /** Get all rows from a query */
    all(sql: string, ...params: unknown[]): DatabaseRow[];
    /** Execute raw SQL (for CREATE TABLE, etc.) */
    exec(sql: string): void;
    /** Prepare a statement (returns an object with run/get/all methods) */
    prepare(sql: string): PreparedStatementHelper;
    /** Save the database to disk */
    save(): void;
};
export declare function initializeDatabase(): Promise<void>;
export {};
//# sourceMappingURL=initialize.d.ts.map