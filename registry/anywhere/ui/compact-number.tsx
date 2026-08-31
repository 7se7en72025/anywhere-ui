"use client";

import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface CompactNumberProps {
  value: number;
  /**
   * "short" gives 1.2K, "long" gives 1.2 thousand. Both are locale-specific:
   * the same number is 1.2万 in Japanese, which groups by ten-thousands, and
   * 12 lakh in Indian English, which groups by lakhs and crores.
   */
  notation?: "short" | "long";
  /** Announce the exact value to assistive tech alongside the rounded one. */
  exactLabel?: boolean;
}

/**
 * A large number shortened the way the reader's locale actually shortens it.
 *
 * Hand-rolled `n > 1000 ? (n / 1000) + "K"` is wrong for most of the world:
 * East Asian locales group by 10,000, and Indian locales by lakh and crore, so
 * a "K/M/B" ladder produces numbers a reader has to mentally convert.
 *
 * The rounded text is what sighted readers see; the exact value goes to screen
 * readers through the title/aria pair, because "1.2K followers" is a summary
 * and "1,234 followers" is the fact.
 */
export function CompactNumber({ value, notation = "short", exactLabel = true }: CompactNumberProps) {
  const { locale } = useLocale();

  const compact = numberFormat(locale, {
    notation: "compact",
    compactDisplay: notation,
    maximumFractionDigits: 1,
  }).format(value);

  const exact = numberFormat(locale).format(value);

  if (!exactLabel || compact === exact) return <>{compact}</>;

  return (
    <span title={exact}>
      <span aria-hidden="true">{compact}</span>
      <span className="sr-only">{exact}</span>
    </span>
  );
}
