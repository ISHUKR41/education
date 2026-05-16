/**
 * FILE: error.middleware.ts
 * LOCATION: backend/src/middleware/error.middleware.ts
 * PURPOSE: Global error handling middleware for the EduQuest backend.
 *          Catches all unhandled errors and returns consistent JSON error responses.
 *          Also provides the 404 handler for undefined routes.
 * USED BY: server.ts — mounted as the last middleware in the chain
 * LAST UPDATED: 2026-05-12
 */
import { Request, Response, NextFunction } from "express";
/**
 * AppError — Custom error class for application-level errors.
 * Allows us to set HTTP status codes and error types consistently.
 */
export declare class AppError extends Error {
    statusCode: number;
    type: string;
    isOperational: boolean;
    constructor(message: string, statusCode?: number, type?: string);
}
/**
 * notFoundHandler — Handles requests to undefined routes.
 * Returns a clear 404 JSON response instead of an HTML error page.
 */
export declare function notFoundHandler(req: Request, _res: Response, next: NextFunction): void;
/**
 * globalErrorHandler — Catches all errors that bubble up through the middleware chain.
 * Logs the error in development mode and returns a sanitized JSON response.
 *
 * In production, stack traces are hidden to prevent information leakage.
 */
export declare function globalErrorHandler(err: AppError | Error, _req: Request, res: Response, _next: NextFunction): void;
//# sourceMappingURL=error.middleware.d.ts.map