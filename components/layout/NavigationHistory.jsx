"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/** sessionStorage key: last pathname before the current navigation (used by not-found "Go Back"). */
export const VINCEUP_NAV_PREV_KEY = "vinceup:prevPath";

/**
 * Tracks the previous in-app pathname so 404 "Go Back" can use router.replace(prev)
 * when router.back() has nothing to pop (direct load, new tab, shallow history).
 */
export function NavigationHistory() {
  const pathname = usePathname();
  const prevRef = useRef(null);

  useEffect(() => {
    const prev = prevRef.current;
    prevRef.current = pathname;
    if (prev != null && prev !== pathname) {
      try {
        sessionStorage.setItem(VINCEUP_NAV_PREV_KEY, prev);
      } catch {
        // private mode / quota
      }
    }
  }, [pathname]);

  return null;
}
