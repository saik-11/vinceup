"use client";

import { useEffect, useState, useRef } from "react";
import { authStorage } from "@/lib/auth/authStorage";

export function useSessionExpiry(onExpire = null) {
  const [isExpired, setIsExpired] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const hasExpiredRef = useRef(false);

  useEffect(() => {
    let intervalId;

    const checkExpiry = () => {
      const token = authStorage.getToken();
      const meta = authStorage.getSessionMeta();

      // If user is already logged out or no meta exists, never show popup
      if (!token || !meta || !meta.expires_at) {
        setIsExpired(false);
        setShowWarning(false);
        hasExpiredRef.current = false;
        return;
      }

      const now = Date.now(); // in ms
      const remaining = meta.expires_at - now;

      if (remaining <= 0) {
        if (!hasExpiredRef.current) {
          hasExpiredRef.current = true;
          setIsExpired(true);
          setShowWarning(false);
          if (onExpire) {
            onExpire();
          }
        }
      } else if (remaining <= 120000) {
        // Less than 2 minutes remaining
        if (!hasExpiredRef.current) {
          setShowWarning(true);
        }
      } else {
        setShowWarning(false);
        setIsExpired(false);
        hasExpiredRef.current = false;
      }
    };

    // Run immediately on mount
    checkExpiry();

    // Check periodically every 15 seconds
    intervalId = setInterval(checkExpiry, 15000);

    return () => clearInterval(intervalId);
  }, [onExpire]);

  return { isExpired, setIsExpired, showWarning, setShowWarning };
}
