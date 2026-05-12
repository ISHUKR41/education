/**
 * FILE: auth.middleware.ts
 * LOCATION: backend/src/middleware/auth.middleware.ts
 * PURPOSE: JWT authentication middleware for protecting API routes.
 *          Verifies the JWT token from the Authorization header or cookies,
 *          then attaches the decoded user data to the request object.
 * USED BY: Any route that requires authentication (dashboard, tests, community, etc.)
 * DEPENDENCIES: jsonwebtoken
 * LAST UPDATED: 2026-05-12
 */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware";

/**
 * Shape of the decoded JWT payload.
 * Contains the user's ID, email, and role for authorization checks.
 */
export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

/**
 * authenticate — Middleware that verifies JWT tokens.
 *
 * Token lookup order:
 * 1. Authorization header (Bearer <token>)
 * 2. Signed cookie (access_token)
 *
 * If valid, attaches decoded user info to req.user and calls next().
 * If invalid or missing, throws a 401 error.
 */
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    let token: string | undefined;

    // Check Authorization header first (standard for API clients)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fallback to cookie (standard for browser-based sessions)
    if (!token && req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    if (!token) {
      throw new AppError("Authentication required. Please log in.", 401, "UNAUTHORIZED");
    }

    // Verify the token and decode its payload
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded;

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(new AppError("Session expired. Please log in again.", 401, "TOKEN_EXPIRED"));
    } else if (error instanceof jwt.JsonWebTokenError) {
      next(new AppError("Invalid authentication token.", 401, "INVALID_TOKEN"));
    } else {
      next(error);
    }
  }
}

/**
 * authorize — Middleware factory that restricts access based on user roles.
 *
 * Usage: router.get("/admin", authenticate, authorize("admin", "super_admin"), handler)
 *
 * @param roles - List of roles allowed to access the route
 */
export function authorize(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError("Authentication required.", 401, "UNAUTHORIZED"));
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(
          "You do not have permission to perform this action.",
          403,
          "FORBIDDEN"
        )
      );
    }

    next();
  };
}
