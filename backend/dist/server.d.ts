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
declare const app: import("express-serve-static-core").Express;
export default app;
//# sourceMappingURL=server.d.ts.map