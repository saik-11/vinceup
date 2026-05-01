"use client";

import { useCallback } from "react";

export function useTimeFormat() {
  const parseLocalDate = useCallback((dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? null : d;
  }, []);

  const formatSessionDateTime = useCallback((dateStr) => {
    const d = parseLocalDate(dateStr);
    if (!d) return { date: "—", time: "—" };
    return {
      date: d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      time: d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }),
    };
  }, [parseLocalDate]);

  const isTodaySession = useCallback((dateStr) => {
    const d = parseLocalDate(dateStr);
    if (!d) return false;
    return d.toDateString() === new Date().toDateString();
  }, [parseLocalDate]);

  return { parseLocalDate, formatSessionDateTime, isTodaySession };
}
