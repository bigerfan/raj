import { ApiError } from "./errors";

export type QueryValue = string | number | boolean | null | undefined;

export interface FetchOptions extends Omit<RequestInit, "method" | "body"> {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  query?: Record<string, QueryValue>;
  body?: unknown;
  timeoutMs?: number;
}

function buildUrl(
  baseUrl: string,
  path: string,
  query?: FetchOptions["query"],
) {
  const url = baseUrl.replace(/\/$/, "") + path;
  if (!query) return url;
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined && value !== null && value !== "")
      params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

async function toApiError(res: Response): Promise<ApiError> {
  // not every error body is ours: e.g. the IP rate limiter answers with plain text
  let code = res.status === 429 ? "RATE_LIMITED" : "HTTP_ERROR";
  let message = res.statusText || "Request failed";
  let details: unknown;
  try {
    const data = await res.json();
    if (data?.error) {
      code = data.error.code ?? code;
      message = data.error.message ?? message;
      details = data.error.details;
    }
  } catch {
    /* non-JSON body */
  }
  return new ApiError(res.status, code, message, details);
}

export async function request<T>(
  baseUrl: string,
  path: string,
  {
    query,
    body,
    headers: extraHeaders,
    method = "GET",
    timeoutMs = 15_000,
    signal,
    ...init
  }: FetchOptions = {},
): Promise<T> {
  const headers = new Headers(extraHeaders);
  headers.set("Accept", "application/json");

  let payload: string | undefined;
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
    payload = JSON.stringify(body);
  }

  let res: Response;
  try {
    res = await fetch(buildUrl(baseUrl, path, query), {
      ...init,
      method,
      headers,
      body: payload,
      signal: signal ?? AbortSignal.timeout(timeoutMs), // a hung API must not hang page rendering
    });
  } catch (cause) {
    throw new ApiError(0, "NETWORK_ERROR", "Network error", cause);
  }

  if (!res.ok) throw await toApiError(res);
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}
