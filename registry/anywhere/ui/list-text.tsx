"use client";

import { listFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface ListTextProps {
  items: string[];
  /** "and" (conjunction, default) or "or" (disjunction). */
  type?: Intl.ListFormatOptions["type"];
}

/**
 * "Aisha, Bo, and Chidi" in English; "Aisha, Bo und Chidi" in German (no
 * Oxford comma); "Aisha、Bo、Chidiさん" shaped correctly in Japanese — via
 * `Intl.ListFormat` rather than a hardcoded `join(", ")` plus an English-only
 * "and" appended at the end.
 */
export function ListText({ items, type = "conjunction" }: ListTextProps) {
  const { locale } = useLocale();
  return <>{listFormat(locale, { type }).format(items)}</>;
}
