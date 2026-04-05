"use client";

import { usePathname } from "next/navigation";
import { useCallback, useRef, useSyncExternalStore } from "react";
import { cookieEngine } from "@/lib/cookies";

// ─── Module-level event bus ───
// When any hook sets/removes a cookie, ALL useCookie instances
// re-read their value synchronously. No stale closures.
const COOKIE_CHANGE = "cookie-change";

function notify() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(COOKIE_CHANGE));
  }
}

// Stable subscribe function — same reference across all hook instances.
// useSyncExternalStore requires this to be referentially stable.
function subscribe(onStoreChange) {
  window.addEventListener(COOKIE_CHANGE, onStoreChange);
  document.addEventListener("visibilitychange", onStoreChange);
  return () => {
    window.removeEventListener(COOKIE_CHANGE, onStoreChange);
    document.removeEventListener("visibilitychange", onStoreChange);
  };
}

// ─── Default serializers ───
const defaultSerialize = (v) => (typeof v === "string" ? v : JSON.stringify(v));

const defaultDeserialize = (v) => {
  try {
    return JSON.parse(v);
  } catch {
    return v;
  }
};

/**
 * useCookie — reactive, SSR-safe cookie state.
 *
 * Uses useSyncExternalStore so the value is available
 * synchronously on the first client render. No useState,
 * no useEffect, no "mounted" guards needed in consumers.
 *
 * @param {string} name
 * @param {object} [options]
 * @param {*}      [options.defaultValue]   - Fallback if cookie is absent
 * @param {object} [options.cookieOptions]  - maxAge, path, secure, sameSite
 * @param {function} [options.serialize]
 * @param {function} [options.deserialize]
 *
 * @returns {{ value, set, remove }}
 */
export function useCookie(name, options = {}) {
  const {
    defaultValue = null,
    cookieOptions = {},
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
  } = options;
  const pathname = usePathname();
  // Ref for cookieOptions — avoids re-creating set/remove
  // when caller passes an inline object literal.
  const optsRef = useRef(cookieOptions);
  optsRef.current = cookieOptions;

  // Cache the last raw string + deserialized value.
  // If the raw cookie string hasn't changed, return the same
  // reference — prevents infinite re-renders when deserialize
  // returns a new object (e.g. JSON.parse).
  const cacheRef = useRef({ raw: undefined, value: defaultValue });

  const getSnapshot = () => {
    const raw = cookieEngine.get(name);
    if (raw === cacheRef.current.raw) return cacheRef.current.value;
    const next = raw === null ? defaultValue : deserialize(raw);
    cacheRef.current = { raw, value: next };
    return next;
  };

  // Server always returns defaultValue — no document.cookie available.
  const getServerSnapshot = () => defaultValue;

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const set = useCallback(
    (newValue) => {
      const current = cookieEngine.get(name);
      const currentDeserialized =
        current === null ? defaultValue : deserialize(current);
      const resolved =
        typeof newValue === "function"
          ? newValue(currentDeserialized)
          : newValue;
      cookieEngine.set(name, serialize(resolved), optsRef.current);
      notify();
    },
    [name, defaultValue, serialize, deserialize],
  );

  const remove = useCallback(() => {
    cookieEngine.remove(name, optsRef.current);
    notify();
  }, [name]);

  return { value, set, remove };
}
