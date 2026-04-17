import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, readAuthSession } from "@/lib/auth-session";

export async function GET(request) {
  const session = readAuthSession(request.cookies.get(AUTH_COOKIE_NAME)?.value);

  return NextResponse.json({
    authenticated: Boolean(session),
  });
}
