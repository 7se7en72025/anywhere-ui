"use client";

import { useMemo } from "react";
import { useLocale } from "../lib/use-locale";

export interface PluralTextProps {
  count: number;
  /** Keyed by CLDR plural category. `other` is required; the rest fill in
   * only for locales that distinguish them — most of Europe never reaches
   * "few" or "many", but Arabic and Russian both do. */
  forms: Partial<Record<Intl.LDMLPluralRule, string>> & { other: string };
}

/**
 * Renders the grammatically correct plural form for `count` in the current
 * locale, via `Intl.PluralRules` — not the English "if count === 1" a
 * hardcoded ternary assumes, which is simply wrong for languages with three,
 * four, or six plural categories.
 *
 * `{n}` in a form string is replaced with the formatted count.
 */
export function PluralText({ count, forms }: PluralTextProps) {
  const { locale } = useLocale();

  const text = useMemo(() => {
    const rules = new Intl.PluralRules(locale);
    const category = rules.select(count) as Intl.LDMLPluralRule;
    const template = forms[category] ?? forms.other;
    return template.replace("{n}", new Intl.NumberFormat(locale).format(count));
  }, [count, forms, locale]);

  return <>{text}</>;
}
