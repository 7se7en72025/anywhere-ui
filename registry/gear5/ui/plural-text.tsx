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

  return <span suppressHydrationWarning>{text}</span>;
}
