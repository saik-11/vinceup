"use client";

/**
 * LocationPicker — Country → State → City compound picker.
 *
 * Usage (uncontrolled via react-hook-form, or controlled):
 *
 *   <LocationPicker
 *     value={{ country: "India", state: "Andhra Pradesh", city: "Visakhapatnam" }}
 *     onChange={({ country, state, city }) => { ... }}
 *   />
 *
 *   // Individual pickers are also exported for flexible usage:
 *   <CountrySelect ... />
 *   <StateSelect  ... />
 *   <CitySelect   ... />
 */

import { useEffect, useRef, useState, useCallback, useId } from "react";
import { ChevronDown, Loader2, AlertCircle, RefreshCw, Search, Check } from "lucide-react";
import { useCountryList, useStateList, useCityList } from "@/lib/api/useLocationData";
import { cn } from "@/lib/utils";

// ─────────────────────────────────────────────────────────────────────────────
// Generic searchable dropdown
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {{
 *   id?: string;
 *   value: string | null;
 *   onChange: (value: string) => void;
 *   options: { id: number | string; name: string; meta?: string }[];
 *   placeholder?: string;
 *   isLoading?: boolean;
 *   error?: string | null;
 *   onRetry?: () => void;
 *   disabled?: boolean;
 *   listboxId?: string;
 * }} props
 */
function SearchableDropdown({
  id,
  value,
  onChange,
  options,
  placeholder = "Select…",
  isLoading = false,
  error = null,
  onRetry,
  disabled = false,
  listboxId,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const searchRef = useRef(null);
  const itemRefs = useRef([]);
  const containerRef = useRef(null);
  const uid = useId();
  const lbId = listboxId ?? `lb-${uid}`;

  const selected = options.find((o) => o.name === value);

  const filtered = options.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()));

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (open && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex].scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex, open]);

  const handleOpenChange = useCallback(
    (next) => {
      if (disabled || isLoading) return;
      if (next) {
        setSearch("");
        setHighlightIndex(0);
      }
      setOpen(next);
    },
    [disabled, isLoading],
  );

  const selectItem = useCallback(
    (item) => {
      onChange(item.name);
      setOpen(false);
      setSearch("");
    },
    [onChange],
  );

  const handleKeyDown = (e) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOpenChange(true);
      }
      return;
    }

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((p) => (p < filtered.length - 1 ? p + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((p) => (p > 0 ? p - 1 : filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightIndex]) selectItem(filtered[highlightIndex]);
        break;
      case "Escape":
        e.preventDefault();
        setOpen(false);
        break;
      case "Home":
        e.preventDefault();
        setHighlightIndex(0);
        break;
      case "End":
        e.preventDefault();
        setHighlightIndex(filtered.length - 1);
        break;
      default:
        break;
    }
  };

  const activeDescendant = filtered[highlightIndex]
    ? `${lbId}-opt-${filtered[highlightIndex].id}`
    : undefined;

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-controls={lbId}
        aria-label={selected ? selected.name : placeholder}
        aria-disabled={disabled || isLoading}
        disabled={disabled || isLoading}
        onKeyDown={handleKeyDown}
        onClick={() => handleOpenChange(!open)}
        className={cn(
          "flex h-9 w-full items-center gap-2 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "dark:bg-input/30",
          disabled || isLoading
            ? "cursor-not-allowed opacity-50"
            : "cursor-pointer hover:bg-accent",
        )}
      >
        {isLoading ? (
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-muted-foreground" />
        ) : error ? (
          <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
        ) : (
          <span className={cn("flex-1 truncate text-left", !selected && "text-muted-foreground")}>
            {selected ? selected.name : placeholder}
          </span>
        )}

        {error && onRetry ? (
          <button
            type="button"
            title="Retry"
            aria-label="Retry loading"
            onClick={(e) => {
              e.stopPropagation();
              onRetry();
            }}
            className="ml-auto flex h-5 w-5 shrink-0 items-center justify-center rounded text-muted-foreground hover:text-foreground"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </button>
        ) : (
          <ChevronDown
            aria-hidden="true"
            className={cn(
              "ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className={cn(
            "absolute z-50 mt-1 w-[min(24rem,calc(100vw-2rem))] min-w-full overflow-hidden rounded-md border border-border bg-popover shadow-md",
            "animate-in fade-in-0 zoom-in-95 duration-100",
          )}
          role="presentation"
        >
          {/* Search */}
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Search className="h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-hidden="true" />
            <input
              ref={searchRef}
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setHighlightIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search…"
              aria-label={`Search ${placeholder}`}
              aria-controls={lbId}
              aria-activedescendant={activeDescendant}
              autoFocus
              autoComplete="off"
              className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
          </div>

          {/* List */}
          <ul
            id={lbId}
            role="listbox"
            aria-label={placeholder}
            className="max-h-52 overflow-y-auto overscroll-contain p-1"
          >
            {filtered.length === 0 ? (
              <li
                role="option"
                aria-selected="false"
                className="px-3 py-6 text-center text-sm text-muted-foreground"
              >
                No results for &ldquo;{search}&rdquo;
              </li>
            ) : (
              filtered.map((item, idx) => {
                const isHighlighted = idx === highlightIndex;
                const isSelected = value === item.name;

                return (
                  <li
                    key={item.id}
                    ref={(el) => {
                      itemRefs.current[idx] = el;
                    }}
                    id={`${lbId}-opt-${item.id}`}
                    role="option"
                    aria-selected={isSelected}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      selectItem(item);
                    }}
                    onMouseEnter={() => setHighlightIndex(idx)}
                    className={cn(
                      "flex w-full cursor-pointer items-center gap-2 rounded-sm px-2.5 py-1.5 text-sm transition-colors",
                      isHighlighted && "bg-accent text-accent-foreground",
                      !isHighlighted && "hover:bg-accent/50",
                    )}
                  >
                    {item.flag && (
                      <span aria-hidden="true" className="shrink-0 text-base leading-none">
                        {item.flag}
                      </span>
                    )}
                    <span className="flex-1 whitespace-normal break-words">{item.name}</span>
                    {item.meta && (
                      <span className="shrink-0 tabular-nums text-xs text-muted-foreground">
                        {item.meta}
                      </span>
                    )}
                    {isSelected && (
                      <Check className="ml-auto h-3.5 w-3.5 shrink-0 text-primary" aria-hidden="true" />
                    )}
                  </li>
                );
              })
            )}
          </ul>

          {/* Screen reader live region */}
          <div role="status" aria-live="polite" className="sr-only">
            {filtered.length} option{filtered.length !== 1 && "s"} available
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Individual pickers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @param {{ id?: string; value: string|null; onChange: (v:string)=>void; placeholder?: string; disabled?: boolean }} props
 */
