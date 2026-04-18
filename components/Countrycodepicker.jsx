"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const CountryCodePicker = ({ countries = [], isLoading = false, value, onChange, id }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const listRef = useRef(null);
  const searchRef = useRef(null);
  const itemRefs = useRef([]);

  const selected = countries.find((country) => country.dialCode === value);

  const filtered = countries.filter(
    (country) =>
      country.name.toLowerCase().includes(search.toLowerCase()) ||
      country.dialCode.includes(search) ||
      country.code.toLowerCase().includes(search.toLowerCase()),
  );

  const handleOpenChange = (nextOpen) => {
    if (nextOpen) {
      setSearch("");
      setHighlightIndex(0);
    }

    setOpen(nextOpen);
  };

  useEffect(() => {
    if (open && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex].scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex, open]);

  const selectCountry = (country) => {
    onChange(country.dialCode);
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (event) => {
    if (!open) {
      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setHighlightIndex((previous) => (previous < filtered.length - 1 ? previous + 1 : 0));
        break;
      case "ArrowUp":
        event.preventDefault();
        setHighlightIndex((previous) => (previous > 0 ? previous - 1 : filtered.length - 1));
        break;
      case "Enter":
        event.preventDefault();
        if (filtered[highlightIndex]) {
          selectCountry(filtered[highlightIndex]);
        }
        break;
      case "Escape":
        event.preventDefault();
        setOpen(false);
        break;
      case "Home":
        event.preventDefault();
        setHighlightIndex(0);
        break;
      case "End":
        event.preventDefault();
        setHighlightIndex(filtered.length - 1);
        break;
      default:
        break;
    }
  };

  const activeDescendant = filtered[highlightIndex]?.code ? `country-option-${filtered[highlightIndex].code}` : undefined;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="country-code-listbox"
          aria-label={selected ? `Country code: ${selected.name} ${selected.dialCode}` : "Select country code"}
          className="flex h-9 w-27.5 cursor-pointer items-center gap-1.5 rounded-md border bg-background px-2 text-sm transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : selected ? (
            <>
              <Image
                src={selected.flag}
                alt=""
                width={20}
                height={16}
                aria-hidden="true"
                unoptimized
                className="h-4 w-5 rounded-sm object-cover"
              />
              <span className="font-medium">{selected.dialCode}</span>
            </>
          ) : (
            <span className="text-muted-foreground">{value || "Code"}</span>
          )}
          <ChevronDown
            className={`ml-auto h-3.5 w-3.5 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>

      <PopoverContent
        className="w-70 p-0"
        align="start"
        onKeyDown={handleKeyDown}
        onOpenAutoFocus={(event) => {
          event.preventDefault();
          searchRef.current?.focus();
        }}
      >
        <div className="border-b p-2">
          <Input
            ref={searchRef}
            placeholder="Search country or code..."
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setHighlightIndex(0);
            }}
            className="h-8"
            type="search"
            aria-label="Search countries"
            aria-controls="country-code-listbox"
            aria-activedescendant={activeDescendant}
            autoComplete="off"
          />
        </div>

        <div ref={listRef} id="country-code-listbox" role="listbox" aria-label="Country codes" className="max-h-50 overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-3 py-6">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading countries...</span>
            </div>
          ) : filtered.length === 0 ? (
            <p className="px-3 py-6 text-center text-sm text-muted-foreground" role="status">
              No countries found for &ldquo;{search}&rdquo;
            </p>
          ) : (
            filtered.map((country, index) => {
              const isHighlighted = index === highlightIndex;
              const isSelected = value === country.dialCode;

              return (
                <button
                  key={country.code}
                  ref={(element) => {
                    itemRefs.current[index] = element;
                  }}
                  id={`country-option-${country.code}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={`${country.name} ${country.dialCode}`}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm transition-colors
                    ${isHighlighted ? "bg-accent" : ""}
                    ${isSelected ? "font-medium" : ""}
                    ${!isHighlighted ? "hover:bg-accent/50" : ""}
                  `}
                  onClick={() => selectCountry(country)}
                  onMouseEnter={() => setHighlightIndex(index)}
                >
                  <Image
                    src={country.flag}
                    alt=""
                    width={20}
                    height={16}
                    aria-hidden="true"
                    unoptimized
                    className="h-4 w-5 rounded-sm object-cover"
                  />
                  <span className="flex-1 truncate text-left">{country.name}</span>
                  <span className="tabular-nums text-muted-foreground">{country.dialCode}</span>
                </button>
              );
            })
          )}
        </div>

        {!isLoading ? (
          <div className="sr-only" role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "country" : "countries"} available
          </div>
        ) : null}
      </PopoverContent>
    </Popover>
  );
};

export default CountryCodePicker;
