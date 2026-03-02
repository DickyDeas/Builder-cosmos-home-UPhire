/**
 * Fetch wrapper with timeout and graceful error handling.
 * Use for all external API calls to provide consistent user feedback.
 */

const DEFAULT_TIMEOUT_MS = 15000;

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public isTimeout?: boolean
  ) {
    super(message);
    this.name = "ApiError";
  }
}

/**
 * Fetch with timeout. Throws ApiError with user-friendly message on failure.
 */
export async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof Error) {
      if (err.name === "AbortError") {
        throw new ApiError(
          "Request timed out. Please try again.",
          undefined,
          true
        );
      }
      if (err.message?.includes("Failed to fetch") || err.message?.includes("NetworkError")) {
        throw new ApiError(
          "Unable to connect. Please check your connection and try again.",
          undefined,
          false
        );
      }
      throw new ApiError(err.message || "An unexpected error occurred.");
    }
    throw new ApiError("An unexpected error occurred.");
  }
}

/**
 * Fetch JSON with timeout and error handling. Returns parsed JSON or throws.
 */
export async function fetchJsonWithTimeout<T = unknown>(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<T> {
  const res = await fetchWithTimeout(url, options, timeoutMs);

  let data: unknown;
  try {
    const text = await res.text();
    data = text ? JSON.parse(text) : {};
  } catch {
    throw new ApiError("Invalid response from server.", res.status);
  }

  if (!res.ok) {
    const errMsg =
      (data as { error?: string })?.error ||
      `Request failed (${res.status})`;
    throw new ApiError(errMsg, res.status);
  }

  return data as T;
}

/**
 * Get user-friendly error message for display in UI.
 */
export function getUserFriendlyErrorMessage(err: unknown): string {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) {
    // Avoid exposing internal/stack details
    if (err.message.includes("fetch") || err.message.includes("network"))
      return "Unable to connect. Please try again.";
    return err.message;
  }
  return "Something went wrong. Please try again.";
}
