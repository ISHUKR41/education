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
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
/**
 * authorize — Middleware factory that restricts access based on user roles.
 *
 * Usage: router.get("/admin", authenticate, authorize("admin", "super_admin"), handler)
 *
 * @param roles - List of roles allowed to access the route
 */
export declare function authorize(...roles: string[]): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map