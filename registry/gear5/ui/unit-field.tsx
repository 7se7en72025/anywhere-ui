"use client";

import { useId } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export type UnitSystem = "metric" | "imperial";

export interface UnitPair {
  /** Intl unit identifier for the metric side, e.g. "kilometer". */
  metric: string;
  /** Intl unit identifier for the imperial side, e.g. "mile". */
  imperial: string;
  /** Multiply a metric value by this to get the imperial one. */
  factor: number;
}

export const DISTANCE: UnitPair = { metric: "kilometer", imperial: "mile", factor: 0.621371 };
export const MASS: UnitPair = { metric: "kilogram", imperial: "pound", factor: 2.204623 };
export const TEMPERATURE: UnitPair = { metric: "celsius", imperial: "fahrenheit", factor: 1.8 };

/** Regions that measure in imperial units. Everywhere else is metric. */
const IMPERIAL_REGIONS = new Set(["US", "LR", "MM"]);

export interface UnitFieldProps {
  label: string;
  name: string;
  pair: UnitPair;
  /** Always stored and emitted in the metric unit, whatever is displayed. */
  value: number | null;
  onChange: (metricValue: number | null) => void;
  /** Override the system inferred from the locale's region. */
  system?: UnitSystem;
  className?: string;
}

/**
 * A measurement input displayed in the reader's units and stored in one.
 *
 * Showing kilometres to a US reader, or miles to everyone else, is a small,
 * constant tax on comprehension — and converting at the storage layer instead
 * produces two sources of truth that drift. This displays whichever unit the
 * locale's region uses, and always calls back with the metric value, so the
 * application only ever handles one unit.
 *
 * The unit name is rendered by `Intl.NumberFormat`'s `unit` style, so it is
 * translated and positioned by the locale rather than appended in English.
 */
export function UnitField({
  label,
  name,
  pair,
  value,
  onChange,
  system,
  className,
}: UnitFieldProps) {
  const id = useId();
  const { locale, direction } = useLocale();

  const region = new Intl.Locale(locale).maximize().region ?? "";
  const resolved = system ?? (IMPERIAL_REGIONS.has(region) ? "imperial" : "metric");
  const imperial = resolved === "imperial";

  const unit = imperial ? pair.imperial : pair.metric;
  const displayed = value === null ? "" : imperial ? value * pair.factor : value;

  const unitName =
    new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "long" })
      .formatToParts(1)
      .find((part) => part.type === "unit")?.value ?? unit;

  return (
    <div dir={direction} className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      <div className="flex items-center gap-2">
        <input
          id={id}
          name={name}
          inputMode="decimal"
          value={displayed}
          onChange={(event) => {
            const raw = event.target.value.trim();
            if (!raw) return onChange(null);

            const parsed = Number.parseFloat(raw);
            if (!Number.isFinite(parsed)) return;

            onChange(imperial ? parsed / pair.factor : parsed);
          }}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-base tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />

        {/* Part of the field's meaning, not decoration, so it stays in the
            accessible name rather than being hidden. */}
        <span className="shrink-0 text-sm text-neutral-600 dark:text-neutral-400">{unitName}</span>
      </div>
    </div>
  );
}
