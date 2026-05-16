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
import { ZodSchema } from "zod";
/**
 * validate — Middleware factory that validates request data against a Zod schema.
 *
 * @param schema - The Zod schema to validate against
 * @param source - Which part of the request to validate ('body', 'query', or 'params')
 *
 * Usage: router.post("/signup", validate(signupSchema, "body"), authController.signup)
 */
export declare function validate(schema: ZodSchema, source?: "body" | "query" | "params"): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=validate.middleware.d.ts.map