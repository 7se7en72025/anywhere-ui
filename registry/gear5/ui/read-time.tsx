"use client";

import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface ReadTimeProps {
  /** Word count, or character count for languages that do not space-separate. */
  words: number;
  /**
   * Words per minute. The English default of 238 is from Brysbaert's 2019
   * meta-analysis of silent reading; it is not universal, which is why it is
   * a prop rather than a constant.
   */
  wordsPerMinute?: number;
  /** `{minutes}` is replaced with the localised, rounded figure. */
  template?: string;
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
 * Estimated reading time, formatted for the reader's locale.
 *
 * The number goes through `Intl.NumberFormat`, so it uses the locale's own
 * digits — "٥ دقائق", not "5 دقائق" with Latin numerals dropped into Arabic
 * text. The template is a prop because word order differs and because the unit
 * needs real translation, not a suffixed "min read".
 */
export function ReadTime({ words, wordsPerMinute = 238, template = "{minutes} min read" }: ReadTimeProps) {
  const { locale } = useLocale();

  const minutes = Math.max(1, Math.round(words / wordsPerMinute));
  const formatted = numberFormat(locale).format(minutes);

  return <span suppressHydrationWarning>{template.replace("{minutes}", formatted)}</span>;
}
