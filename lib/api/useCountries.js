/**
 * useCountries — backward-compatible shim.
 *
 * Previously fetched country data from restcountries.com on every page load.
 * Now sources from the local bundled JSON (`data/location-data.json`) via
 * `useLocationData`, which is zero-latency and works fully offline.
 *
 * The returned shape is identical to the old hook:
 *   { name, code (iso2), dialCode, flag }
 *
 * Existing usages of `useCountries` need no changes.
 */

import { COUNTRIES_FLAT } from "@/lib/api/useLocationData";

/**
 * Returns the pre-computed country list.
 * Mimics the `useQuery` return shape so call-sites can adopt the new hook
 * (`useCountryList`) incrementally without breaking anything.
 */
export const useCountries = () => ({
  data: COUNTRIES_FLAT,
  isLoading: false,
  isError: false,
  error: null,
});
