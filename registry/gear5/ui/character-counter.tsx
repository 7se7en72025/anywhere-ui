"use client";

import { useMemo } from "react";
import { cn } from "../lib/cn";
import { numberFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface CharacterCounterProps {
  value: string;
  limit: number;
  /** `{count}` and `{limit}` are replaced with localised numbers. */
  template?: string;
  /** Announced when the limit is exceeded. `{over}` is the overage. */
  overTemplate?: string;
  className?: string;
}

/** Count user-perceived characters, not UTF-16 code units. */
function countGraphemes(text: string, locale: string): number {
  if (typeof Intl.Segmenter !== "function") return [...text].length;

  const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
  return [...segmenter.segment(text)].length;
}

/**
 * A character counter that counts the way the person typing counts.
 *
 * `value.length` counts UTF-16 code units, so a single emoji costs 2 and a
 * family emoji costs 11 — a user types one character and watches the counter
 * jump by eleven, with no explanation. Devanagari and Thai clusters have the
 * same problem.
 *
 * The count is a live region so it is available to screen readers, but polite
 * and only announced meaningfully near the limit; a region that speaks on
 * every keystroke makes a field unusable.
 */
export function CharacterCounter({
  value,
  limit,
  template = "{count} of {limit}",
  overTemplate = "{over} over the limit",
  className,
}: CharacterCounterProps) {
  const { locale, direction } = useLocale();

  const count = useMemo(() => countGraphemes(value, locale), [value, locale]);
  const over = count - limit;

  const format = (n: number) => numberFormat(locale).format(n);

  const text =
    over > 0
      ? overTemplate.replace("{over}", format(over))
      : template.replace("{count}", format(count)).replace("{limit}", format(limit));

  return (
    <p
      dir={direction}
      // Only assertive once the limit is actually breached: before that this
      // is reference information, not something worth interrupting typing for.
      role={over > 0 ? "alert" : "status"}
      aria-live={over > 0 ? "assertive" : "off"}
      className={cn(
        "text-start text-sm tabular-nums",
        over > 0 ? "text-red-700 dark:text-red-400" : "text-neutral-600 dark:text-neutral-400",
        className,
      )}
    >
      {text}
    </p>
  );
}
