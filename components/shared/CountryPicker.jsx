"use client";

import { ChevronDown, Loader2 } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";


const CountryPicker = ({ countries = [], isLoading = false, value, onChange, id, placeholder = "Select country" }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIndex, setHighlightIndex] = useState(0);

  const searchRef = useRef(null);
  const itemRefs = useRef([]);

  const selected = countries.find((c) => c.name === value);

  const filtered = countries.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.code.toLowerCase().includes(search.toLowerCase()));

  const handleOpenChange = (next) => {
    if (next) {
      setSearch("");
      setHighlightIndex(0);
    }
    setOpen(next);
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (open && itemRefs.current[highlightIndex]) {
      itemRefs.current[highlightIndex].scrollIntoView({ block: "nearest" });
    }
  }, [highlightIndex, open]);

  const selectCountry = (country) => {
    onChange(country.name);
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e) => {
    if (!open) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1));
        break;
      case "Enter":
        e.preventDefault();
        if (filtered[highlightIndex]) {
          selectCountry(filtered[highlightIndex]);
        }
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

  const activeDescendant = filtered[highlightIndex]?.code ? `country-name-option-${filtered[highlightIndex].code}` : undefined;

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          id={id}
          role="combobox"
          aria-expanded={open}
          aria-haspopup="listbox"
          aria-controls="country-name-listbox"
          aria-label={selected ? `Country: ${selected.name}` : placeholder}
          className="flex h-9 w-full items-center gap-2 rounded-md bg-transparent dark:bg-input/30 border border-input px-2.5 text-sm shadow-xs transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
          ) : selected ? (
            <>
              <Image src={selected.flag} alt="" width={20} height={16} aria-hidden="true" unoptimized className="h-4 w-5 shrink-0 rounded-sm object-cover" />
              <span className="flex-1 truncate text-left">{selected.name}</span>
            </>
          ) : (
            <span className="flex-1 text-left text-muted-foreground">{placeholder}</span>
          )}
          <ChevronDown className={`ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-70 p-0 dark:bg-gray-900"
        align="start"
        onKeyDown={handleKeyDown}
        onOpenAutoFocus={(e) => {
          e.preventDefault();
          searchRef.current?.focus();
        }}
      >
        {/* Search */}
        <div className="border-b p-2">
          <Input
            ref={searchRef}
            placeholder="Search country…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setHighlightIndex(0);
            }}
            className="h-8"
            type="search"
            aria-label="Search countries"
            aria-controls="country-name-listbox"
            aria-activedescendant={activeDescendant}
            autoComplete="off"
          />
        </div>

        {/* List */}
        <div id="country-name-listbox" role="listbox" aria-label="Countries" className="max-h-50 overflow-y-auto p-1">
          {isLoading ? (
            <div className="flex items-center justify-center gap-2 px-3 py-6">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Loading countries…</span>
            </div>
          ) : filtered.length === 0 ? (
            // biome-ignore lint/a11y/useSemanticElements: explanation
            <p className="px-3 py-6 text-center text-sm text-muted-foreground" role="status">
              No countries found for &ldquo;{search}&rdquo;
            </p>
          ) : (
            filtered.map((c, index) => {
              const isHighlighted = index === highlightIndex;
              const isSelected = value === c.name;

              return (
                <button
                  key={c.code}
                  ref={(el) => {
                    itemRefs.current[index] = el;
                  }}
                  id={`country-name-option-${c.code}`}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  aria-label={c.name}
                  className={`flex w-full items-center gap-2.5 rounded-md px-2.5 py-1.5 text-sm cursor-pointer transition-colors
                    ${isHighlighted ? "bg-accent" : ""}
                    ${isSelected ? "font-medium" : ""}
                    ${!isHighlighted ? "hover:bg-accent/50" : ""}
                  `}
                  onClick={() => selectCountry(c)}
                  onMouseEnter={() => setHighlightIndex(index)}
                >
                  <Image src={c.flag} alt="" width={20} height={16} aria-hidden="true" unoptimized className="h-4 w-5 shrink-0 rounded-sm object-cover" />
                  <span className="flex-1 text-left truncate">{c.name}</span>
                </button>
              );
            })
          )}
        </div>

        {/* Status for screen readers */}
        {!isLoading && (
          // biome-ignore lint/a11y/useSemanticElements: explanation
          <div className="sr-only" role="status" aria-live="polite">
            {filtered.length} {filtered.length === 1 ? "country" : "countries"} available
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default CountryPicker;
