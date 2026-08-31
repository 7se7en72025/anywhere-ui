"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";
import { useNetwork } from "../lib/use-network";

export interface ConnectionStatusLabels {
  offline: string;
  /** Shown briefly after the connection comes back. */
  restored: string;
  /** Shown on 2G-class or Save-Data connections. */
  slow: string;
}

const DEFAULT_LABELS: ConnectionStatusLabels = {
  offline: "You're offline. Changes are saved on this device.",
  restored: "Back online.",
  slow: "Slow connection. Loading a lighter version.",
};

export interface ConnectionStatusProps {
  labels?: Partial<ConnectionStatusLabels>;
  /** How long the "back online" confirmation stays up, in ms. */
  restoredDuration?: number;
  /** Say nothing about slow-but-working connections. */
  hideSlow?: boolean;
  className?: string;
}

/**
 * A live banner for the state of the user's connection.
 *
 * Apps built on fast office Wi-Fi tend to fail silently on a train: the request
 * hangs, nothing changes on screen, and the user taps the button again. This
 * says what is happening, in the page's own language and direction, and says it
 * out loud for screen readers — politely, because losing signal is not an
 * emergency that should interrupt whatever is being read.
 */
export function ConnectionStatus({
  labels: labelOverrides,
  restoredDuration = 4000,
  hideSlow = false,
  className,
}: ConnectionStatusProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { online, constrained } = useNetwork();
  const { direction } = useLocale();

  const [showRestored, setShowRestored] = useState(false);
  const wasOffline = useRef(false);

  useEffect(() => {
    if (!online) {
      // No state update needed: while offline the offline message wins in
      // render regardless of what `showRestored` happens to hold.
      wasOffline.current = true;
      return;
    }

    if (!wasOffline.current) return;

    wasOffline.current = false;
    setShowRestored(true);

    const timer = setTimeout(() => setShowRestored(false), restoredDuration);
    return () => clearTimeout(timer);
  }, [online, restoredDuration]);

  const message = !online
    ? labels.offline
    : showRestored
      ? labels.restored
      : !hideSlow && constrained
        ? labels.slow
        : null;

  const tone = !online ? "offline" : showRestored ? "restored" : "slow";

  return (
    // The region is always mounted, even when empty: a live region created at
    // the same moment its text appears is not announced by most screen readers.
    <div
      role="status"
      aria-live="polite"
      dir={direction}
      className={cn(
        "text-start text-sm transition-[opacity,padding] duration-200 motion-reduce:transition-none",
        message ? "px-4 py-2 opacity-100" : "h-0 overflow-hidden p-0 opacity-0",
        message &&
          {
            offline:
              "bg-neutral-900 text-neutral-50 dark:bg-neutral-100 dark:text-neutral-900",
            restored:
              "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-100",
            slow: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-100",
          }[tone],
        className,
      )}
    >
      {message}
    </div>
  );
}
