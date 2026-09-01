"use client";

import { useEffect, useState } from "react";
import { formatRelative, dateTimeFormat } from "../lib/format";
import { useLocale } from "../lib/use-locale";

export interface RelativeTimeProps {
  value: Date | number;
  /** Re-render interval in ms, so "in 1 minute" becomes "now" on its own. */
  updateInterval?: number;
  className?: string;
}

/**
 * "3 days ago", live and in the reader's own language and calendar. The exact
 * timestamp is always available too — on hover for a mouse, and permanently
 * for assistive tech via `title`, since a screen reader does not hover.
 */
export function RelativeTime({ value, updateInterval = 60_000, className }: RelativeTimeProps) {
  const { locale, calendar } = useLocale();
  const [, forceUpdate] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => forceUpdate((n) => n + 1), updateInterval);
    return () => clearInterval(timer);
  }, [updateInterval]);

  const date = new Date(value);
  const exact = dateTimeFormat(locale, { dateStyle: "full", timeStyle: "short", calendar }).format(
    date,
  );

  return (
    <time dateTime={date.toISOString()} title={exact} className={className} suppressHydrationWarning>
      {formatRelative(date, locale)}
    </time>
  );
}
