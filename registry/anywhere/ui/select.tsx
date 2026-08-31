"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  label: string;
  className?: string;
}

/**
 * A native `<select>`. Not a custom listbox: on a low-end Android phone the
 * platform picker is a full-screen, GPU-cheap native view, where a
 * from-scratch popup listbox is exactly the kind of layout-and-paint-heavy
 * DOM this library exists to avoid. It is also fully accessible for free, on
 * every platform, in every language, at zero bytes of extra code.
 */
export function Select({ value, onChange, options, label, className }: SelectProps) {
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
