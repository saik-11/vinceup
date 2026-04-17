import { NextResponse } from "next/server";
import {
  AUTH_COOKIE_NAME,
  createAuthSession,
  getAuthCookieOptions,
} from "@/lib/auth-session";
import { getApiBaseUrl } from "@/lib/api-base-url";

export async function POST(request) {
  let credentials;

  try {
    credentials = await request.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid login payload." },
      { status: 400 },
    );
  }

  const upstreamResponse = await fetch(`${getApiBaseUrl()}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
    cache: "no-store",
  });

  const data = await upstreamResponse.json().catch(() => ({}));

  if (!upstreamResponse.ok) {
    return NextResponse.json(data, { status: upstreamResponse.status });
  }

  const token = data?.token || data?.access_token;
  if (!token) {
    return NextResponse.json(
      { message: "Authentication response did not include a token." },
      { status: 502 },
    );
  }

  const response = NextResponse.json({
    ...data,
    token: undefined,
    access_token: undefined,
  });

  response.cookies.set(
    AUTH_COOKIE_NAME,
    createAuthSession(token),
    getAuthCookieOptions(),
  );

  return response;
}
