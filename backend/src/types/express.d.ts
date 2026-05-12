/**
 * FILE: express.d.ts
 * LOCATION: backend/src/types/express.d.ts
 * PURPOSE: Express request type augmentation for the standalone backend
 *          prototype. Authentication middleware attaches the decoded JWT
 *          payload to req.user, and route handlers read that property safely.
 * USED BY: backend/src/middleware/auth.middleware.ts and protected route files
 * DEPENDENCIES: express-serve-static-core, JwtPayload
 * LAST UPDATED: 2026-05-12
 */

import type { JwtPayload } from "../middleware/auth.middleware";

declare module "express-serve-static-core" {
  interface Request {
    user?: JwtPayload;
  }
}

export {};
