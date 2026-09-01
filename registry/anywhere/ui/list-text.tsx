"use client";

import { listFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface ListTextProps {
  items: string[];
  /** "and" (conjunction, default) or "or" (disjunction). */
  type?: Intl.ListFormatOptions["type"];
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
 * "Aisha, Bo, and Chidi" in English; "Aisha, Bo und Chidi" in German (no
 * Oxford comma); "Aisha、Bo、Chidiさん" shaped correctly in Japanese — via
 * `Intl.ListFormat` rather than a hardcoded `join(", ")` plus an English-only
 * "and" appended at the end.
 */
export function ListText({ items, type = "conjunction" }: ListTextProps) {
  const { locale } = useLocale();
  return <span suppressHydrationWarning>{listFormat(locale, { type }).format(items)}</span>;
}