export function CountrySelect({ id, value, onChange, placeholder = "Select country", disabled = false }) {
  const countries = useCountryList();

  const options = countries.map((c) => ({
    id: c.id,
    name: c.name,
    flag: c.flag,
    meta: c.iso2,
  }));

  return (
    <SearchableDropdown
      id={id}
      value={value}
      onChange={onChange}
      options={options}
      placeholder={placeholder}
      disabled={disabled}
      listboxId="location-country-listbox"
    />
  );
}

/**
 * @param {{ id?: string; countryName: string|null; value: string|null; onChange: (v:string)=>void; placeholder?: string; disabled?: boolean }} props
 */
export function StateSelect({
  id,
  countryName,
  value,
  onChange,
  placeholder = "Select state / province",
  disabled = false,
}) {
  const states = useStateList(countryName);

  const isDisabled = disabled || !countryName;

  return (
    <SearchableDropdown
      id={id}
      value={value}
      onChange={onChange}
      options={states}
      placeholder={!countryName ? "Select a country first" : placeholder}
      disabled={isDisabled}
      listboxId="location-state-listbox"
    />
  );
}

/**
 * @param {{ id?: string; countryName: string|null; stateName: string|null; value: string|null; onChange: (v:string)=>void; placeholder?: string; disabled?: boolean }} props
 */
