"use client";

/**
 * useRole()
 *
 * Reads the plain (non-httpOnly) `role` cookie synchronously on first render.
 * Returns the role string (e.g. "mentor" | "mentee") or null if not found.
 *
 * Why document.cookie instead of an API call:
 *  - The `role` cookie is intentionally NOT httpOnly — it's set server-side
 *    for UI-only decisions (sidebar links, dashboard variant, etc.).
 *  - The real auth token lives in the httpOnly `auth_session` cookie and is
 *    never exposed to client JS — security is not compromised here.
 *  - Reading synchronously means zero network round-trips and no layout flash.
 */

function getRoleCookie() {
  if (typeof document === "undefined") return null; // SSR guard
  const match = document.cookie.match(/(?:^|;\s*)role=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

export function useRole() {
  // Lazy initialiser runs once synchronously after hydration.
  // No useEffect / setState needed — the cookie value never changes
  // during a session without a full page reload.
  const role = getRoleCookie();
  return { role };
}
