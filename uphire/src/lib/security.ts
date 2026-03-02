/**
 * Form validation and sanitization to prevent XSS and injection attacks.
 * Use these utilities before storing or sending user input.
 */

/** Max lengths for common fields */
const MAX_LENGTHS = {
  name: 200,
  email: 254,
  phone: 50,
  textShort: 500,
  textLong: 5000,
  search: 200,
} as const;

/** Strip HTML tags and dangerous characters to prevent XSS */
export function sanitizeString(
  input: string,
  maxLength: number = MAX_LENGTHS.textShort
): string {
  if (typeof input !== "string") return "";
  const s = input
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers (onclick=, etc.)
    /* eslint-disable-next-line no-control-regex -- strip control chars for XSS prevention */
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // Remove control chars
    .trim();
  return s.slice(0, maxLength);
}

/** Sanitize for search inputs - alphanumeric, spaces, hyphens, basic punctuation */
export function sanitizeSearch(input: string): string {
  if (typeof input !== "string") return "";
  const s = input
    .replace(/[<>'"`;\\]/g, "") // Remove injection chars
    .replace(/<[^>]*>/g, "")
    .trim();
  return s.slice(0, MAX_LENGTHS.search);
}

/** Validate and sanitize email */
export function sanitizeEmail(input: string): string | null {
  if (typeof input !== "string") return null;
  const trimmed = input.trim().toLowerCase().slice(0, MAX_LENGTHS.email);
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(trimmed) ? trimmed : null;
}

/** Sanitize name - letters, spaces, hyphens, apostrophes */
export function sanitizeName(input: string): string {
  if (typeof input !== "string") return "";
  const s = input
    .replace(/[<>'"`;\\0-9]/g, "") // Remove dangerous chars and digits
    .replace(/\s+/g, " ")
    .trim();
  return s.slice(0, MAX_LENGTHS.name);
}

/** Sanitize phone - digits, spaces, +, -, (, ) */
export function sanitizePhone(input: string): string {
  if (typeof input !== "string") return "";
  const s = input.replace(/[^\d\s+\-()]/g, "").trim();
  return s.slice(0, MAX_LENGTHS.phone);
}

/** Sanitize comma-separated list (e.g. skills) */
export function sanitizeCommaList(input: string, maxItems: number = 50): string[] {
  if (typeof input !== "string") return [];
  return input
    .split(/[,\s]+/)
    .map((s) => sanitizeString(s, 100))
    .filter(Boolean)
    .slice(0, maxItems);
}

/** Validate role ID / job ID - numeric or alphanumeric only */
export function sanitizeId(input: string): string | null {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!/^[a-zA-Z0-9_-]+$/.test(s)) return null;
  return s.slice(0, 100);
}

export { MAX_LENGTHS };
