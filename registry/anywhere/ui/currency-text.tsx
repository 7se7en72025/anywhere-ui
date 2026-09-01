"use client";

import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface CurrencyTextProps {
  /** Amount in the currency's minor unit's base — i.e. 12.5 means $12.50. */
  value: number;
  /** ISO 4217 code, e.g. "USD", "INR", "JPY". */
  currency: string;
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
 * `$12.50`, `₹12.50`, or `¥13` depending on locale and currency, with the
 * right number of decimal places for each — `Intl.NumberFormat` already knows
 * yen has none and Bahraini dinar has three; a hand-rolled formatter reliably
 * gets this wrong for the currencies that are not USD.
 */
export function CurrencyText({ value, currency }: CurrencyTextProps) {
  const { locale } = useLocale();
  return (
    <span suppressHydrationWarning>
      {numberFormat(locale, { style: "currency", currency }).format(value)}
    </span>
  );
}
