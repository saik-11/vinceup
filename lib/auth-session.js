import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "auth_session";
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

// ─── Create ──────────────────────────────────────────────────────────────────
export function createAuthSession(token, user = null) {
  const expiresAt = Date.now() + AUTH_SESSION_MAX_AGE * 1000;
  const payload = Buffer.from(JSON.stringify({ token, expiresAt, user }), "utf8").toString("base64url");

  return `${payload}.${sign(payload)}`;
}

// ─── Read & Validate ─────────────────────────────────────────────────────────
// lib/auth-session.js

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

    if (!session?.token || !session?.expiresAt || session.expiresAt <= Date.now()) {
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
