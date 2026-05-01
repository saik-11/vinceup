"use client";

import { useSyncExternalStore, useCallback } from "react";

/**
 * Subscribe to a CSS media query and return whether it matches.
 *
 * @param {string} query - A valid CSS media query string, e.g. "(min-width: 768px)".
 * @returns {boolean} Whether the media query currently matches.
 */
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (callback) => {
      if (typeof window === "undefined") return () => {};
      const mql = window.matchMedia(query);
      mql.addEventListener("change", callback);
      return () => mql.removeEventListener("change", callback);
    },
    [query]
  );

  const getSnapshot = useCallback(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia(query).matches;
  }, [query]);

  const getServerSnapshot = useCallback(() => false, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Convenience breakpoint hooks matching the design spec. */
export function useIsDesktop() {
  return useMediaQuery("(min-width: 1024px)");
}

export function useIsTablet() {
  return useMediaQuery("(min-width: 768px)");
}

export function useIsMobile() {
  return !useMediaQuery("(min-width: 768px)");
}
