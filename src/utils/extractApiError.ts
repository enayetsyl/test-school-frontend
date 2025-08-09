// src/utils/extractApiError.ts

export type ApiErrorCode =
  | "VALIDATION_ERROR"
  | "AUTH_REQUIRED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "SERVER_ERROR"
  | "INVALID_CREDENTIALS"
  | "INVALID_OTP"
  | "EXAM_LOCKED"
  | "SESSION_NOT_FOUND"
  | "QUESTION_NOT_FOUND"
  | "CERT_NOT_FOUND"
  | "CSV_PARSE_ERROR"
  | "FILE_TOO_LARGE"
  | (string & {}); // allow future codes without breaking
// ^ list documented in your API reference

export type ApiErrorResponse = {
  success: false;
  code: ApiErrorCode;
  message: string;
  // zod-like details often include `issues`, but keep this flexible
  details?: unknown;
};

export type RtkAxiosError = {
  status?: number;
  // `data` can be the server error JSON, or sometimes a string message
  data?: ApiErrorResponse | { message?: string; error?: string } | string;
};

// Small type guards (no `any` needed)
function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}
function getStr(obj: unknown, key: string): string | undefined {
  return isRecord(obj) && typeof obj[key] === "string"
    ? (obj[key] as string)
    : undefined;
}
function hasData(obj: unknown): obj is { data?: unknown } {
  return isRecord(obj) && "data" in obj;
}

/**
 * Extract a human-readable error message from:
 * - RTK Query axiosBaseQuery errors (`{ status, data }`)
 * - plain Error
 * - arbitrary objects that might have `message` or `error`
 */
export function extractApiError(err: unknown): string {
  // RTK baseQuery axios error: prefer server-provided message
  if (hasData(err)) {
    const d = (err as { data?: unknown }).data;

    if (typeof d === "string" && d.trim()) return d;

    if (isRecord(d)) {
      const msg = getStr(d, "message") ?? getStr(d, "error");
      if (msg) return msg;
    }
  }

  // Plain Error
  if (err instanceof Error && err.message) return err.message;

  // Object with a message/error field
  const fallback = getStr(err, "message") ?? getStr(err, "error");
  return fallback ?? "Something went wrong";
}

/**
 * Optional helper if you want field-level messages (e.g., zod issues).
 * Returns array of strings you can show under inputs or in a list.
 */
export function extractFieldIssues(err: unknown): string[] {
  if (!hasData(err)) return [];
  const d = (err as { data?: unknown }).data;
  if (!isRecord(d) || !isRecord(d.details)) return [];

  const issues = d.details["issues"];
  if (Array.isArray(issues)) {
    return issues
      .map((it) => (isRecord(it) ? getStr(it, "message") : undefined))
      .filter((m): m is string => !!m);
  }
  return [];
}
