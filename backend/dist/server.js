"use strict";
/**
 * FILE: server.ts
 * LOCATION: backend/src/server.ts
 * PURPOSE: Main entry point for the EduQuest backend API server.
 *          Initializes Express with all middleware, mounts route modules,
 *          sets up error handling, and starts listening on the configured port.
 *          This file orchestrates everything — it does NOT contain business logic.
 * USED BY: npm run dev / npm start
 * DEPENDENCIES: express, cors, helmet, compression, morgan, cookie-parser,
 *               dotenv, rate-limiter, all route modules
 * LAST UPDATED: 2026-05-12
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Load environment variables from .env file before anything else
dotenv_1.default.config();
// Import route modules — each handles a specific domain
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const class_routes_1 = __importDefault(require("./routes/class.routes"));
const subject_routes_1 = __importDefault(require("./routes/subject.routes"));
const chapter_routes_1 = __importDefault(require("./routes/chapter.routes"));
const topic_routes_1 = __importDefault(require("./routes/topic.routes"));
const question_routes_1 = __importDefault(require("./routes/question.routes"));
const test_routes_1 = __importDefault(require("./routes/test.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const leaderboard_routes_1 = __importDefault(require("./routes/leaderboard.routes"));
const community_routes_1 = __importDefault(require("./routes/community.routes"));
const event_routes_1 = __importDefault(require("./routes/event.routes"));
const streak_routes_1 = __importDefault(require("./routes/streak.routes"));
const badge_routes_1 = __importDefault(require("./routes/badge.routes"));
const progress_routes_1 = __importDefault(require("./routes/progress.routes"));
const battle_routes_1 = __importDefault(require("./routes/battle.routes"));
const health_routes_1 = __importDefault(require("./routes/health.routes"));
// Import database initializer
const initialize_1 = require("./database/initialize");
// Import global error handler
const error_middleware_1 = require("./middleware/error.middleware");
// ============================================================
// SECTION 1: Create Express Application
// ============================================================
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// ============================================================
// SECTION 2: Security Middleware
// These run on EVERY request to protect the server.
// ============================================================
/**
 * Helmet — sets various HTTP security headers
 * Protects against XSS, clickjacking, MIME sniffing, etc.
 */
app.use((0, helmet_1.default)());
/**
 * CORS — allows the frontend to make requests to this server.
 * In production, restrict this to the exact frontend domain.
 */
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
}));
/**
 * Rate Limiter — prevents abuse by limiting requests per IP.
 * Window: 15 minutes, Max: 100 requests per window.
 */
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10),
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10),
    message: {
        success: false,
        error: "Too many requests from this IP. Please try again after 15 minutes.",
    },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use("/api/", limiter);
// ============================================================
// SECTION 3: Body Parsing & Utility Middleware
// ============================================================
/** Parse JSON request bodies (up to 10MB for content uploads) */
app.use(express_1.default.json({ limit: "10mb" }));
/** Parse URL-encoded form data */
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
/** Parse cookies for session/token management */
app.use((0, cookie_parser_1.default)(process.env.COOKIE_SECRET));
/** Compress responses — reduces bandwidth by ~70% for text responses */
app.use((0, compression_1.default)());
/** HTTP request logger — logs method, URL, status, and response time */
if (process.env.NODE_ENV !== "test") {
    app.use((0, morgan_1.default)("dev"));
}
// ============================================================
// SECTION 4: API Route Mounting
// Each route module handles a specific domain of the application.
// All routes are prefixed with /api/v1/ for versioning.
// ============================================================
const API_PREFIX = "/api/v1";
app.use(`${API_PREFIX}/health`, health_routes_1.default);
app.use(`${API_PREFIX}/auth`, auth_routes_1.default);
app.use(`${API_PREFIX}/users`, user_routes_1.default);
app.use(`${API_PREFIX}/classes`, class_routes_1.default);
app.use(`${API_PREFIX}/subjects`, subject_routes_1.default);
app.use(`${API_PREFIX}/chapters`, chapter_routes_1.default);
app.use(`${API_PREFIX}/topics`, topic_routes_1.default);
app.use(`${API_PREFIX}/questions`, question_routes_1.default);
app.use(`${API_PREFIX}/tests`, test_routes_1.default);
app.use(`${API_PREFIX}/dashboard`, dashboard_routes_1.default);
app.use(`${API_PREFIX}/leaderboard`, leaderboard_routes_1.default);
app.use(`${API_PREFIX}/community`, community_routes_1.default);
app.use(`${API_PREFIX}/events`, event_routes_1.default);
app.use(`${API_PREFIX}/streaks`, streak_routes_1.default);
app.use(`${API_PREFIX}/badges`, badge_routes_1.default);
app.use(`${API_PREFIX}/progress`, progress_routes_1.default);
app.use(`${API_PREFIX}/battles`, battle_routes_1.default);
// ============================================================
// SECTION 5: Error Handling
// ============================================================
/** Handle 404 — route not found */
app.use(error_middleware_1.notFoundHandler);
/** Global error handler — catches all unhandled errors */
app.use(error_middleware_1.globalErrorHandler);
// ============================================================
// SECTION 6: Server Startup
// ============================================================
/**
 * Start the server after initializing the database.
 * The database must be ready before accepting any requests.
 */
async function startServer() {
    try {
        // Initialize database tables and seed data
        await (0, initialize_1.initializeDatabase)();
        console.log("✅ Database initialized successfully");
        // Start listening for HTTP requests
        app.listen(PORT, () => {
            console.log(`\n🚀 EduQuest Backend Server`);
            console.log(`📍 Running on: http://localhost:${PORT}`);
            console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
            console.log(`📚 API Base: http://localhost:${PORT}${API_PREFIX}`);
            console.log(`❤️  Health: http://localhost:${PORT}${API_PREFIX}/health\n`);
        });
    }
    catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=server.js.map