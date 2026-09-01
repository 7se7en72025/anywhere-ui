"use client";

import { useId } from "react";
import { cn } from "../lib/cn";
import { Chip } from "./chip";

export interface MultiSelectOption {
  value: string;
  label: string;
}

export interface MultiSelectProps {
  options: MultiSelectOption[];
  value: string[];
  onChange: (value: string[]) => void;
  label: string;
  className?: string;
}

/**
 * Selected values render as removable chips above a native multi-select —
 * kept in the DOM as `sr-only`, not removed, so the whole control still
 * behaves like one real form field for label association, validation, and
 * assistive technology, while sighted users get chips instead of the
 * native multi-select's famously unusable rendering.
 */
export function MultiSelect({ options, value, onChange, label, className }: MultiSelectProps) {
  const id = useId();

  const toggle = (v: string) => {
    onChange(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((v) => (
            <Chip key={v} onRemove={() => toggle(v)}>
              {options.find((o) => o.value === v)?.label ?? v}
            </Chip>
          ))}
        </div>
      )}

      <select
        id={id}
        multiple
        value={value}
        onChange={(event) => onChange(Array.from(event.target.selectedOptions, (o) => o.value))}
        className="sr-only"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const selected = value.includes(option.value);
          return (
            <button
              key={option.value}
              type="button"
              aria-pressed={selected}
              onClick={() => toggle(option.value)}
              className={cn(
                "rounded-full border px-2.5 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                selected ? "border-blue-600 bg-blue-600 text-on-accent" : "border-neutral-300 dark:border-neutral-700",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
