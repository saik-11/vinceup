import { NextResponse } from "next/server";

export default function middleware(request) {
  const token = request.cookies.get("auth-token")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);

    // store original path
    loginUrl.searchParams.set("callbackUrl", request.nextUrl.pathname);

    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

// Protect only these routes
export const config = {
  matcher: ["/"],
};
