"use client";

import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface CurrencyTextProps {
  /** Amount in the currency's minor unit's base — i.e. 12.5 means $12.50. */
  value: number;
  /** ISO 4217 code, e.g. "USD", "INR", "JPY". */
  currency: string;
}

/**
 * `$12.50`, `₹12.50`, or `¥13` depending on locale and currency, with the
 * right number of decimal places for each — `Intl.NumberFormat` already knows
 * yen has none and Bahraini dinar has three; a hand-rolled formatter reliably
 * gets this wrong for the currencies that are not USD.
 */
export function CurrencyText({ value, currency }: CurrencyTextProps) {
  const { locale } = useLocale();
  return <>{numberFormat(locale, { style: "currency", currency }).format(value)}</>;
}
