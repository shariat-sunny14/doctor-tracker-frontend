import { NextResponse } from "next/server";

const SESSION_COOKIE = "dt_token";

/**
 * Server-side route guard: runs before any page renders, so signed-out visitors never see a flash of protected UI.
 * It only checks that a session cookie EXISTS (fast, edge-friendly). The real authorization happens in the API,
 * which verifies the JWT on every request and answers 401 if it is invalid, which the client handles by signing out.
 */
export function middleware(request) {
  const { pathname, search, searchParams } = request.nextUrl;
  const hasSession = request.cookies.has(SESSION_COOKIE);
  const onLogin = pathname === "/login";

  if (!hasSession && !onLogin) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
    return NextResponse.redirect(url);
  }

  // Signed-in visitors skip the login page (unless they were just bounced here because the session expired).
  if (hasSession && onLogin && !searchParams.has("expired")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|icon.svg|favicon.ico).*)"],
};
