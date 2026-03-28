"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cookieEngine } from "@/lib/cookies";

/**
 * useCookie — reactive cookie state with cross-tab sync.
 *
 * @param {string} name          - Cookie name
 * @param {object} [options]     - Configuration
 * @param {*}      [options.defaultValue]   - Fallback if cookie is absent
 * @param {object} [options.cookieOptions]  - maxAge, path, secure, sameSite, domain
 * @param {function} [options.serialize]    - Custom serializer (default: JSON.stringify for objects, String for primitives)
 * @param {function} [options.deserialize]  - Custom deserializer (default: JSON.parse, falls back to raw string)
 *
 * @returns {{ value, set, remove, refresh }}
 *
 * Usage:
 *   const { value, set, remove } = useCookie('theme', { defaultValue: 'light' });
 *   const { value: user, set: setUser } = useCookie('user', { defaultValue: null });
 */
export function useCookie(name, options = {}) {
  const {
    defaultValue = null,
    cookieOptions = {},
    serialize = defaultSerialize,
    deserialize = defaultDeserialize,
  } = options;

  // Avoid re-creating functions when cookieOptions object reference changes
  const cookieOptsRef = useRef(cookieOptions);
  cookieOptsRef.current = cookieOptions;

  const readCookie = useCallback(() => {
    const raw = cookieEngine.get(name);
    if (raw === null) return defaultValue;
    return deserialize(raw);
  }, [name, defaultValue, deserialize]);

  const [value, setValue] = useState(readCookie);

  // Set cookie + update state
  const set = useCallback(
    (newValue, overrideOptions = {}) => {
      // Support functional updates like setState
      const resolved =
        typeof newValue === "function" ? newValue(value) : newValue;

      const serialized = serialize(resolved);
      cookieEngine.set(name, serialized, {
        ...cookieOptsRef.current,
        ...overrideOptions,
      });
      setValue(resolved);
    },
    [name, value, serialize],
  );

  // Remove cookie + reset state to default
  const remove = useCallback(() => {
    cookieEngine.remove(name, cookieOptsRef.current);
    setValue(defaultValue);
  }, [name, defaultValue]);

  // Force re-read from document.cookie (useful after external changes)
  const refresh = useCallback(() => {
    setValue(readCookie());
  }, [readCookie]);

  // Cross-tab sync: when another tab changes cookies, pick it up
  useEffect(() => {
    const onStorageOrVisibility = () => {
      const fresh = readCookie();
      setValue((prev) =>
        JSON.stringify(prev) !== JSON.stringify(fresh) ? fresh : prev,
      );
    };

    // 'storage' doesn't fire for cookies, but visibilitychange does
    // when the user returns to this tab
    document.addEventListener("visibilitychange", onStorageOrVisibility);
    return () => {
      document.removeEventListener("visibilitychange", onStorageOrVisibility);
    };
  }, [readCookie]);

  return { value, set, remove, refresh };
}

// ─── Default serializers ───

function defaultSerialize(value) {
  if (typeof value === "string") return value;
  return JSON.stringify(value);
}

function defaultDeserialize(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return raw; // return as plain string if not valid JSON
  }
}
