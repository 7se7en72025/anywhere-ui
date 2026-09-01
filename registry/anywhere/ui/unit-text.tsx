"use client";

import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface UnitTextProps {
  value: number;
  /** A CLDR unit identifier, e.g. "kilometer", "megabyte", "celsius". */
  unit: string;
  unitDisplay?: "long" | "short" | "narrow";
}

/*
 * Rendered inside a `suppressHydrationWarning` span.
 *
 * `Intl` output is not byte-identical across ICU versions, and Node's ICU is
 * not the browser's. This exact call produces "Jan 1 <U+2009>–<U+2009> 5, 2026"
 * on Node and "Jan 1 <U+0020>–<U+0020> 5, 2026" in Chrome — visually
 * identical, different bytes — so every server-rendered use would throw a
 * hydration error in a consumer's app through no fault of theirs.
 *
 * This is the case React documents the escape hatch for. The suppression is
 * scoped to this one text node, so a genuine structural mismatch anywhere else
 * still reports normally.
 */

/**
 * "3.2 km" or "3,2 km" depending on locale decimal separator, via
 * `Intl.NumberFormat`'s unit style — the formatting most apps hand-roll with
 * a string template and a hardcoded unit label that never localises and
 * never gets the decimal comma right for the majority of the world that uses one.
 */
export function UnitText({ value, unit, unitDisplay = "short" }: UnitTextProps) {
  const { locale } = useLocale();
  return (
    <span suppressHydrationWarning>
      {numberFormat(locale, { style: "unit", unit, unitDisplay }).format(value)}
    </span>
  );
}
