"use strict";
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_middleware_1 = require("./error.middleware");
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
function authenticate(req, _res, next) {
    try {
        let token;
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
            throw new error_middleware_1.AppError("Authentication required. Please log in.", 401, "UNAUTHORIZED");
        }
        // Verify the token and decode its payload
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            next(new error_middleware_1.AppError("Session expired. Please log in again.", 401, "TOKEN_EXPIRED"));
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            next(new error_middleware_1.AppError("Invalid authentication token.", 401, "INVALID_TOKEN"));
        }
        else {
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
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            return next(new error_middleware_1.AppError("Authentication required.", 401, "UNAUTHORIZED"));
        }
        if (!roles.includes(req.user.role)) {
            return next(new error_middleware_1.AppError("You do not have permission to perform this action.", 403, "FORBIDDEN"));
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map