import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "auth_session";
export const ROLE_COOKIE_NAME = "role";
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── Create ──────────────────────────────────────────────────────────────────
export function createAuthSession(token, user = null, expiresInSeconds = AUTH_SESSION_MAX_AGE) {
  const login_time = Math.floor(Date.now() / 1000); // timestamp in seconds
  const expires_in = expiresInSeconds;
  const expires_at = login_time + expires_in;
  
  const payload = Buffer.from(JSON.stringify({ 
    token, 
    user, 
    login_time, 
    expires_in, 
    expires_at 
  }), "utf8").toString("base64url");

  return `${payload}.${sign(payload)}`;
}

// ─── Read & Validate ─────────────────────────────────────────────────────────

export function readAuthSession(cookieValue) {
  if (!cookieValue) return null;

  const dotIndex = cookieValue.lastIndexOf(".");
  if (dotIndex === -1) {
    return null;
  }

  const payload = cookieValue.slice(0, dotIndex);
  const signature = cookieValue.slice(dotIndex + 1);

  const expected = Buffer.from(sign(payload), "base64url");
  const received = Buffer.from(signature, "base64url");

  if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
    return null;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    const now = Math.floor(Date.now() / 1000);
    
    // Support both new `expires_at` (seconds) and old `expiresAt` (ms) for backward compatibility
    const expiry = session.expires_at || (session.expiresAt ? Math.floor(session.expiresAt / 1000) : null);
    
    if (!session?.token || !expiry || expiry <= now) {
      return null;
    }

    return session;
  } catch (e) {
    return null;
  }
}

// ─── Cookie Options ───────────────────────────────────────────────────────────
export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE,
  };
}

// ─── Internal ─────────────────────────────────────────────────────────────────
function sign(value) {
  const secret = process.env.AUTH_SESSION_SECRET ?? "dev-secret-change-me";
  return createHmac("sha256", secret).update(value).digest("base64url");
}
