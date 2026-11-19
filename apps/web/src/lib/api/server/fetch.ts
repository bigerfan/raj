import "server-only";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/lib/auth/constants";
import { env } from "@/lib/env";
import { request, type FetchOptions } from "../core";

interface ServerFetchOptions extends FetchOptions {
  /** Forward the user's access cookie. Use false for public, cacheable data. Default: true. */
  auth?: boolean;
}

export async function serverFetch<T>(
  path: string,
  { auth = true, ...options }: ServerFetchOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  if (auth) {
    const token = (await cookies()).get(ACCESS_COOKIE)?.value;
    if (token) headers.set("cookie", `${ACCESS_COOKIE}=${token}`);
    // personalized (prices depend on the user), so never cache
    options = { ...options, cache: options.cache ?? "no-store" };
  }

  return request<T>(env.API_URL, path, { ...options, headers });
}
