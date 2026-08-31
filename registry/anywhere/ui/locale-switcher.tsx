"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface LocaleOption {
  tag: string;
  /** The language's own name for itself — "Português", not "Portuguese". */
  nativeName: string;
}

export interface LocaleSwitcherProps {
  options: LocaleOption[];
  value: string;
  onChange: (tag: string) => void;
  label?: string;
  className?: string;
}

/**
 * A native `<select>`, deliberately not a custom dropdown: this is the one
 * control every platform already has a fully localised, fully accessible,
 * fully keyboard- and touch-native implementation of, including on the
 * lowest-end devices this library is built for. Each option's `lang`
 * attribute matches its own tag so a screen reader can switch pronunciation
 * per option rather than reading every name in the page's base language.
 */
export function LocaleSwitcher({ options, value, onChange, label = "Language", className }: LocaleSwitcherProps) {
  const id = useId();

  return (
    <div className={cn("inline-flex flex-col gap-1", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="rounded-md border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        {options.map((option) => (
          <option key={option.tag} value={option.tag} lang={option.tag}>
            {option.nativeName}
          </option>
        ))}
      </select>
    </div>
  );
}
