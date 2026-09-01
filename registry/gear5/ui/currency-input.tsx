"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "../lib/cn";

export interface CurrencyInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  label: string;
  currency?: string;
  locale?: string;
  className?: string;
}

function parseLocaleNumber(input: string, locale: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = new Intl.NumberFormat(locale, { style: "currency", currency: "USD" }).formatToParts(12345.6);
  const group = parts.find((p) => p.type === "group")?.value ?? ",";
  const decimal = parts.find((p) => p.type === "decimal")?.value ?? ".";

  const normalised = trimmed
    .split(group).join("")
    .replace(/\s/g, "")
    .replace(decimal, ".")
    .replace(/[^0-9.\-]/g, "");

  const parsed = Number.parseFloat(normalised);
  return Number.isFinite(parsed) ? parsed : null;
}

export function CurrencyInput({ value, onChange, label, currency = "USD", locale = "en-US", className }: CurrencyInputProps) {
  const id = useId();
  const [draft, setDraft] = useState<string | null>(null);

  const formatted = useMemo(() => {
    if (value === null) return "";
    return new Intl.NumberFormat(locale, { style: "currency", currency }).format(value);
  }, [value, locale, currency]);

  const symbol = useMemo(() => {
    const parts = new Intl.NumberFormat(locale, { style: "currency", currency }).formatToParts(0);
    return parts.find((p) => p.type === "currency")?.value ?? currency;
  }, [locale, currency]);

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <span className="absolute start-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 dark:text-neutral-400" aria-hidden="true">
          {symbol}
        </span>
        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={draft ?? formatted}
          onFocus={() => setDraft(value === null ? "" : String(value))}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={() => {
            onChange(draft === null ? value : parseLocaleNumber(draft, locale));
            setDraft(null);
          }}
          aria-label={`${label} in ${currency}`}
          className="w-full rounded-md border border-neutral-300 bg-white ps-8 pe-3 py-2 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Currency: {currency}
      </p>
    </div>
  );
}
