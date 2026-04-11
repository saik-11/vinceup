import { NextResponse } from "next/server";

const AUTH_ROUTES = ["/login", "/signup", "/mentor-signup", "/reset-password",];
export function proxy(request) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("auth_token")?.value;

  if (token && AUTH_ROUTES.some(route => pathname === route || pathname.startsWith(`${route}/`))) {
    const callbackUrl = request.nextUrl.searchParams.get("callbackUrl") || "/";
    return NextResponse.redirect(new URL(callbackUrl, request.url));
  }

  // no token → redirect to login with callback
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*", "/book-session/:path"],
};