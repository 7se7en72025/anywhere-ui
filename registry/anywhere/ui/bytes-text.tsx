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
    return <>{`${number} ${BINARY_SUFFIXES[index]}`}</>;
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
