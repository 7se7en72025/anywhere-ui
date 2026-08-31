"use client";

import { useEffect, useRef, useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";
import { useNetwork } from "../lib/use-network";

export interface RetryButtonLabels {
  retry: string;
  /** `{seconds}` is replaced with the remaining wait. */
  waiting: string;
  offline: string;
}

const DEFAULT_LABELS: RetryButtonLabels = {
  retry: "Try again",
  waiting: "Retrying in {seconds}s",
  offline: "Waiting for a connection",
};

export interface RetryButtonProps {
  onRetry: () => void | Promise<void>;
  /** First backoff delay in ms; doubles each consecutive failure. */
  baseDelay?: number;
  /** Ceiling for the backoff, so it never becomes an effective dead end. */
  maxDelay?: number;
  labels?: Partial<RetryButtonLabels>;
  className?: string;
}

/**
 * A retry control with visible, honest backoff.
 *
 * Retry buttons are usually either instant — inviting a user on a flaky
 * connection to hammer a failing endpoint — or silently rate-limited, which
 * reads as the button being broken. This shows the wait as a live countdown,
 * announces when it becomes usable again, and stays disabled while offline
 * rather than pretending a retry could succeed.
 *
 * The countdown is announced only when it reaches zero. A live region ticking
 * once a second is unusable with a screen reader.
 */
export function RetryButton({
  onRetry,
  baseDelay = 2000,
  maxDelay = 30_000,
  labels: labelOverrides,
  className,
}: RetryButtonProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { online } = useNetwork();
  const { direction, locale } = useLocale();

  const [remaining, setRemaining] = useState(0);
  const attempts = useRef(0);

  useEffect(() => {
    if (remaining <= 0) return;

    const timer = setTimeout(() => {
      const next = remaining - 1;
      setRemaining(next);
      if (next === 0) announce(labels.retry, "polite");
    }, 1000);

    return () => clearTimeout(timer);
  }, [remaining, labels.retry]);

  async function handleClick() {
    const delay = Math.min(baseDelay * 2 ** attempts.current, maxDelay);
    attempts.current += 1;
    setRemaining(Math.round(delay / 1000));

    await onRetry();
  }

  const waiting = remaining > 0;
  const disabled = waiting || !online;

  const label = !online
    ? labels.offline
    : waiting
      ? labels.waiting.replace("{seconds}", new Intl.NumberFormat(locale).format(remaining))
      : labels.retry;

  return (
    <button
      type="button"
      dir={direction}
      onClick={handleClick}
      disabled={disabled}
      className={cn(
        "rounded-md border border-neutral-300 px-3 py-1.5 text-sm font-medium",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
        disabled ? "cursor-not-allowed opacity-60" : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
        "dark:border-neutral-700",
        className,
      )}
    >
      {label}
    </button>
  );
}
