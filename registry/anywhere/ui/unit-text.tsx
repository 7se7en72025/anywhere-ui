"use client";

import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface UnitTextProps {
  value: number;
  /** A CLDR unit identifier, e.g. "kilometer", "megabyte", "celsius". */
  unit: string;
  unitDisplay?: "long" | "short" | "narrow";
}

/**
 * "3.2 km" or "3,2 km" depending on locale decimal separator, via
 * `Intl.NumberFormat`'s unit style — the formatting most apps hand-roll with
 * a string template and a hardcoded unit label that never localises and
 * never gets the decimal comma right for the majority of the world that uses one.
 */
export function UnitText({ value, unit, unitDisplay = "short" }: UnitTextProps) {
  const { locale } = useLocale();
  return <>{numberFormat(locale, { style: "unit", unit, unitDisplay }).format(value)}</>;
}
