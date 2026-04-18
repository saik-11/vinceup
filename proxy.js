import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, readAuthSession } from "@/lib/auth-session";

const AUTH_ROUTES = ["/login", "/signup", "/mentor-signup", "/forgot-password", "/reset-password"];

const DEFAULT_AUTH_REDIRECT = "/dashboard";

function isRouteMatch(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function getSafeCallbackUrl(request) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");

  if (!callbackUrl || !callbackUrl.startsWith("/")) {
    return DEFAULT_AUTH_REDIRECT;
  }

  return callbackUrl;
}

export function proxy(request) {
  const pathname = request.nextUrl.pathname;
  const session = readAuthSession(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const isAuthenticated = Boolean(session);
  const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES);

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(getSafeCallbackUrl(request), request.url));
  }

  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/mentor-signup",
    "/forgot-password",
    "/reset-password",
    "/dashboard/:path*",
    "/my-sessions/:path*",
    "/mentor/dashboard/:path*",
    "/settings/:path*",
    "/personal-details/:path*",
    "/purchase-history/:path*",
    "/help/:path*",
    "/book-session/:path*",
  ],
};
