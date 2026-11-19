import { request, type FetchOptions } from "../core";
import { isApiError } from "../errors";

const BASE = "/api";

// failures of these must never trigger a refresh attempt
const NO_REFRESH = new Set([
  "/auth/refresh",
  "/auth/otp/request",
  "/auth/otp/verify",
  "/auth/logout",
]);

let inflight: Promise<boolean> | null = null;

/** Single-flight: refresh tokens rotate, so parallel refreshes would invalidate each other. */
function refreshSession(): Promise<boolean> {
  if (!inflight) {
    inflight = request<void>(BASE, "/auth/refresh", { method: "POST" })
      .then(
        () => true,
        () => false,
      )
      .finally(() => {
        inflight = null;
      });
  }
  return inflight;
}

export async function clientFetch<T>(
  path: string,
  options: FetchOptions = {},
): Promise<T> {
  try {
    return await request<T>(BASE, path, options);
  } catch (err) {
    if (
      isApiError(err) &&
      err.status === 401 &&
      !NO_REFRESH.has(path) &&
      (await refreshSession())
    ) {
      return request<T>(BASE, path, options);
    }
    throw err;
  }
}
