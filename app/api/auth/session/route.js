import { NextResponse } from "next/server";
import { cookies } from "next/headers";
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

  return NextResponse.json({
    authenticated: true,
    user: session.user ?? null,
    token: session?.token ?? null,
    expires_in: Math.max(0, Math.floor((session.expiresAt - Date.now()) / 1000)),
    timezone: session.user?.timezone ?? null,
  });
}
