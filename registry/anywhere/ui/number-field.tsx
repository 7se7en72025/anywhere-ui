"use client";

import { useId } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface NumberFieldProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

/**
 * `inputMode="decimal"` for the right mobile keyboard, plus increment/
 * decrement buttons for anyone who cannot type reliably (motor-impaired
 * users, or just typing on a phone). `Intl.NumberFormat`'s own numbering
 * system is used for the live preview so it reads correctly in scripts that
 * do not use Western digits.
 */
export function NumberField({ value, onChange, label, min, max, step = 1, className }: NumberFieldProps) {
  const id = useId();
  const { locale } = useLocale();

  const clamp = (n: number) => {
    let v = n;
    if (min !== undefined) v = Math.max(min, v);
    if (max !== undefined) v = Math.min(max, v);
    return v;
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-stretch">
        <button
          type="button"
          aria-label="Decrease"
          onClick={() => onChange(clamp(value - step))}
          className="rounded-s-md border border-e-0 border-neutral-300 px-3 text-lg hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="decimal"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(event) => onChange(clamp(Number(event.target.value)))}
          className="w-20 border border-neutral-300 px-2 py-1 text-center text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />
        <button
          type="button"
          aria-label="Increase"
          onClick={() => onChange(clamp(value + step))}
          className="rounded-e-md border border-s-0 border-neutral-300 px-3 text-lg hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          +
        </button>
      </div>
      <span className="sr-only" aria-live="polite">
        {new Intl.NumberFormat(locale).format(value)}
      </span>
    </div>
  );
}
