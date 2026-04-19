"use client";

import { useEffect, useState } from "react";

export function useSessionExpiry(expiresAt = null, onExpire = null) {
  const [isExpired, setIsExpired] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      return;
    }

    const checkExpiry = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = expiresAt - now;

      if (remaining <= 0) {
        setIsExpired(true);
        setShowWarning(false);
        if (onExpire) {
          onExpire();
        }
      } else if (remaining <= 120) {
        // Less than 2 minutes remaining, show warning
        setShowWarning(true);
      } else {
        setShowWarning(false);
        setIsExpired(false);
      }
    };

    checkExpiry();

    // Check periodically every 30 seconds
    const intervalId = setInterval(checkExpiry, 30000);

    return () => clearInterval(intervalId);
  }, [expiresAt, onExpire]);

  return { isExpired, showWarning, setShowWarning };
}
