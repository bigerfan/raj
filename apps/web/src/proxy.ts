import { NextResponse, type NextRequest } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/constants";
import { isTokenExpired } from "@/lib/auth/jwt";
import { env } from "@/lib/env";

export async function proxy(request: NextRequest) {
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;

  // valid access token, or nothing to refresh with: do nothing
  if ((access && !isTokenExpired(access)) || !refresh)
    return NextResponse.next();

  let setCookies: string[];
  try {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const res = await fetch(`${env.API_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        cookie: `${REFRESH_COOKIE}=${refresh}`,
        "user-agent": request.headers.get("user-agent") ?? "",
        ...(forwardedFor ? { "x-forwarded-for": forwardedFor } : {}),
      },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });
    // On failure we deliberately do NOT clear cookies: parallel requests (page + prefetches)
    // race on the rotating token, and the losers must not log the user out.
    if (!res.ok) return NextResponse.next();
    setCookies = res.headers.getSetCookie();
  } catch {
    return NextResponse.next();
  }

  // 1) make the new tokens visible to the server components of THIS request
  for (const raw of setCookies) {
    const pair = raw.split(";")[0] ?? "";
    const i = pair.indexOf("=");
    if (i > 0) request.cookies.set(pair.slice(0, i).trim(), pair.slice(i + 1));
  }
  const response = NextResponse.next({ request: { headers: request.headers } });

  // 2) hand them to the browser
  for (const raw of setCookies) response.headers.append("set-cookie", raw);
  return response;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|uploads|favicon.ico|.*\\..*).*)",
  ],
};
