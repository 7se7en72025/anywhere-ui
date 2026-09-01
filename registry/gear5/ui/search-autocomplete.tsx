"use client";

import { useId, useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface SearchResult {
  value: string;
  label: string;
  description?: string;
}

export interface SearchAutocompleteProps {
  results: SearchResult[];
  value: string;
  onChange: (value: string) => void;
  onSelect: (value: string) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

export function SearchAutocomplete({ results, value, onChange, onSelect, label, placeholder, className }: SearchAutocompleteProps) {
  const id = useId();
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    if (!value) return results;
    const needle = value.toLocaleLowerCase();
    return results.filter(
      (r) => r.label.toLocaleLowerCase().includes(needle) || r.description?.toLocaleLowerCase().includes(needle),
    );
  }, [results, value]);

  const select = (val: string) => {
    onSelect(val);
    setOpen(false);
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
        aria-activedescendant={open && filtered[activeIndex] ? `${listId}-${filtered[activeIndex].value}` : undefined}
        aria-autocomplete="list"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
          setActiveIndex(0);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown") {
            e.preventDefault();
            setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setActiveIndex((i) => Math.max(0, i - 1));
          } else if (e.key === "Enter" && filtered[activeIndex]) {
            e.preventDefault();
            select(filtered[activeIndex].value);
          } else if (e.key === "Escape") {
            setOpen(false);
          }
        }}
        onBlur={() => setOpen(false)}
        placeholder={placeholder}
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
      />
      {open && filtered.length > 0 && (
        <ul id={`${listId}-list`} role="listbox" aria-label={label} className="absolute top-full z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {filtered.map((result, index) => (
            <li
              key={result.value}
              id={`${listId}-${result.value}`}
              role="option"
              aria-selected={result.value === value}
              onMouseDown={(e) => {
                e.preventDefault();
                select(result.value);
              }}
              className={cn(
                "cursor-pointer rounded-md px-3 py-1.5 text-sm",
                index === activeIndex ? "bg-blue-600 text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              <div>{result.label}</div>
              {result.description && (
                <div className={cn("text-xs", index === activeIndex ? "text-blue-100" : "text-neutral-500 dark:text-neutral-400")}>
                  {result.description}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
      {open && value && filtered.length === 0 && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-lg border border-neutral-200 bg-white p-3 text-sm text-neutral-500 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          No results found
        </div>
      )}
    </div>
  );
}
