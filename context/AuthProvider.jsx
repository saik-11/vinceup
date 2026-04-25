"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authStorage } from "@/lib/auth/authStorage";
import { authHelpers } from "@/lib/auth/authHelpers";
import { setApiAuthToken } from "@/services/Apiclient";
import { useSessionExpiry } from "@/hooks/useSessionExpiry";
import { SessionExpiredDialog } from "@/components/auth/SessionExpiredDialog";

export const AuthContext = createContext(null);

export function AuthProvider({ children, initialAuth }) {
  const [status, setStatus] = useState(initialAuth ? "authenticated" : "loading");
  const [user, setUser] = useState(null);

  const router = useRouter();
  const pathname = usePathname();

  // Verify session state on mount and on route change by reading cookies directly.
  // We do NOT call the API here — that would wipe cookies on any network error.
  // The middleware (proxy.js) already guards against unauthenticated route access.
  useEffect(() => {
    const initAuth = async () => {
      // Yield to the microtask queue to avoid synchronous setState warning
      await Promise.resolve();

      const token = authStorage.getToken();

      if (!token) {
        // Definitely not logged in — no cookie at all.
        setStatus("unauthenticated");
        return;
      }

      // Whether expired or not, if we have a token, we initialize as authenticated.
      // The useSessionExpiry hook will detect the expiration and render the modal on top,
      // freezing the UI until the user confirms. We intentionally do NOT set "unauthenticated"
      // here because that would unmount the protected page behind the modal or cause layout flashes.
      const storedUser = authStorage.getUser();
      setUser(storedUser);
      setStatus("authenticated");
    };

    initAuth();
  }, [pathname]);

  const handleSessionExpire = useCallback(() => {
    // The session expiry hook will call this.
    // Let's rely on the dialogue confirm to do the actual logout.
  }, []);

  const { isExpired, setIsExpired, showWarning, setShowWarning } = useSessionExpiry(handleSessionExpire);

  const login = useCallback((nextUser) => {
    setStatus("authenticated");
    if (nextUser) {
      setUser(nextUser);
    } else {
      setUser(authStorage.getUser());
    }
  }, []);

  const logout = useCallback(() => {
    authHelpers.logoutUser();
    setStatus("unauthenticated");
    setUser(null);
    setApiAuthToken(null);
  }, []);

  const handleSessionExpiredConfirm = useCallback(() => {
    logout();
    setIsExpired(false);
    router.push("/login");
  }, [logout, router, setIsExpired]);

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
    [status, user, login, logout]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
      <SessionExpiredDialog
        open={isExpired || showWarning}
        isWarning={!isExpired && showWarning}
        onConfirm={handleSessionExpiredConfirm}
        onContinue={handleSessionContinueConfirm}
        sessionExpiredTitle="Session Expired"
        sessionExpiredMessage="Your session has expired. Please sign in again."
        sessionExpiredButtonText="Go to Login"
      />
    </AuthContext.Provider>
  );
}
