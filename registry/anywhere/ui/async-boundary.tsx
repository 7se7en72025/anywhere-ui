"use client";

import { useEffect, useId, useRef } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";
import { useNetwork } from "../lib/use-network";
import { useLocale } from "../lib/use-locale";

export type AsyncStatus = "loading" | "error" | "empty" | "ready";

export interface AsyncBoundaryLabels {
  loading: string;
  error: string;
  /** Spoken and shown when the request failed *and* the device is offline. */
  offline: string;
  empty: string;
  retry: string;
  /** Announced once content arrives, e.g. "Content loaded". */
  ready: string;
}

const DEFAULT_LABELS: AsyncBoundaryLabels = {
  loading: "Loading…",
  error: "Something went wrong.",
  offline: "You're offline. We'll retry when you're back.",
  empty: "Nothing here yet.",
  retry: "Try again",
  ready: "Content loaded",
};

export interface AsyncBoundaryProps {
  status: AsyncStatus;
  children: React.ReactNode;
  /** Called when the user presses retry. Omit to hide the retry button. */
  onRetry?: () => void;
  /** Replace any subset of the default English strings. */
  labels?: Partial<AsyncBoundaryLabels>;
  /** Custom skeleton. Should match the ready state's shape to avoid a shift. */
  fallback?: React.ReactNode;
  /**
   * Reserved height for the non-ready states, e.g. `"12rem"`.
   *
   * Loading and error states are almost always shorter than the content that
   * replaces them, and that difference *is* the layout shift users feel. Set
   * this to roughly the height of a typical result.
   */
  minHeight?: string | number;
  className?: string;
}

/**
 * One component for the four states every data fetch actually has, wired for
 * screen readers and for connections that drop.
 *
 * - **Announces** each transition through a live region, so a blind user hears
 *   "Loading…" then "Content loaded" instead of silence.
 * - **Distinguishes offline from broken.** A failed request on a dead
 *   connection is not a server error, and telling the user so is the
 *   difference between "retry" and "give up".
 * - **Reserves space** via `minHeight` so the page does not jump when content
 *   lands — the single largest source of CLS in data-driven UIs.
 * - **Moves focus** to the error message on failure, so keyboard and screen
 *   reader users land on the retry button instead of hunting for it.
 */
export function AsyncBoundary({
  status,
  children,
  onRetry,
  labels: labelOverrides,
  fallback,
  minHeight,
  className,
}: AsyncBoundaryProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { online } = useNetwork();
  const { direction } = useLocale();
  const errorRef = useRef<HTMLDivElement>(null);
  const previousStatus = useRef<AsyncStatus | null>(null);
  const headingId = useId();

  const offline = status === "error" && !online;
  const message = offline ? labels.offline : labels.error;

  useEffect(() => {
    // Skip the announcement for the very first render: the user asked for this
    // page, they do not need to be told it is loading the instant they arrive.
    if (previousStatus.current === null) {
      previousStatus.current = status;
      return;
    }
    if (previousStatus.current === status) return;

    previousStatus.current = status;

    if (status === "loading") announce(labels.loading, "polite");
    else if (status === "ready") announce(labels.ready, "polite");
    else if (status === "empty") announce(labels.empty, "polite");
    else if (status === "error") announce(message, "assertive");
  }, [status, message, labels.loading, labels.ready, labels.empty]);

  useEffect(() => {
    if (status === "error") errorRef.current?.focus();
  }, [status]);

  const reserved =
    status === "ready"
      ? undefined
      : { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight };

  if (status === "ready") {
    return (
      <div className={className} dir={direction}>
        {children}
      </div>
    );
  }

  return (
    <div
      className={cn("text-start", className)}
      dir={direction}
      style={reserved}
      aria-busy={status === "loading"}
    >
      {status === "loading" &&
        (fallback ?? (
          <div
            className="flex h-full min-h-16 items-center gap-3 text-sm text-neutral-600 dark:text-neutral-400"
            // The visible text is decorative here — the live region already
            // spoke. Announcing twice is worse than not announcing at all.
            aria-hidden="true"
          >
            <span className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none" />
            <span>{labels.loading}</span>
          </div>
        ))}

      {status === "empty" && (
        <p className="py-6 text-sm text-neutral-600 dark:text-neutral-400">{labels.empty}</p>
      )}

      {status === "error" && (
        <div
          ref={errorRef}
          tabIndex={-1}
          role="group"
          aria-labelledby={headingId}
          className="flex flex-col items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 outline-none focus-visible:ring-2 focus-visible:ring-red-500 dark:border-red-900/60 dark:bg-red-950/40"
        >
          <p id={headingId} className="text-sm text-red-900 dark:text-red-200">
            {message}
          </p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-md border border-red-300 px-3 py-1.5 text-sm font-medium text-red-900 hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600 dark:border-red-800 dark:text-red-100 dark:hover:bg-red-900/40"
            >
              {labels.retry}
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Map any fetching library's result onto {@link AsyncStatus}.
 *
 * ```tsx
 * const { data, error, isLoading } = useQuery(...);
 * <AsyncBoundary status={statusOf({ data, error, isLoading })} …>
 * ```
 */
export function statusOf({
  data,
  error,
  isLoading,
  isEmpty,
}: {
  data?: unknown;
  error?: unknown;
  isLoading?: boolean;
  /** Override the default emptiness check (empty array or nullish data). */
  isEmpty?: boolean;
}): AsyncStatus {
  if (error) return "error";
  if (isLoading) return "loading";

  const empty =
    isEmpty ?? (data == null || (Array.isArray(data) && data.length === 0));

  return empty ? "empty" : "ready";
}
