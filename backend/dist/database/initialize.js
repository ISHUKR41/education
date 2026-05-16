"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbHelper = void 0;
exports.getDb = getDb;
exports.initializeDatabase = initializeDatabase;
const sql_js_1 = __importDefault(require("sql.js"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// ============================================================
// SECTION 1: Database Connection
// ============================================================
const DB_DIR = path_1.default.join(__dirname, "../../data");
const DB_PATH = path_1.default.join(DB_DIR, "eduquest.db");
/** Ensure the data directory exists */
if (!fs_1.default.existsSync(DB_DIR)) {
    fs_1.default.mkdirSync(DB_DIR, { recursive: true });
}
/**
 * db — The global database instance.
 * Initialized asynchronously in initializeDatabase().
 * All route files import this to run queries.
 */
let db;
/** Converts loose Express route values into SQLite-safe primitive values. */
function toSqlValue(value) {
    if (value === null || value === undefined) {
        return null;
    }
    if (typeof value === "string" || typeof value === "number" || value instanceof Uint8Array) {
        return value;
    }
    if (Array.isArray(value)) {
        return toSqlValue(value[0]);
    }
    return String(value);
}
/** Converts a route parameter list into the bind format expected by sql.js. */
function toBindParams(params) {
    return params.map(toSqlValue);
}
/**
 * getDb() — Returns the database instance.
 * Throws if called before initialization.
 */
function getDb() {
    if (!db)
        throw new Error("Database not initialized. Call initializeDatabase() first.");
    return db;
}
/**
 * DbHelper — Wraps sql.js with a better-sqlite3-like API.
 * sql.js has a different interface; this helper provides prepare/run/get/all methods
 * so our route files can use a clean, synchronous-looking API.
 */
exports.dbHelper = {
    /** Run a SQL statement (INSERT, UPDATE, DELETE) */
    run(sql, ...params) {
        db.run(sql, toBindParams(params));
    },
    /** Get a single row from a query */
    get(sql, ...params) {
        const stmt = db.prepare(sql);
        stmt.bind(toBindParams(params));
        if (stmt.step()) {
            const cols = stmt.getColumnNames();
            const vals = stmt.get();
            stmt.free();
            const row = {};
            cols.forEach((col, i) => { row[col] = vals[i]; });
            return row;
        }
        stmt.free();
        return undefined;
    },
    /** Get all rows from a query */
    all(sql, ...params) {
        const stmt = db.prepare(sql);
        stmt.bind(toBindParams(params));
        const rows = [];
        while (stmt.step()) {
            const cols = stmt.getColumnNames();
            const vals = stmt.get();
            const row = {};
            cols.forEach((col, i) => { row[col] = vals[i]; });
            rows.push(row);
        }
        stmt.free();
        return rows;
    },
    /** Execute raw SQL (for CREATE TABLE, etc.) */
    exec(sql) {
        db.exec(sql);
    },
    /** Prepare a statement (returns an object with run/get/all methods) */
    prepare(sql) {
        return {
            run: (...params) => { db.run(sql, toBindParams(params)); },
            get: (...params) => exports.dbHelper.get(sql, ...params),
            all: (...params) => exports.dbHelper.all(sql, ...params),
        };
    },
    /** Save the database to disk */
    save() {
        const data = db.export();
        const buffer = Buffer.from(data);
        fs_1.default.writeFileSync(DB_PATH, buffer);
    },
};
// ============================================================
// SECTION 2: Initialization
// ============================================================
async function initializeDatabase() {
    const SQL = await (0, sql_js_1.default)();
    // Load existing database or create new one
    if (fs_1.default.existsSync(DB_PATH)) {
        const fileBuffer = fs_1.default.readFileSync(DB_PATH);
        db = new SQL.Database(fileBuffer);
    }
    else {
        db = new SQL.Database();
    }
    // Enable foreign keys
    db.run("PRAGMA foreign_keys = ON;");
    // Create all tables
    createTables();
    // Seed initial data
    seedInitialData();
    // Save to disk
    exports.dbHelper.save();
    // Auto-save every 30 seconds to prevent data loss
    setInterval(() => { exports.dbHelper.save(); }, 30000);
}
// ============================================================
// SECTION 3: Table Creation
// ============================================================
function createTables() {
    db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      display_name TEXT NOT NULL,
      avatar_url TEXT DEFAULT NULL,
      role TEXT NOT NULL DEFAULT 'student',
      is_verified INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      last_login_at TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS classes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      description TEXT DEFAULT NULL,
      icon TEXT DEFAULT NULL,
      gradient_start TEXT DEFAULT '#4F46E5',
      gradient_end TEXT DEFAULT '#06B6D4',
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS student_profiles (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
      class_id TEXT REFERENCES classes(id),
      stream TEXT DEFAULT NULL,
      board TEXT DEFAULT 'CBSE',
      target_exams TEXT DEFAULT NULL,
      skill_level TEXT DEFAULT 'beginner',
      language_preference TEXT DEFAULT 'english',
      phone TEXT DEFAULT NULL,
      parent_phone TEXT DEFAULT NULL,
      institution TEXT DEFAULT NULL,
      total_points INTEGER NOT NULL DEFAULT 0,
      current_level INTEGER NOT NULL DEFAULT 1,
      current_streak INTEGER NOT NULL DEFAULT 0,
      longest_streak INTEGER NOT NULL DEFAULT 0,
      xp_multiplier REAL NOT NULL DEFAULT 1.0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS subjects (
      id TEXT PRIMARY KEY,
      class_id TEXT NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      description TEXT DEFAULT NULL,
      icon TEXT DEFAULT NULL,
      color TEXT DEFAULT '#4F46E5',
      chapter_count INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id TEXT PRIMARY KEY,
      subject_id TEXT NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      description TEXT DEFAULT NULL,
      topic_count INTEGER NOT NULL DEFAULT 0,
      difficulty TEXT DEFAULT 'medium',
      estimated_hours REAL DEFAULT 2.0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS topics (
      id TEXT PRIMARY KEY,
      chapter_id TEXT NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      display_name TEXT NOT NULL,
      theory_content TEXT DEFAULT NULL,
      video_url TEXT DEFAULT NULL,
      youtube_link TEXT DEFAULT NULL,
      difficulty TEXT DEFAULT 'medium',
      points_reward INTEGER NOT NULL DEFAULT 10,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS questions (
      id TEXT PRIMARY KEY,
      topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      question_text TEXT NOT NULL,
      options TEXT DEFAULT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT DEFAULT NULL,
      hint TEXT DEFAULT NULL,
      youtube_link TEXT DEFAULT NULL,
      difficulty TEXT DEFAULT 'medium',
      points INTEGER NOT NULL DEFAULT 5,
      time_limit_seconds INTEGER DEFAULT 60,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tests (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT NULL,
      type TEXT NOT NULL,
      class_id TEXT REFERENCES classes(id),
      subject_id TEXT REFERENCES subjects(id),
      chapter_id TEXT REFERENCES chapters(id),
      total_questions INTEGER NOT NULL DEFAULT 10,
      time_limit_minutes INTEGER DEFAULT 30,
      passing_score INTEGER DEFAULT 60,
      max_attempts INTEGER DEFAULT 3,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS test_attempts (
      id TEXT PRIMARY KEY,
      test_id TEXT NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      score INTEGER NOT NULL DEFAULT 0,
      total_questions INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL DEFAULT 0,
      wrong_answers INTEGER NOT NULL DEFAULT 0,
      skipped INTEGER NOT NULL DEFAULT 0,
      time_taken_seconds INTEGER DEFAULT 0,
      points_earned INTEGER NOT NULL DEFAULT 0,
      status TEXT DEFAULT 'completed',
      started_at TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS points_transactions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      amount INTEGER NOT NULL,
      type TEXT NOT NULL,
      source TEXT NOT NULL,
      description TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS streaks (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date TEXT NOT NULL,
      points_earned INTEGER NOT NULL DEFAULT 0,
      activity_type TEXT DEFAULT 'learning',
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, date)
    );

    CREATE TABLE IF NOT EXISTS badges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL UNIQUE,
      display_name TEXT NOT NULL,
      description TEXT NOT NULL,
      icon TEXT DEFAULT 'award',
      color TEXT DEFAULT '#F59E0B',
      requirement_type TEXT NOT NULL,
      requirement_value INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS user_badges (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      badge_id TEXT NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
      earned_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, badge_id)
    );

    CREATE TABLE IF NOT EXISTS community_posts (
      id TEXT PRIMARY KEY,
      author_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      category TEXT NOT NULL DEFAULT 'general',
      class_id TEXT REFERENCES classes(id),
      subject_id TEXT REFERENCES subjects(id),
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      upvotes INTEGER NOT NULL DEFAULT 0,
      reply_count INTEGER NOT NULL DEFAULT 0,
      is_solved INTEGER NOT NULL DEFAULT 0,
      is_pinned INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS community_replies (
      id TEXT PRIMARY KEY,
      post_id TEXT NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      content TEXT NOT NULL,
      upvotes INTEGER NOT NULL DEFAULT 0,
      is_accepted INTEGER NOT NULL DEFAULT 0,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS events (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT DEFAULT NULL,
      type TEXT NOT NULL,
      organizer_id TEXT REFERENCES users(id),
      institution TEXT DEFAULT NULL,
      start_date TEXT NOT NULL,
      end_date TEXT NOT NULL,
      registration_deadline TEXT DEFAULT NULL,
      max_participants INTEGER DEFAULT NULL,
      current_participants INTEGER NOT NULL DEFAULT 0,
      prize_details TEXT DEFAULT NULL,
      rules TEXT DEFAULT NULL,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS event_registrations (
      id TEXT PRIMARY KEY,
      event_id TEXT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'registered',
      registered_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(event_id, user_id)
    );

    CREATE TABLE IF NOT EXISTS progress (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      topic_id TEXT NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
      status TEXT DEFAULT 'not_started',
      percent_complete INTEGER NOT NULL DEFAULT 0,
      time_spent_seconds INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, topic_id)
    );

    CREATE TABLE IF NOT EXISTS battles (
      id TEXT PRIMARY KEY,
      creator_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      opponent_id TEXT REFERENCES users(id),
      subject_id TEXT REFERENCES subjects(id),
      difficulty TEXT DEFAULT 'medium',
      type TEXT DEFAULT '1v1',
      status TEXT DEFAULT 'waiting',
      creator_score INTEGER NOT NULL DEFAULT 0,
      opponent_score INTEGER NOT NULL DEFAULT 0,
      winner_id TEXT REFERENCES users(id),
      started_at TEXT DEFAULT NULL,
      completed_at TEXT DEFAULT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
// ============================================================
// SECTION 4: Seed Data
// ============================================================
function seedInitialData() {
    // Check if already seeded
    const existing = exports.dbHelper.get("SELECT COUNT(*) as count FROM classes");
    if (existing && existing.count > 0)
        return;
    // Seed Classes
    const classes = [
        ["class-9", "class-9", "Class 9", "Build a rock-solid foundation across all CBSE subjects", "#3B82F6", "#06B6D4", 1],
        ["class-10", "class-10", "Class 10", "Board exam preparation with structured revision and practice", "#8B5CF6", "#A855F7", 2],
        ["class-11", "class-11", "Class 11", "Stream-based deep learning — Science, Commerce, Arts", "#10B981", "#14B8A6", 3],
        ["class-12", "class-12", "Class 12", "Board + entrance exam mastery with comprehensive mock tests", "#F59E0B", "#F97316", 4],
        ["engineering", "engineering", "Engineering", "Programming languages, DSA, development skills, and CS fundamentals", "#EF4444", "#F43F5E", 5],
    ];
    for (const c of classes) {
        db.run("INSERT OR IGNORE INTO classes (id, name, display_name, description, gradient_start, gradient_end, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?)", c);
    }
    // Seed Subjects
    const subjects = [
        ["c9-math", "class-9", "mathematics", "Mathematics", "Number systems, algebra, geometry, statistics", "calculator", "#3B82F6", 1],
        ["c9-science", "class-9", "science", "Science", "Physics, Chemistry, Biology fundamentals", "flask-conical", "#10B981", 2],
        ["c9-social", "class-9", "social-science", "Social Science", "History, Geography, Civics, Economics", "globe", "#F59E0B", 3],
        ["c9-english", "class-9", "english", "English", "Literature, grammar, writing skills", "book-open", "#8B5CF6", 4],
        ["c9-hindi", "class-9", "hindi", "Hindi", "Hindi literature, grammar, comprehension", "languages", "#EF4444", 5],
        ["c10-math-std", "class-10", "mathematics-standard", "Mathematics (Standard)", "Board-level mathematics", "calculator", "#3B82F6", 1],
        ["c10-science", "class-10", "science", "Science", "Physics, Chemistry, Biology board prep", "flask-conical", "#10B981", 2],
        ["c10-social", "class-10", "social-science", "Social Science", "History, Geography, Civics, Economics", "globe", "#F59E0B", 3],
        ["c10-english", "class-10", "english", "English", "Literature, grammar, writing for boards", "book-open", "#8B5CF6", 4],
        ["eng-c", "engineering", "c-language", "C Language", "Fundamentals, pointers, memory management", "code", "#3B82F6", 1],
        ["eng-cpp", "engineering", "cpp", "C++", "OOP, STL, competitive programming", "code", "#06B6D4", 2],
        ["eng-python", "engineering", "python", "Python", "AI, web, scripting", "code", "#10B981", 3],
        ["eng-java", "engineering", "java", "Java", "Enterprise, Android, OOP", "code", "#F59E0B", 4],
        ["eng-js", "engineering", "javascript", "JavaScript", "Web dev, DOM, async", "code", "#EAB308", 5],
        ["eng-dsa", "engineering", "dsa", "Data Structures & Algorithms", "Arrays, trees, graphs, DP", "git-branch", "#8B5CF6", 6],
        ["eng-webdev", "engineering", "web-development", "Web Development", "HTML, CSS, React, Node.js", "globe", "#EF4444", 7],
    ];
    for (const s of subjects) {
        db.run("INSERT OR IGNORE INTO subjects (id, class_id, name, display_name, description, icon, color, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", s);
    }
    // Seed Badges
    const badges = [
        ["badge-first-login", "first-login", "Welcome Aboard", "Completed your first login", "log-in", "#3B82F6", "special", 1, 1],
        ["badge-first-test", "first-test", "Test Taker", "Completed your first test", "clipboard-check", "#10B981", "tests", 1, 2],
        ["badge-7-streak", "7-day-streak", "Week Warrior", "Maintained a 7-day learning streak", "flame", "#F59E0B", "streak", 7, 3],
        ["badge-30-streak", "30-day-streak", "Monthly Master", "Maintained a 30-day learning streak", "flame", "#EF4444", "streak", 30, 4],
        ["badge-100-points", "100-points", "Century Club", "Earned 100 total points", "star", "#8B5CF6", "points", 100, 5],
        ["badge-500-points", "500-points", "High Scorer", "Earned 500 total points", "trophy", "#F59E0B", "points", 500, 6],
        ["badge-level-5", "level-5", "Rising Star", "Reached Level 5", "trending-up", "#10B981", "level", 5, 7],
        ["badge-level-10", "level-10", "Battle Ready", "Reached Level 10", "swords", "#EF4444", "level", 10, 8],
    ];
    for (const b of badges) {
        db.run("INSERT OR IGNORE INTO badges (id, name, display_name, description, icon, color, requirement_type, requirement_value, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", b);
    }
    console.log("  📦 Seeded classes, subjects, and badges");
}
//# sourceMappingURL=initialize.js.map