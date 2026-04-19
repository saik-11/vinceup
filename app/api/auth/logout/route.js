import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, getAuthCookieOptions, ROLE_COOKIE_NAME } from "@/lib/auth-session";

export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set(AUTH_COOKIE_NAME, "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
  response.cookies.set(ROLE_COOKIE_NAME, "", {
    ...getAuthCookieOptions(),
    maxAge: 0,
  });
  return response;
}
