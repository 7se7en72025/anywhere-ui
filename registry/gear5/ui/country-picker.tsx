"use client";

import { useId, useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface CountryPickerProps {
  value: string;
  onChange: (code: string) => void;
  label: string;
  className?: string;
}

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸", dial: "+1" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧", dial: "+44" },
  { code: "IN", name: "India", flag: "🇮🇳", dial: "+91" },
  { code: "AU", name: "Australia", flag: "🇦🇺", dial: "+61" },
  { code: "JP", name: "Japan", flag: "🇯🇵", dial: "+81" },
  { code: "DE", name: "Germany", flag: "🇩🇪", dial: "+49" },
  { code: "FR", name: "France", flag: "🇫🇷", dial: "+33" },
  { code: "CN", name: "China", flag: "🇨🇳", dial: "+86" },
  { code: "BR", name: "Brazil", flag: "🇧🇷", dial: "+55" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", dial: "+27" },
  { code: "CA", name: "Canada", flag: "🇨🇦", dial: "+1" },
  { code: "MX", name: "Mexico", flag: "🇲🇽", dial: "+52" },
  { code: "KR", name: "South Korea", flag: "🇰🇷", dial: "+82" },
  { code: "IT", name: "Italy", flag: "🇮🇹", dial: "+39" },
  { code: "ES", name: "Spain", flag: "🇪🇸", dial: "+34" },
];

export function CountryPicker({ value, onChange, label, className }: CountryPickerProps) {
  const id = useId();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const selected = COUNTRIES.find((c) => c.code === value);

  const filtered = useMemo(() => {
    if (!query) return COUNTRIES;
    const needle = query.toLocaleLowerCase();
    return COUNTRIES.filter(
      (c) => c.name.toLocaleLowerCase().includes(needle) || c.code.toLocaleLowerCase().includes(needle) || c.dial.includes(query),
    );
  }, [query]);

  const select = (code: string) => {
    onChange(code);
    setOpen(false);
    setQuery("");
  };

  return (
    <div className={cn("relative flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        ref={inputRef}
        id={id}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${listId}-list`}
        aria-activedescendant={open && filtered[activeIndex] ? `${listId}-${filtered[activeIndex].code}` : undefined}
        value={open ? query : (selected ? `${selected.flag} ${selected.name} (${selected.dial})` : "")}
        onFocus={() => setOpen(true)}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(0, i - 1));
          } else if (e.key === "Enter" && filtered[activeIndex]) {
            select(filtered[activeIndex].code);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        onBlur={() => setOpen(false)}
        placeholder="Search countries..."
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
      />
      {open && (
        <ul id={`${listId}-list`} role="listbox" aria-label="Countries" className="absolute top-full z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {filtered.map((country, index) => (
            <li
              key={country.code}
              id={`${listId}-${country.code}`}
              role="option"
              aria-selected={country.code === value}
              onMouseDown={(e) => {
                e.preventDefault();
                select(country.code);
              }}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1.5 text-sm",
                index === activeIndex ? "bg-blue-600 text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              {country.flag} {country.name} ({country.dial})
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="px-3 py-1.5 text-sm text-neutral-500">No countries found</li>
          )}
        </ul>
      )}
    </div>
  );
}
