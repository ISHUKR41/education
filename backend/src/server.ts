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

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";

// Load environment variables from .env file before anything else
dotenv.config();

// Import route modules — each handles a specific domain
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import classRoutes from "./routes/class.routes";
import subjectRoutes from "./routes/subject.routes";
import chapterRoutes from "./routes/chapter.routes";
import topicRoutes from "./routes/topic.routes";
import questionRoutes from "./routes/question.routes";
import testRoutes from "./routes/test.routes";
import dashboardRoutes from "./routes/dashboard.routes";
import leaderboardRoutes from "./routes/leaderboard.routes";
import communityRoutes from "./routes/community.routes";
import eventRoutes from "./routes/event.routes";
import streakRoutes from "./routes/streak.routes";
import badgeRoutes from "./routes/badge.routes";
import progressRoutes from "./routes/progress.routes";
import battleRoutes from "./routes/battle.routes";
import healthRoutes from "./routes/health.routes";

// Import database initializer
import { initializeDatabase } from "./database/initialize";

// Import global error handler
import { globalErrorHandler, notFoundHandler } from "./middleware/error.middleware";

// ============================================================
// SECTION 1: Create Express Application
// ============================================================
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// SECTION 2: Security Middleware
// These run on EVERY request to protect the server.
// ============================================================

/**
 * Helmet — sets various HTTP security headers
 * Protects against XSS, clickjacking, MIME sniffing, etc.
 */
app.use(helmet());

/**
 * CORS — allows the frontend to make requests to this server.
 * In production, restrict this to the exact frontend domain.
 */
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"],
  })
);

/**
 * Rate Limiter — prevents abuse by limiting requests per IP.
 * Window: 15 minutes, Max: 100 requests per window.
 */
const limiter = rateLimit({
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
app.use(express.json({ limit: "10mb" }));

/** Parse URL-encoded form data */
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

/** Parse cookies for session/token management */
app.use(cookieParser(process.env.COOKIE_SECRET));

/** Compress responses — reduces bandwidth by ~70% for text responses */
app.use(compression());

/** HTTP request logger — logs method, URL, status, and response time */
if (process.env.NODE_ENV !== "test") {
  app.use(morgan("dev"));
}

// ============================================================
// SECTION 4: API Route Mounting
// Each route module handles a specific domain of the application.
// All routes are prefixed with /api/v1/ for versioning.
// ============================================================
const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/health`, healthRoutes);
app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/users`, userRoutes);
app.use(`${API_PREFIX}/classes`, classRoutes);
app.use(`${API_PREFIX}/subjects`, subjectRoutes);
app.use(`${API_PREFIX}/chapters`, chapterRoutes);
app.use(`${API_PREFIX}/topics`, topicRoutes);
app.use(`${API_PREFIX}/questions`, questionRoutes);
app.use(`${API_PREFIX}/tests`, testRoutes);
app.use(`${API_PREFIX}/dashboard`, dashboardRoutes);
app.use(`${API_PREFIX}/leaderboard`, leaderboardRoutes);
app.use(`${API_PREFIX}/community`, communityRoutes);
app.use(`${API_PREFIX}/events`, eventRoutes);
app.use(`${API_PREFIX}/streaks`, streakRoutes);
app.use(`${API_PREFIX}/badges`, badgeRoutes);
app.use(`${API_PREFIX}/progress`, progressRoutes);
app.use(`${API_PREFIX}/battles`, battleRoutes);

// ============================================================
// SECTION 5: Error Handling
// ============================================================

/** Handle 404 — route not found */
app.use(notFoundHandler);

/** Global error handler — catches all unhandled errors */
app.use(globalErrorHandler);

// ============================================================
// SECTION 6: Server Startup
// ============================================================

/**
 * Start the server after initializing the database.
 * The database must be ready before accepting any requests.
 */
async function startServer(): Promise<void> {
  try {
    // Initialize database tables and seed data
    await initializeDatabase();
    console.log("✅ Database initialized successfully");

    // Start listening for HTTP requests
    app.listen(PORT, () => {
      console.log(`\n🚀 EduQuest Backend Server`);
      console.log(`📍 Running on: http://localhost:${PORT}`);
      console.log(`🔧 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`📚 API Base: http://localhost:${PORT}${API_PREFIX}`);
      console.log(`❤️  Health: http://localhost:${PORT}${API_PREFIX}/health\n`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();

export default app;
