"use client";

import { useRouter } from "next/navigation";
import { useCallback, useMemo } from "react";
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
  serialize: (v) => v ?? "",
  deserialize: (v) => v || null,
};

export function useAuth() {
  const { value: token, set: setToken, remove: removeToken } = useCookie(
    AUTH_COOKIE,
    AUTH_OPTIONS,
  );

  const router = useRouter();

  // Derived — recalculates only when token changes
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

  return { token, user, isAuthenticated, login, logout };
}