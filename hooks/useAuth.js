"use client";

import { createContext, useContext, useEffect, useCallback, useMemo, useState } from "react";
import { syncTimezoneIfChanged } from "@/lib/timezone";
import { setApiAuthToken, getSessionData } from "@/services/Apiclient";
import apiClient from "@/services/Apiclient";
import { useRouter } from "next/navigation";
import { useSessionExpiry } from "./useSessionExpiry";
import { SessionExpiredDialog } from "@/components/auth/SessionExpiredDialog";

const AuthContext = createContext(null);

export function AuthProvider({ children, initialAuth }) {
  const [status, setStatus] = useState(initialAuth ? "authenticated" : "loading");
  const [user, setUser] = useState(null);
  const [expiresAt, setExpiresAt] = useState(null);

  const router = useRouter();

  const handleSessionExpire = useCallback(() => {
    // When session expires, token will be invalid.
  }, []);

  const { isExpired, showWarning, setShowWarning } = useSessionExpiry(expiresAt, handleSessionExpire);

  useEffect(() => {
    if (!initialAuth) return;
    let cancelled = false;

    async function checkSession() {
      try {
        const { data } = await getSessionData();
        if (cancelled) return;

        if (data?.authenticated) {
          setStatus("authenticated");
          setUser(data.user ?? null);
          setExpiresAt(data.expires_at ?? null);
          setApiAuthToken(data.token);
          // ✅ Reuse the session data we already have — no second fetch
          const updatedTz = await syncTimezoneIfChanged(data.user?.timezone ?? null, data.token, apiClient);
          if (updatedTz) {
            console.info(`[tz-sync] ${data.user?.timezone} → ${updatedTz}`);
            setUser((prev) => (prev ? { ...prev, timezone: updatedTz } : prev));
          }
        } else {
          setStatus("unauthenticated");
          setUser(null);
          setApiAuthToken(null);
          setExpiresAt(null);
        }
      } catch (err) {
        if (cancelled) return;
        console.error("[Auth] 💥 Error:", err);
        setStatus("unauthenticated");
        setUser(null);
        setApiAuthToken(null);
        setExpiresAt(null);
      }
    }

    void checkSession();
    return () => {
      cancelled = true;
    };
  }, [initialAuth]);

  const login = useCallback((nextUser) => {
    setStatus("authenticated");
    setUser(nextUser ?? null);
  }, []);

  const logout = useCallback(async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    setStatus("unauthenticated");
    setUser(null);
    setApiAuthToken(null);
    setExpiresAt(null);
  }, []);

  const handleSessionExpiredConfirm = useCallback(async () => {
    await logout();
    router.push("/login"); // or your designated login route
  }, [logout, router]);

  const handleSessionContinueConfirm = useCallback(() => {
    setShowWarning(false);
  }, [setShowWarning]);

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

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiredDialog 
        open={isExpired || showWarning} 
        isWarning={!isExpired && showWarning}
        onConfirm={handleSessionExpiredConfirm}
        onContinue={handleSessionContinueConfirm}
      />
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
