"use client";

/**
 * useLocationData — production-ready location data hooks.
 *
 * Architecture
 * ─────────────
 * • Countries & States   → bundled local JSON  (zero network cost, instant)
 * • Cities               → CountriesNow API    (fetched on demand, localStorage-cached)
 *
 * Exports
 * ───────
 * useCountryList()              → sorted country array from local JSON
 * useStateList(countryName)     → states for one country (returns [] when unset)
 * useCityList(countryName, stateName) → cities fetched via API, with caching + error handling
 */

import { useMemo, useState, useEffect, useCallback } from "react";
import locationData from "@/data/location-data.json";

// ─────────────────────────────────────────────────────────────────────────────
// Constants
// ─────────────────────────────────────────────────────────────────────────────

const CITIES_API = "https://countriesnow.space/api/v0.1/countries/state/cities";
const CACHE_PREFIX = "vup_cities_";
/** Cache TTL: 24 hours */
const CACHE_TTL_MS = 1000 * 60 * 60 * 24;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

function cacheKey(country, state) {
  return `${CACHE_PREFIX}${country}__${state}`.toLowerCase().replace(/\s+/g, "_");
}

function readCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { data, expiry } = JSON.parse(raw);
    if (Date.now() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeCache(key, data) {
  try {
    localStorage.setItem(
      key,
      JSON.stringify({ data, expiry: Date.now() + CACHE_TTL_MS }),
    );
  } catch {
    // Storage quota exceeded — fail silently, data is still returned in memory.
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Derived data (computed once at module load — not inside hooks)
// ─────────────────────────────────────────────────────────────────────────────

/** @type {import("@/data/location-data.json").countries} */
const ALL_COUNTRIES = locationData.countries;

/**
 * Flattened shape used by CountryPicker / CountryCodePicker.
 * Matches the existing `{ name, code, dialCode, flag }` contract so that
 * existing usages of `useCountries` still work without changes.
 */
export const COUNTRIES_FLAT = ALL_COUNTRIES.map((c) => ({
  id: c.id,
  name: c.name,
  /** iso2 kept as `code` to preserve backward compat with CountryPicker */
  code: c.iso2,
  iso2: c.iso2,
  iso3: c.iso3,
  dialCode: c.phonecode,
  phonecode: c.phonecode,
  currency: c.currency,
  capital: c.capital,
  region: c.region,
  nationality: c.nationality,
  /** flag is a unicode emoji e.g. "🇮🇳" */
  flag: c.flag,
}));

/** Map for O(1) lookups: iso2 → full country record */
const COUNTRY_MAP = new Map(ALL_COUNTRIES.map((c) => [c.iso2, c]));
/** Map for lookups by name */
const COUNTRY_BY_NAME = new Map(ALL_COUNTRIES.map((c) => [c.name, c]));

// ─────────────────────────────────────────────────────────────────────────────
// Hooks
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the full sorted list of countries from local JSON.
 * No loading state — data is synchronous.
 */
export function useCountryList() {
  return COUNTRIES_FLAT;
}

/**
 * Returns the state list for a given country name.
 * Purely synchronous — sourced from local JSON.
 *
 * @param {string | null | undefined} countryName  e.g. "India"
 * @returns {{ id: number, name: string, state_code: string|null, country_code: string }[]}
 */
export function useStateList(countryName) {
  return useMemo(() => {
    if (!countryName) return [];
    const country = COUNTRY_BY_NAME.get(countryName);
    return country?.states ?? [];
  }, [countryName]);
}

/**
 * Fetches cities for a given country + state combination.
 * Results are cached in localStorage for 24 h.
 *
 * @param {string | null | undefined} countryName  e.g. "India"
 * @param {string | null | undefined} stateName    e.g. "Andhra Pradesh"
 */
export function useCityList(countryName, stateName) {
  const [cities, setCities] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCities = useCallback(async () => {
    if (!countryName || !stateName) {
      setCities([]);
      setError(null);
      return;
    }

    const key = cacheKey(countryName, stateName);
    const cached = readCache(key);

    if (cached) {
      setCities(cached);
      setError(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch(CITIES_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: countryName, state: stateName }),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const json = await res.json();

      if (json.error) throw new Error(json.msg || "API returned an error");

      const data = (json.data || []).map((name, idx) => ({ id: idx + 1, name }));
      writeCache(key, data);
      setCities(data);
    } catch (err) {
      setError(err.message || "Failed to load cities");
      setCities([]);
    } finally {
      setIsLoading(false);
    }
  }, [countryName, stateName]);

  useEffect(() => {
    fetchCities();
  }, [fetchCities]);

  return { cities, isLoading, error, retry: fetchCities };
}

// ─────────────────────────────────────────────────────────────────────────────
// Utility exports
// ─────────────────────────────────────────────────────────────────────────────

/** Look up a country record by iso2 code. */
export function getCountryByIso2(iso2) {
  return COUNTRY_MAP.get((iso2 || "").toUpperCase()) ?? null;
}

/** Look up a country record by full name. */
export function getCountryByName(name) {
  return COUNTRY_BY_NAME.get(name) ?? null;
}
