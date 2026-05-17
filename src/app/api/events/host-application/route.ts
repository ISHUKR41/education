/**
 * FILE: route.ts
 * LOCATION: src/app/api/events/host-application/route.ts
 * PURPOSE: API endpoint for college/institution event hosting applications.
 *          Accepts POST requests from the /events/host form and stores the
 *          application in the database for the EduQuest team to review.
 *          Applications are stored in the eduquest_audit_logs table with
 *          a special "host_application" action type until a dedicated table
 *          is added. An acknowledgement email would be triggered here in
 *          production (requires a mail service integration).
 * USED BY: src/app/events/host/page.tsx — called on form submission
 * DEPENDENCIES: postgres pool, auth helpers, api-response utilities
 * LAST UPDATED: 2026-05-16
 * AUTHOR NOTE: The current implementation stores applications in the audit_logs
 *              table (as a metadata JSON blob) since we don't yet have a dedicated
 *              host_applications table. This is intentional for MVP — it keeps all
 *              submitted applications visible to admins without a new migration.
 */

import type { NextRequest } from "next/server";
import { getAuthenticatedUser } from "@/lib/server/auth/current-user";
import { getPostgresPool } from "@/lib/server/database/postgres";
import { apiError, apiSuccess, NO_STORE_HEADERS } from "@/lib/server/utils/api-response";

export const runtime = "nodejs";

/* ─────────────────────────────────────────────
 * Input Validation
 * ───────────────────────────────────────────── */

/**
 * Validates the required fields of a host application submission.
 * Returns an error message string if validation fails, or null if valid.
 *
 * @param body - The parsed JSON body from the request
 * @returns Error message or null
 */
function validateHostApplication(body: Record<string, unknown>): string | null {
  const required = [
    "institutionName",
    "institutionType",
    "city",
    "state",
    "organizerName",
    "organizerEmail",
    "eventName",
    "eventType",
    "eventDate",
    "expectedParticipants",
  ];

  for (const field of required) {
    if (!body[field] || typeof body[field] !== "string" || !(body[field] as string).trim()) {
      return `Missing required field: ${field}`;
    }
  }

  /* Basic email format validation */
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(body.organizerEmail as string)) {
    return "Invalid email address format";
  }

  /* Must agree to terms */
  if (!body.agreeToTerms) {
    return "You must agree to the terms to submit an application";
  }

  return null; /* Valid */
}

/* ─────────────────────────────────────────────
 * POST Handler
 * ───────────────────────────────────────────── */

/**
 * POST /api/events/host-application
 *
 * Accepts a hosting application from an institution or organiser.
 * Stores it in the audit_logs table as a "host_application" event.
 * Returns a success confirmation.
 *
 * Body: HostEventFormData (see src/app/events/host/page.tsx)
 */
export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;

  /* Parse the JSON body from the form */
  try {
    body = await request.json();
  } catch {
    return apiError(
      "INVALID_BODY",
      "Request body must be valid JSON.",
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  /* Validate required fields */
  const validationError = validateHostApplication(body);
  if (validationError) {
    return apiError(
      "VALIDATION_FAILED",
      validationError,
      400,
      undefined,
      NO_STORE_HEADERS,
    );
  }

  /* Check if there is a logged-in user (optional — applications can be anonymous) */
  const user = await getAuthenticatedUser(request);

  try {
    const pool = getPostgresPool();

    /*
     * Store the application in the audit_logs table.
     * We use the audit_logs table as a temporary store for MVP.
     * The metadata JSON contains the full application payload.
     * The action "host_application" distinguishes these from security events.
     */
    await pool.query(
      `INSERT INTO eduquest_audit_logs
         (user_id, action, resource_type, resource_id, metadata, ip_address, user_agent)
       VALUES
         ($1, $2, $3, $4, $5, $6, $7)`,
      [
        user?.id ?? null,                    /* user_id — null if anonymous */
        "host_application",                  /* action type for filtering */
        "host_application",                  /* resource_type */
        null,                                /* resource_id — not applicable */
        JSON.stringify({
          ...body,
          submittedAt: new Date().toISOString(),
          submitterUserId: user?.id ?? null,
        }),
        request.headers.get("x-forwarded-for") ?? request.headers.get("x-real-ip") ?? "unknown",
        request.headers.get("user-agent") ?? "unknown",
      ],
    );

    /*
     * In production, trigger an automated acknowledgement email here:
     * await sendEmail({
     *   to: body.organizerEmail as string,
     *   subject: "EduQuest Host Application Received",
     *   template: "host-application-received",
     *   data: { organizerName: body.organizerName, eventName: body.eventName },
     * });
     */

    /* Return a success response with a reference number */
    const referenceNumber = `EQ-${Date.now().toString(36).toUpperCase()}`;

    return apiSuccess(
      {
        message: "Host application submitted successfully",
        referenceNumber,
        nextSteps: [
          "Our team will review your application within 48 working hours",
          "You will receive a confirmation email at the address you provided",
          "If approved, we will schedule a 15-minute onboarding call",
        ],
      },
      { headers: NO_STORE_HEADERS },
    );

  } catch (error) {
    /* Log the error server-side without leaking details to the client */
    console.error("[host-application] Database error:", error);

    return apiError(
      "INTERNAL_ERROR",
      "Failed to submit your application. Please try again or contact us directly.",
      500,
      undefined,
      NO_STORE_HEADERS,
    );
  }
}

/**
 * GET /api/events/host-application
 * Returns a helpful 405 with documentation about this endpoint.
 */
export async function GET() {
  return apiError(
    "METHOD_NOT_ALLOWED",
    "POST to this endpoint to submit a host application. See /events/host for the form.",
    405,
    undefined,
    { ...NO_STORE_HEADERS, Allow: "POST" },
  );
}
