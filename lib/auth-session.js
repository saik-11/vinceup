import { createHmac, timingSafeEqual } from "node:crypto";

export const AUTH_COOKIE_NAME = "auth_session";
export const AUTH_SESSION_MAX_AGE = 60 * 60 * 24 * 7;

function getSessionSecret() {
  return process.env.AUTH_SESSION_SECRET || "vinceup-dev-auth-session-secret";
}

function sign(value) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("base64url");
}

export function createAuthSession(token) {
  const expiresAt = Date.now() + AUTH_SESSION_MAX_AGE * 1000;
  const payload = Buffer.from(
    JSON.stringify({ token, expiresAt }),
    "utf8",
  ).toString("base64url");

  return `${payload}.${sign(payload)}`;
}

export function readAuthSession(cookieValue) {
  if (!cookieValue) {
    return null;
  }

  const [payload, signature] = cookieValue.split(".");
  if (!payload || !signature) {
    return null;
  }

  const expectedSignature = sign(payload);
  const receivedSignature = Buffer.from(signature, "utf8");
  const calculatedSignature = Buffer.from(expectedSignature, "utf8");

  if (
    receivedSignature.length !== calculatedSignature.length ||
    !timingSafeEqual(receivedSignature, calculatedSignature)
  ) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    );

    if (!session?.token || !session?.expiresAt || session.expiresAt <= Date.now()) {
      return null;
    }

    return session;
  } catch {
    return null;
  }
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: AUTH_SESSION_MAX_AGE,
  };
}
