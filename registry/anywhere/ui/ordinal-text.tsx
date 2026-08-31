"use client";

import { useMemo } from "react";
import { useLocale } from "../lib/use-locale";

export interface OrdinalTextProps {
  value: number;
  /**
   * Suffixes keyed by CLDR ordinal category. Only needed for locales whose
   * ordinals are suffix-based, like English's st/nd/rd/th. Locales that form
   * ordinals differently fall back to the plain number, which is correct —
   * appending "th" to a Japanese numeral is worse than appending nothing.
   */
  suffixes?: Partial<Record<Intl.LDMLPluralRule, string>>;
}

const ENGLISH_SUFFIXES: Partial<Record<Intl.LDMLPluralRule, string>> = {
  one: "st",
  two: "nd",
  few: "rd",
  other: "th",
};

/**
 * An ordinal — 1st, 2nd, 3rd — using `Intl.PluralRules` in ordinal mode.
 *
 * The rule is not "1 → st, 2 → nd, 3 → rd, everything else → th": 11th, 12th
 * and 13th break it, and so does every locale that does not build ordinals by
 * suffix at all. `Intl.PluralRules` knows both.
 */
export function OrdinalText({ value, suffixes }: OrdinalTextProps) {
  const { locale } = useLocale();

  const text = useMemo(() => {
    const number = new Intl.NumberFormat(locale).format(value);
    const table = suffixes ?? (locale.startsWith("en") ? ENGLISH_SUFFIXES : undefined);
    if (!table) return number;

    const category = new Intl.PluralRules(locale, { type: "ordinal" }).select(value);
    return `${number}${table[category] ?? ""}`;
  }, [locale, value, suffixes]);

  return <>{text}</>;
}
