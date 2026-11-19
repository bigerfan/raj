import "server-only";
import { cookies } from "next/headers";
import { cache } from "react";
import { ACCESS_COOKIE } from "@/lib/auth/constants";
import { isUnauthorized } from "../errors";
import type { AuthUser } from "../types";
import { serverFetch } from "./fetch";

/** The logged-in user, or null. Deduplicated per request, so layout and page can both call it. */
export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  if (!(await cookies()).has(ACCESS_COOKIE)) return null; // anonymous: skip the network call
  try {
    const { user } = await serverFetch<{ user: AuthUser }>("/auth/me");
    return user;
  } catch (err) {
    if (isUnauthorized(err)) return null;
    throw err;
  }
});
