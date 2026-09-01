"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "../lib/cn";
import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface CurrencyFieldProps {
  label: string;
  name: string;
  currency: string;
  /** Amount in major units. `null` when the field is empty. */
  value: number | null;
  onChange: (value: number | null) => void;
  description?: string;
  error?: string;
  required?: boolean;
  className?: string;
}

/**
 * Parse a number the way the locale writes it.
 *
 * `parseFloat("1.234,56")` returns 1.234 — a German user typing twelve hundred
 * euros gets charged one. There is no `Intl` parser, so the separators are
 * recovered from `formatToParts` of a known number and used to normalise the
 * input before parsing.
 */
function parseLocaleNumber(input: string, locale: string): number | null {
  const trimmed = input.trim();
  if (!trimmed) return null;

  const parts = numberFormat(locale).formatToParts(12345.6);
  const group = parts.find((part) => part.type === "group")?.value ?? ",";
  const decimal = parts.find((part) => part.type === "decimal")?.value ?? ".";

  // Strip everything that is not a digit, a sign, or the locale's own decimal
  // mark — including the group separator, currency symbols, and the
  // non-breaking spaces several locales use as separators.
  const normalised = trimmed
    .split(group)
    .join("")
    .replace(/\s/g, "")
    .replace(decimal, ".")
    .replace(/[^0-9.\-]/g, "");

  const parsed = Number.parseFloat(normalised);
  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * A money input that reads and writes the locale's own number format.
 *
 * While focused it shows raw, editable text — reformatting mid-typing fights
 * the caret and is the single most hated behaviour in currency inputs. On blur
 * it formats through `Intl.NumberFormat` with the given currency, so the
 * committed value is unambiguous. The parse step understands the locale's
 * group and decimal separators, which is what makes "1.234,56" mean what a
 * German user meant by it.
 *
 * `inputMode="decimal"` gets the numeric keypad on phones without the
 * spinner and scroll-to-change hazards of `type="number"`.
 */
export function CurrencyField({
  label,
  name,
  currency,
  value,
  onChange,
  description,
  error,
  required,
  className,
}: CurrencyFieldProps) {
  const id = useId();
  const { locale, direction } = useLocale();
  const [draft, setDraft] = useState<string | null>(null);

  const formatted = useMemo(
    () => (value === null ? "" : numberFormat(locale, { style: "currency", currency }).format(value)),
    [value, locale, currency],
  );

  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;
  const describedBy = cn(description && descriptionId, error && errorId) || undefined;

  return (
    <div dir={direction} className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {required && (
          <span className="ms-1 text-red-600 dark:text-red-400" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}

      <input
        id={id}
        name={name}
        inputMode="decimal"
        required={required}
        aria-required={required || undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        value={draft ?? formatted}
        onFocus={() => setDraft(value === null ? "" : String(value))}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={() => {
          onChange(draft === null ? value : parseLocaleNumber(draft, locale));
          setDraft(null);
        }}
        className={cn(
          "w-full rounded-md border bg-white px-3 py-2 text-start text-base tabular-nums dark:bg-neutral-950",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
          error ? "border-red-500" : "border-neutral-300 dark:border-neutral-700",
        )}
      />

      {error && (
        <p id={errorId} className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
