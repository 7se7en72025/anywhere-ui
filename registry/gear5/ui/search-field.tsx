"use client";

import { useId, useRef } from "react";
import { cn } from "../lib/cn";

export interface SearchFieldProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  clearLabel?: string;
  className?: string;
}

/**
 * `type="search"` (a real semantic distinct from `text` — some screen
 * readers announce it, and mobile keyboards show a search-specific return
 * key for it) with a clear button that returns focus to the field rather
 * than dropping it, so clearing does not strand a keyboard user.
 */
export function SearchField({ value, onChange, label, placeholder, clearLabel = "Clear search", className }: SearchFieldProps) {
  const id = useId();
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="search"
          value={value}
          placeholder={placeholder}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pe-9 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />
        {value && (
          <button
            type="button"
            aria-label={clearLabel}
            onClick={() => {
              onChange("");
              inputRef.current?.focus();
            }}
            className="absolute end-2 top-1/2 -translate-y-1/2 rounded p-1 text-neutral-400 hover:text-neutral-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:text-neutral-200"
          >
            <span aria-hidden="true">×</span>
          </button>
        )}
      </div>
    </div>
  );
}
