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
export class AppError extends Error {
  public statusCode: number;
  public type: string;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500, type: string = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
    this.isOperational = true;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

/**
 * notFoundHandler — Handles requests to undefined routes.
 * Returns a clear 404 JSON response instead of an HTML error page.
 */
export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void {
  const error = new AppError(
    `Route not found: ${req.method} ${req.originalUrl}`,
    404,
    "NOT_FOUND"
  );
  next(error);
}

/**
 * globalErrorHandler — Catches all errors that bubble up through the middleware chain.
 * Logs the error in development mode and returns a sanitized JSON response.
 *
 * In production, stack traces are hidden to prevent information leakage.
 */
export function globalErrorHandler(
  err: AppError | Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  void _next;

  const statusCode = "statusCode" in err ? err.statusCode : 500;
  const type = "type" in err ? err.type : "INTERNAL_ERROR";

  // Log the full error in development for debugging
  if (process.env.NODE_ENV === "development") {
    console.error("🔴 Error:", {
      message: err.message,
      type,
      statusCode,
      stack: err.stack,
    });
  }

  res.status(statusCode).json({
    success: false,
    error: {
      type,
      message: err.message,
      // Only include stack trace in development
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    },
  });
}
