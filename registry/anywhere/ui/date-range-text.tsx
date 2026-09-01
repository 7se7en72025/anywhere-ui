"use client";

import { useMemo } from "react";
import { getCalendar } from "../lib/locale";
import { useLocale } from "../lib/use-locale";

export interface DateRangeTextProps {
  start: Date | number;
  end: Date | number;
  options?: Intl.DateTimeFormatOptions;
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
 * A date range formatted as one range, not two dates with a dash between them.
 *
 * `Intl.DateTimeFormat#formatRange` collapses the parts the two dates share:
 * English gives "1–5 January 2026" rather than "1 January 2026 – 5 January
 * 2026", and every locale collapses differently, using its own range separator
 * — which is not always a hyphen, and in RTL locales does not sit where a
 * hardcoded `${a} - ${b}` would put it.
 *
 * The range also goes through the locale's own calendar, so a Thai reader sees
 * Buddhist-era years and a Saudi reader sees Hijri ones.
 */
export function DateRangeText({ start, end, options }: DateRangeTextProps) {
  const { locale } = useLocale();

  const text = useMemo(() => {
    const formatter = new Intl.DateTimeFormat(locale, {
      dateStyle: "medium",
      calendar: getCalendar(locale),
      ...options,
    });

    return formatter.formatRange(new Date(start), new Date(end));
  }, [locale, start, end, options]);

  return <span suppressHydrationWarning>{text}</span>;
}
