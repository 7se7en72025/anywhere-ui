"use client";

import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface BytesTextProps {
  bytes: number;
  /**
   * Decimal (1000-based, "MB") is what storage vendors, browsers, and most
   * user-facing UI mean. Binary (1024-based, "MiB") is what filesystems mean.
   * Picking one silently is how a 500 MB file becomes "477 MB" in your UI.
   */
  base?: "decimal" | "binary";
  maximumFractionDigits?: number;
}

const DECIMAL_UNITS = ["byte", "kilobyte", "megabyte", "gigabyte", "terabyte"] as const;
const BINARY_SUFFIXES = ["B", "KiB", "MiB", "GiB", "TiB"] as const;

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
 * A file size in the reader's locale.
 *
 * Decimal sizes go through `Intl.NumberFormat`'s `unit` style, so the unit is
 * translated and positioned by the locale — "1.5 Mo" in French, "١٫٥ ميغابايت"
 * in Arabic — rather than an English "MB" glued on after a formatted number.
 *
 * Binary units have no CLDR translations, so they stay as the IEC symbols they
 * are; only the number is localised.
 */
export function BytesText({ bytes, base = "decimal", maximumFractionDigits = 1 }: BytesTextProps) {
  const { locale } = useLocale();

  const step = base === "binary" ? 1024 : 1000;
  const magnitude = bytes === 0 ? 0 : Math.floor(Math.log(Math.abs(bytes)) / Math.log(step));
  const index = Math.min(Math.max(magnitude, 0), DECIMAL_UNITS.length - 1);
  const scaled = bytes / step ** index;

  if (base === "binary") {
    const number = numberFormat(locale, { maximumFractionDigits }).format(scaled);
    return <span suppressHydrationWarning>{`${number} ${BINARY_SUFFIXES[index]}`}</span>;
  }

  return (
    <>
      {numberFormat(locale, {
        style: "unit",
        unit: DECIMAL_UNITS[index],
        unitDisplay: "short",
        maximumFractionDigits,
      }).format(scaled)}
    </>
  );
}
