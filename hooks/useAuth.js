// hooks/useAuth.js
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { useCookie } from "@/hooks/useCookie";
import { decodeJwt, isJwtExpired } from "@/lib/cookies";

const AUTH_COOKIE = "auth_token";
const AUTH_OPTIONS = {
  cookieOptions: {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
    secure: process.env.NODE_ENV === "production",
    sameSite: "Lax",
  },
  // Token is already a string — no JSON wrapping
  serialize: (v) => v ?? "",
  deserialize: (v) => v || null,
};

export function useAuth() {
  const {
    value: token,
    set: setToken,
    remove: removeToken,
    refresh,
  } = useCookie(AUTH_COOKIE, AUTH_OPTIONS);
  const router = useRouter();
  const pathname = usePathname();
  const user = useMemo(() => decodeJwt(token), [token]);
  const isAuthenticated = !!token && !isJwtExpired(token);

  const login = useCallback(
    (newToken, redirectTo = "/dashboard") => {
      setToken(newToken);
      router.push(redirectTo);
    },
    [setToken, router],
  );

  const logout = useCallback(
    (redirectTo = "/login") => {
      removeToken();

      const safeRedirect =
        typeof redirectTo === "string" && redirectTo.startsWith("/")
          ? redirectTo
          : "/login";

      router.push(safeRedirect);
    },
    [removeToken, router],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: explanation
  useEffect(() => {
    refresh(); // 👈 sync cookie on navigation
  }, [pathname]);

  return { token, user, isAuthenticated, login, logout };
}
