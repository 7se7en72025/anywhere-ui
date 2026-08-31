"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "../lib/cn";

export interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxProps {
  options: ComboboxOption[];
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

/**
 * A searchable single-select following the ARIA combobox pattern: real focus
 * stays on the text field the entire time, the listbox is controlled via
 * `aria-activedescendant`, and filtering uses `.includes()` on
 * locale-lowercased text rather than raw byte comparison — `toLowerCase()`
 * is locale-sensitive in a handful of scripts (Turkish dotless ı being the
 * classic case), so this always lowercases through the current locale.
 */
export function Combobox({ options, value, onChange, label, className }: ComboboxProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const listId = useId();

  const selected = options.find((o) => o.value === value);
  const filtered = useMemo(() => {
    const needle = query.toLocaleLowerCase();
    return options.filter((o) => o.label.toLocaleLowerCase().includes(needle));
  }, [options, query]);

  return (
    <div className={cn("relative flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={listId} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={listId}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${listId}-list`}
        aria-activedescendant={open && filtered[activeIndex] ? `${listId}-${filtered[activeIndex].value}` : undefined}
        value={open ? query : (selected?.label ?? "")}
        onFocus={() => {
          setOpen(true);
          setQuery("");
        }}
        onChange={(event) => setQuery(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            setActiveIndex((i) => Math.min(filtered.length - 1, i + 1));
          } else if (event.key === "ArrowUp") {
            event.preventDefault();
            setActiveIndex((i) => Math.max(0, i - 1));
          } else if (event.key === "Enter" && filtered[activeIndex]) {
            onChange(filtered[activeIndex].value);
            setOpen(false);
          } else if (event.key === "Escape") {
            setOpen(false);
          }
        }}
        onBlur={() => setOpen(false)}
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
      />
      {open && (
        <ul id={`${listId}-list`} role="listbox" aria-label={label} className="absolute top-full z-10 mt-1 max-h-56 w-full overflow-y-auto rounded-lg border border-neutral-200 bg-white p-1 shadow-lg dark:border-neutral-800 dark:bg-neutral-900">
          {filtered.map((option, index) => (
            <li
              key={option.value}
              id={`${listId}-${option.value}`}
              role="option"
              aria-selected={option.value === value}
              // onMouseDown, not onClick: fires before the input's onBlur closes the list.
              onMouseDown={(event) => {
                event.preventDefault();
                onChange(option.value);
                setOpen(false);
              }}
              className={cn("cursor-pointer rounded-md px-3 py-1.5 text-sm", index === activeIndex ? "bg-blue-600 text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-800")}
            >
              {option.label}
            </li>
          ))}
          {filtered.length === 0 && <li className="px-3 py-1.5 text-sm text-neutral-500">No matches</li>}
        </ul>
      )}
    </div>
  );
}
