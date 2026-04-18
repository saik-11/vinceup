import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, createAuthSession, getAuthCookieOptions } from "@/lib/auth-session";
import { getApiBaseUrl } from "@/lib/api-base-url";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function POST(request) {
  let credentials;
  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid payload." }, { status: 400 });
  }

  const upstream = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  const data = await upstream.json().catch(() => ({}));

  if (!upstream.ok) {
    return NextResponse.json(data, { status: upstream.status });
  }

  const token = data?.token ?? data?.access_token;
  if (!token) {
    return NextResponse.json({ message: "No token in auth response." }, { status: 502 });
  }

  const response = NextResponse.json({
    authenticated: true,
    token,
    user: data.user ?? null,
    expires_in: data.expires_in ?? 3600,
  });

  // app/api/auth/login/route.js  (add after setting AUTH_COOKIE_NAME)

  response.cookies.set(AUTH_COOKIE_NAME, createAuthSession(token, data.user ?? null), getAuthCookieOptions());

  return response;
}
