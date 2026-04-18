import { useQuery } from "@tanstack/react-query";
import axios from "axios";

// ─── Fetch + Transform ───
const fetchCountries = async () => {
  const { data } = await axios.get("https://restcountries.com/v3.1/all?fields=name,idd,cca2,flags");

  return data
    .map((c) => {
      const dialCode = c.idd?.root && c.idd?.suffixes?.length ? `${c.idd.root}${c.idd.suffixes[0]}` : null;

      return {
        name: c.name.common,
        code: c.cca2,
        dialCode,
        flag: c.flags?.svg || c.flags?.png,
      };
    })
    .filter((c) => c.dialCode) // drop entries without a dial code
    .sort((a, b) => a.name.localeCompare(b.name));
};

// ─── Hook ───
export const useCountries = () => {
  return useQuery({
    queryKey: ["countries"],
    queryFn: fetchCountries,
    staleTime: Infinity, // country list doesn't change mid-session
    gcTime: 1000 * 60 * 60, // cache for 1 hour
  });
};
