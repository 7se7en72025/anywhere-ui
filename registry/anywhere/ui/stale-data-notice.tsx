"use client";

import { useEffect, useState } from "react";
import { useHydrated } from "../lib/use-hydrated";
import { cn } from "../lib/cn";
import { formatRelative } from "../lib/format";
import { useLocale } from "../lib/use-locale";
import { useNetwork } from "../lib/use-network";

export interface StaleDataNoticeLabels {
  /** `{age}` is replaced with a localised relative time. */
  stale: string;
  offline: string;
}

const DEFAULT_LABELS: StaleDataNoticeLabels = {
  stale: "Showing data from {age}",
  offline: "You're offline — showing data from {age}",
};

export interface StaleDataNoticeProps {
  /** When the displayed data was fetched. */
  updatedAt: Date | number;
  /** Say nothing until the data is at least this old, in ms. */
  threshold?: number;
  labels?: Partial<StaleDataNoticeLabels>;
  className?: string;
}

/**
 * Tells the reader how old what they are looking at is.
 *
 * Cached and offline-first UIs show stale data confidently and silently, which
 * is how someone acts on a balance, a departure time, or a stock level that
 * changed an hour ago. This says the age in the reader's own locale, and says
 * it differently when the staleness is explained by being offline — which
 * turns "this app is wrong" into "this is the last thing it could reach".
 *
 * Silent while the data is fresh, so it costs nothing in the normal case.
 */
export function StaleDataNotice({
  updatedAt,
  threshold = 60_000,
  labels: labelOverrides,
  className,
}: StaleDataNoticeProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { locale, direction } = useLocale();
  const { online } = useNetwork();

  // "Now" is state rather than a `Date.now()` call in the render body: reading
  // the clock while rendering is impure, and would also make the server and
  // the hydrating client disagree. A slow tick keeps the age honest without
  // the per-second timer a countdown would need.
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(timer);
  }, []);

  // Staleness is unknowable on the server — it has no idea when the reader
  // will see the page — so nothing is claimed until the client takes over.
  const hydrated = useHydrated();
  const age = now - new Date(updatedAt).getTime();
  const stale = hydrated && age >= threshold;

  const message = stale
    ? (online ? labels.stale : labels.offline).replace(
        "{age}",
        formatRelative(updatedAt, locale),
      )
    : null;

  return (
    // Always mounted, so the region exists before it ever has text.
    <p
      role="status"
      aria-live="polite"
      dir={direction}
      className={cn("text-start text-sm text-neutral-600 dark:text-neutral-400", className)}
    >
      {message}
    </p>
  );
}
