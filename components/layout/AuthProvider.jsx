"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useSyncExternalStore,
} from "react";
import { useRouter } from "next/navigation";
import { getCookie, setCookie, deleteCookie } from "cookies-next/client";

const AUTH_COOKIE = "auth_token";

const AUTH_OPTIONS = {
  path: "/",
  maxAge: 60 * 60 * 24 * 7,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
};

const SNAPSHOT_SSR = { token: undefined, isReady: false };

/** Survives AuthProvider remounts (404, layout transitions). */
let authHydrationCache = null;

let clientHydrated = false;
const listeners = new Set();

function readTokenFromCookie() {
  const value = getCookie(AUTH_COOKIE);
  return typeof value === "string" && value.length > 0 ? value : undefined;
}

function notifyAuthListeners() {
  listeners.forEach((l) => l());
}

function subscribe(callback) {
  listeners.add(callback);
  if (typeof window !== "undefined" && !clientHydrated) {
    queueMicrotask(() => {
      clientHydrated = true;
      const t = readTokenFromCookie();
      authHydrationCache = { token: t };
      notifyAuthListeners();
    });
  }
  return () => {
    listeners.delete(callback);
  };
}

let cachedSnapshot = SNAPSHOT_SSR;

function getSnapshot() {
  if (typeof window === "undefined") {
    return SNAPSHOT_SSR;
  }
  if (!clientHydrated) {
    return SNAPSHOT_SSR;
  }
  const t = readTokenFromCookie();
  authHydrationCache = { token: t };
  const next = { token: t, isReady: true };
  if (
    cachedSnapshot.isReady === next.isReady &&
    cachedSnapshot.token === next.token
  ) {
    return cachedSnapshot;
  }
  cachedSnapshot = next;
  return next;
}

function getServerSnapshot() {
  return SNAPSHOT_SSR;
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const router = useRouter();
  const { token, isReady } = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot
  );

  const login = useCallback((newToken, redirectTo = "/dashboard") => {
    clientHydrated = true;
    setCookie(AUTH_COOKIE, newToken, AUTH_OPTIONS);
    authHydrationCache = { token: newToken };
    cachedSnapshot = { token: newToken, isReady: true };
    notifyAuthListeners();
    router.push(redirectTo);
  }, [router]);

  const logout = useCallback((redirectTo = "/login") => {
    deleteCookie(AUTH_COOKIE, AUTH_OPTIONS);
    authHydrationCache = { token: undefined };
    cachedSnapshot = { token: undefined, isReady: true };
    notifyAuthListeners();
    router.push(redirectTo);
  }, [router]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isReady,
      login,
      logout,
    }),
    [token, isReady, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}

/** Renders `children` only when the client has read the cookie (avoids SSR/client mismatch). */
export function AuthReady({ children, fallback = null }) {
  const { isReady } = useAuth();
  if (!isReady) return fallback;
  return children;
}

/** Renders `children` only when authenticated; respects `isReady` so logged-out UI does not flash first. */
export function AuthGate({ children, fallback = null }) {
  const { isReady, isAuthenticated } = useAuth();
  if (!isReady) return fallback;
  if (!isAuthenticated) return null;
  return children;
}
