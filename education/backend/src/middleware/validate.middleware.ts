/**
 * FILE: validate.middleware.ts
 * LOCATION: backend/src/middleware/validate.middleware.ts
 * PURPOSE: Request validation middleware using Zod schemas.
 *          Validates request body, query params, and URL params against
 *          predefined schemas before the request reaches the controller.
 * USED BY: All route files — placed before controller handlers
 * DEPENDENCIES: zod
 * LAST UPDATED: 2026-05-12
 */

import { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { AppError } from "./error.middleware";

/**
 * validate — Middleware factory that validates request data against a Zod schema.
 *
 * @param schema - The Zod schema to validate against
 * @param source - Which part of the request to validate ('body', 'query', or 'params')
 *
 * Usage: router.post("/signup", validate(signupSchema, "body"), authController.signup)
 */
export function validate(schema: ZodSchema, source: "body" | "query" | "params" = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const result = schema.parse(req[source]);
      // Replace the raw data with the validated/transformed data
      req[source] = result;
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        // Format Zod validation errors into a readable message
        const messages = error.issues.map(
          (issue) => `${issue.path.join(".")}: ${issue.message}`
        );
        next(
          new AppError(
            `Validation failed: ${messages.join(", ")}`,
            400,
            "VALIDATION_ERROR"
          )
        );
      } else {
        next(error);
      }
    }
  };
}
