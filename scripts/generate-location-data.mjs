/**
 * generate-location-data.mjs
 *
 * Run once (or on demand) to regenerate the bundled location data:
 *   node scripts/generate-location-data.mjs
 *
 * Output: data/location-data.json
 *
 * Data source: https://countriesnow.space/api/v0.1/
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUT_FILE = path.resolve(__dirname, "../data/location-data.json");

const BASE = "https://countriesnow.space/api/v0.1";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, opts);
  if (!res.ok) throw new Error(`HTTP ${res.status} – ${url}`);
  const json = await res.json();
  if (json.error) throw new Error(`API error – ${url}: ${json.msg}`);
  return json.data;
}

/** Retry wrapper — CountriesNow occasionally rate-limits. */
async function fetchWithRetry(url, retries = 3, delayMs = 1200) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fetchJSON(url);
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  ⚠ Attempt ${attempt} failed (${err.message}). Retrying in ${delayMs}ms…`);
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function fetchCountriesWithStates() {
  console.log("📡 Fetching countries + states…");
  return fetchWithRetry(`${BASE}/countries/states`);
}

async function fetchCountryInfo() {
  console.log("📡 Fetching country info (iso2/iso3/phone/currency/capital/region/nationality)…");
  // This endpoint returns an array of country objects with all useful metadata
  return fetchWithRetry(`${BASE}/countries/info?returns=currency,flag,unicodeFlag,dialCode`);
}

async function fetchFlagEmojis() {
  console.log("📡 Fetching flag emojis…");
  return fetchWithRetry(`${BASE}/countries/flag/unicode`);
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const [statesData, infoData, flagData] = await Promise.all([
    fetchCountriesWithStates(),
    fetchCountryInfo(),
    fetchFlagEmojis(),
  ]);

  // Build lookup maps for enrichment
  /** @type {Map<string, object>} keyed by iso2 */
  const infoByIso2 = new Map();
  for (const c of infoData) {
    if (c.iso2) infoByIso2.set(c.iso2.toUpperCase(), c);
  }

  /** @type {Map<string, string>} iso2 → unicode flag emoji */
  const flagByIso2 = new Map();
  for (const c of flagData) {
    if (c.iso2 && c.unicodeFlag) flagByIso2.set(c.iso2.toUpperCase(), c.unicodeFlag);
  }

  // Merge and shape
  let id = 1;
  let stateId = 1;

  const countries = [];

  for (const entry of statesData) {
    const iso2 = (entry.iso2 || "").toUpperCase();
    const info = infoByIso2.get(iso2) || {};

    const states = (entry.states || []).map((s) => ({
      id: stateId++,
      name: s.name,
      state_code: s.state_code || null,
      country_code: iso2,
    }));

    countries.push({
      id: id++,
      name: entry.name,
      iso2,
      iso3: (entry.iso3 || info.iso3 || "").toUpperCase(),
      phonecode: info.dialCode || null,
      currency: info.currency || null,
      capital: info.capital || null,
      region: entry.region || null,
      flag: flagByIso2.get(iso2) || null,
      nationality: info.nationality || null,
      states,
    });
  }

  // Sort alphabetically for predictable dropdown ordering
  countries.sort((a, b) => a.name.localeCompare(b.name));

  const output = {
    _meta: {
      generated: new Date().toISOString(),
      source: "https://countriesnow.space/api/v0.1/",
      total_countries: countries.length,
      total_states: countries.reduce((n, c) => n + c.states.length, 0),
      note: "Cities are NOT stored here. Fetch dynamically via POST /api/v0.1/countries/state/cities",
    },
    countries,
  };

  await fs.writeFile(OUT_FILE, JSON.stringify(output, null, 2), "utf-8");

  console.log(`\n✅ Done! Written to ${OUT_FILE}`);
  console.log(`   Countries : ${output._meta.total_countries}`);
  console.log(`   States    : ${output._meta.total_states}`);
}

main().catch((err) => {
  console.error("❌ Generation failed:", err);
  process.exit(1);
});