export function CitySelect({
  id,
  countryName,
  stateName,
  value,
  onChange,
  placeholder = "Select city",
  disabled = false,
}) {
  const { cities, isLoading, error, retry } = useCityList(countryName, stateName);

  const isDisabled = disabled || !stateName || !countryName;

  let resolvedPlaceholder = placeholder;
  if (!countryName) resolvedPlaceholder = "Select a country first";
  else if (!stateName) resolvedPlaceholder = "Select a state first";
  else if (isLoading) resolvedPlaceholder = "Loading cities…";
  else if (error) resolvedPlaceholder = "Failed to load cities";

  return (
    <div className="space-y-1">
      <SearchableDropdown
        id={id}
        value={value}
        onChange={onChange}
        options={cities}
        placeholder={resolvedPlaceholder}
        isLoading={isLoading}
        error={error}
        onRetry={retry}
        disabled={isDisabled}
        listboxId="location-city-listbox"
      />
      {error && (
        <p className="flex items-center gap-1.5 text-xs text-destructive" role="alert">
          <AlertCircle className="h-3 w-3 shrink-0" aria-hidden="true" />
          {error}
          <button
            type="button"
            onClick={retry}
            className="underline underline-offset-2 hover:no-underline"
          >
            Retry
          </button>
        </p>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Compound LocationPicker
// ─────────────────────────────────────────────────────────────────────────────

/**
 * @typedef {{ country: string|null; state: string|null; city: string|null }} LocationValue
 *
 * @param {{
 *   value?: LocationValue;
 *   onChange?: (value: LocationValue) => void;
 *   labels?: { country?: string; state?: string; city?: string };
 *   placeholders?: { country?: string; state?: string; city?: string };
 *   disabled?: boolean;
 *   className?: string;
 *   ids?: { country?: string; state?: string; city?: string };
 * }} props
 */
export function LocationPicker({
  value: externalValue,
  onChange,
  labels = {},
  placeholders = {},
  disabled = false,
  className,
  ids = {},
}) {
  const [internal, setInternal] = useState({
    country: externalValue?.country ?? null,
    state: externalValue?.state ?? null,
    city: externalValue?.city ?? null,
  });

  const isControlled = externalValue !== undefined;
  const currentCountry = isControlled ? (externalValue.country ?? null) : internal.country;
  const currentState = isControlled ? (externalValue.state ?? null) : internal.state;
  const currentCity = isControlled ? (externalValue.city ?? null) : internal.city;

  const commitChange = useCallback(
    (next) => {
      if (!isControlled) setInternal(next);
      onChange?.(next);
    },
    [isControlled, onChange],
  );

  const handleCountryChange = useCallback(
    (country) => {
      const next = { country, state: null, city: null };
      commitChange(next);
    },
    [commitChange],
  );

  const handleStateChange = useCallback(
    (state) => {
      const next = { country: currentCountry, state, city: null };
      commitChange(next);
    },
    [commitChange, currentCountry],
  );

  const handleCityChange = useCallback(
    (city) => {
      const next = { country: currentCountry, state: currentState, city };
      commitChange(next);
    },
    [commitChange, currentCountry, currentState],
  );

  return (
    <div className={cn("grid grid-cols-1 gap-4 sm:grid-cols-3", className)}>
      {/* Country */}
      <div className="space-y-1.5">
        {labels.country !== null && (
          <label
            htmlFor={ids.country ?? "location-country"}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {labels.country ?? "Country"}
          </label>
        )}
        <CountrySelect
          id={ids.country ?? "location-country"}
          value={currentCountry}
          onChange={handleCountryChange}
          placeholder={placeholders.country}
          disabled={disabled}
        />
      </div>

      {/* State */}
      <div className="space-y-1.5">
        {labels.state !== null && (
          <label
            htmlFor={ids.state ?? "location-state"}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {labels.state ?? "State / Province"}
          </label>
        )}
        <StateSelect
          id={ids.state ?? "location-state"}
          countryName={currentCountry}
          value={currentState}
          onChange={handleStateChange}
          placeholder={placeholders.state}
          disabled={disabled}
        />
      </div>

      {/* City */}
      <div className="space-y-1.5">
        {labels.city !== null && (
          <label
            htmlFor={ids.city ?? "location-city"}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {labels.city ?? "City"}
          </label>
        )}
        <CitySelect
          id={ids.city ?? "location-city"}
          countryName={currentCountry}
          stateName={currentState}
          value={currentCity}
          onChange={handleCityChange}
          placeholder={placeholders.city}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

export default LocationPicker;
