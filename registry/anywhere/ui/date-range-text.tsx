"use client";

import { useMemo } from "react";
import { getCalendar } from "../lib/locale";
import { useLocale } from "../lib/use-locale";

export interface DateRangeTextProps {
  start: Date | number;
  end: Date | number;
  options?: Intl.DateTimeFormatOptions;
}

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

  return <>{text}</>;
}
