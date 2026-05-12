"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const error_middleware_1 = require("./error.middleware");
/**
 * validate — Middleware factory that validates request data against a Zod schema.
 *
 * @param schema - The Zod schema to validate against
 * @param source - Which part of the request to validate ('body', 'query', or 'params')
 *
 * Usage: router.post("/signup", validate(signupSchema, "body"), authController.signup)
 */
function validate(schema, source = "body") {
    return (req, _res, next) => {
        try {
            const result = schema.parse(req[source]);
            // Replace the raw data with the validated/transformed data
            req[source] = result;
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                // Format Zod validation errors into a readable message
                const messages = error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
                next(new error_middleware_1.AppError(`Validation failed: ${messages.join(", ")}`, 400, "VALIDATION_ERROR"));
            }
            else {
                next(error);
            }
        }
    };
}
//# sourceMappingURL=validate.middleware.js.map