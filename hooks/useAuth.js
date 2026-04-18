"use client";

import { createContext, useContext, useEffect, useCallback, useMemo, useState } from "react";
import { syncTimezoneIfChanged } from "@/lib/timezone";
import apiClient from "@/services/Apiclient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [status, setStatus] = useState("loading");
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session", {
          credentials: "include",
          cache: "no-store",
        });
        const data = await res.json();
        if (cancelled) return;

        if (data?.authenticated) {
          setStatus("authenticated");
          setUser(data.user ?? null);

          // ✅ Reuse the session data we already have — no second fetch
          const updatedTz = await syncTimezoneIfChanged(data.user?.timezone ?? null, data.token, apiClient);
          if (updatedTz) {
            console.info(`[tz-sync] ${data.user?.timezone} → ${updatedTz}`);
            setUser((prev) => (prev ? { ...prev, timezone: updatedTz } : prev));
          }
        } else {
          setStatus("unauthenticated");
          setUser(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("[Auth] 💥 Error:", err);
        setStatus("unauthenticated");
        setUser(null);
      }
    }

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback((nextUser) => {
    setStatus("authenticated");
    setUser(nextUser ?? null);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setStatus("unauthenticated");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      status,
      isLoading: status === "loading",
      isAuthenticated: status === "authenticated",
      isUnauthenticated: status === "unauthenticated",
      user,
      login,
      logout,
    }),
    [status, user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
