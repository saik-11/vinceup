"use client";
// useAuth.js
import React, {
  createContext,
  useContext,
  useCallback,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

const AuthContext = createContext(null);
const TOKEN_KEY = "access_token";

// ── tiny external store for the token ──
let inMemoryToken = null;
const listeners = new Set();

function getTokenSnapshot() {
  if (inMemoryToken === null && typeof window !== "undefined") {
    inMemoryToken = localStorage.getItem(TOKEN_KEY);
    // ensure cookie stays in sync on hydration
    if (inMemoryToken) {
      document.cookie = `auth_token=${inMemoryToken}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    }
  }
  return inMemoryToken;
}
function getServerSnapshot() {
  return null; // always null on server → no mismatch
}
function subscribe(cb) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}
function persistToken(token) {
  inMemoryToken = token;
  if (typeof window !== "undefined") {
    if (token) {
      localStorage.setItem(TOKEN_KEY, token);
      // mirror to cookie so middleware can read it
      document.cookie = `auth_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Lax`;
    } else {
      localStorage.removeItem(TOKEN_KEY);
      // clear the cookie
      document.cookie = "auth_token=; path=/; max-age=0";
    }
  }
  listeners.forEach((cb) => cb());
}

export function AuthProvider({ children }) {
  const token = useSyncExternalStore(
    subscribe,
    getTokenSnapshot,
    getServerSnapshot,
  );

  const login = useCallback((newToken) => persistToken(newToken), []);
  const logout = useCallback(() => persistToken(null), []);

  const value = useMemo(
    () => ({
      token,
      login,
      logout,
      getToken: () => inMemoryToken,
      isAuthenticated: !!token,
    }),
    [token, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
