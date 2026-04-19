import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, readAuthSession } from "@/lib/auth-session";

// ─── Auth routes (redirect to dashboard if already logged in) ─────────────────
const AUTH_ROUTES = ["/login", "/signup", "/mentor-signup", "/forgot-password", "/reset-password"];

const DEFAULT_AUTH_REDIRECT = "/dashboard";

// ─── Role-restricted routes ───────────────────────────────────────────────────
// Add any new role-locked paths here — the proxy logic stays unchanged.

/** Routes only accessible to role === "mentor". Mentees → /dashboard. */
const MENTOR_ONLY_ROUTES = ["/mentor-calendar"];

/** Routes only accessible to role === "mentee". Mentors → /dashboard. */
const MENTEE_ONLY_ROUTES = ["/book-session", "/my-sessions", "/action-board", "/clarity-capsule", "/clarity-map", "/growth-meter"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function isRouteMatch(pathname, routes) {
  return routes.some((route) => pathname === route || pathname.startsWith(`${route}/`));
}

function getSafeCallbackUrl(request) {
  const callbackUrl = request.nextUrl.searchParams.get("callbackUrl");
  if (!callbackUrl || !callbackUrl.startsWith("/")) return DEFAULT_AUTH_REDIRECT;
  return callbackUrl;
}

// ─── Middleware ───────────────────────────────────────────────────────────────

export function proxy(request) {
  const pathname = request.nextUrl.pathname;

  // ── 1. Auth check ────────────────────────────────────────────────────────────
  const session = readAuthSession(request.cookies.get(AUTH_COOKIE_NAME)?.value);
  const isAuthenticated = Boolean(session);
  const isAuthRoute = isRouteMatch(pathname, AUTH_ROUTES);

  // Already logged in → don't show login/signup pages again
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL(getSafeCallbackUrl(request), request.url));
  }

  // Not logged in → redirect to login
  if (!isAuthenticated && !isAuthRoute) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", `${pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(loginUrl);
  }

  // ── 2. Role check (only for authenticated requests) ───────────────────────────
  if (isAuthenticated) {
    // The plain `role` cookie is set server-side at login for UI/guard decisions.
    // It is NOT httpOnly so it can also be read by client JS for sidebar rendering.
    const role = request.cookies.get("role")?.value ?? null;

    // Mentee (or unknown role) trying to access a mentor-only page
    if (role !== "mentor" && isRouteMatch(pathname, MENTOR_ONLY_ROUTES)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Mentor trying to access a mentee-only page
    if (role === "mentor" && isRouteMatch(pathname, MENTEE_ONLY_ROUTES)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  return NextResponse.next();
}

// ─── Matcher ──────────────────────────────────────────────────────────────────
// Every private route must appear here so the middleware runs for it.
// Auth routes must also be listed so logged-in users get bounced back.

export const config = {
  matcher: [
    // Auth routes
    "/login",
    "/signup",
    "/mentor-signup",
    "/forgot-password",
    "/reset-password",

    // Shared private routes
    "/dashboard/:path*",
    "/settings/:path*",
    "/personal-details/:path*",
    "/purchase-history/:path*",
    "/help/:path*",

    // Mentee-only routes
    "/my-sessions/:path*",
    "/book-session/:path*",
    "/action-board/:path*",
    "/clarity-capsule/:path*",
    "/clarity-map/:path*",
    "/growth-meter/:path*",

    // Mentor-only routes
    "/mentor-calendar/:path*",
  ],
};
