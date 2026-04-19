import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, readAuthSession } from "@/lib/auth-session";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export async function GET() {
  const cookieStore = await cookies();
  const raw = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  const session = readAuthSession(raw);

  if (!session) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  const now = Math.floor(Date.now() / 1000);
  const expiresAt = session.expires_at || (session.expiresAt ? Math.floor(session.expiresAt / 1000) : now);
  const remaining = Math.max(0, expiresAt - now);

  return NextResponse.json({
    authenticated: true,
    user: session.user ?? null,
    token: session?.token ?? null,
    expires_in: session.expires_in ?? remaining,
    expires_at: session.expires_at ?? expiresAt,
    login_time: session.login_time ?? null,
    timezone: session.user?.timezone ?? null,
  });
}
