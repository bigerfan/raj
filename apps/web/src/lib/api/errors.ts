export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const isApiError = (e: unknown): e is ApiError => e instanceof ApiError;
export const isNotFound = (e: unknown) => isApiError(e) && e.status === 404;
export const isUnauthorized = (e: unknown) => isApiError(e) && e.status === 401;

/** Seconds to wait before another OTP request, when the API says so. */
export function getRetryAfterSeconds(err: unknown): number | null {
  if (!isApiError(err) || err.code !== "OTP_COOLDOWN") return null;
  const seconds = (err.details as { retryAfterSeconds?: unknown } | undefined)
    ?.retryAfterSeconds;
  return typeof seconds === "number" ? seconds : null;
}
