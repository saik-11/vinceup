import { NextResponse } from "next/server";

export function proxy(request) {
  const pathname = request.nextUrl.pathname
  const token = request.cookies.get("auth_token")?.value;
  if (token && pathname === "/login") {
    return NextResponse.redirect(new URL("/", request.url));
  }
  if (!token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*", "/settings/:path*"],
};
