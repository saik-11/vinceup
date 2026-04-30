"use client";

import { useEffect, useState } from "react";

/**
 * Subscribe to a CSS media query and return whether it matches.
 *
 * @param {string} query - A valid CSS media query string, e.g. "(min-width: 768px)".
 * @returns {boolean} Whether the media query currently matches.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mql = window.matchMedia(query);
    setMatches(mql.matches);

    const handler = (event) => setMatches(event.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, [query]);

  return matches;
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
