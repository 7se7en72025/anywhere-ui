"use client";

import { useStoredValue } from "../lib/use-stored-value";
import { cn } from "../lib/cn";

export interface ConsentBannerLabels {
  message: string;
  accept: string;
  decline: string;
}

const DEFAULT_LABELS: ConsentBannerLabels = {
  message: "We use only the storage this site needs to work. No third-party tracking.",
  accept: "Accept",
  decline: "Decline",
};

export interface ConsentBannerProps {
  storageKey?: string;
  labels?: Partial<ConsentBannerLabels>;
  onDecide?: (accepted: boolean) => void;
  className?: string;
}

/**
 * A cookie/consent banner scoped to what this library actually believes in:
 * decline is exactly as easy to press as accept — no dark-pattern size or
 * placement difference — and the choice is asked once, stored locally, and
 * never re-asked while it stands.
 */
export function ConsentBanner({ storageKey = "gear5-ui:consent", labels: labelOverrides, onDecide, className }: ConsentBannerProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [decision, setDecision] = useStoredValue(storageKey);

  if (decision !== null) return null;

  const decide = (accepted: boolean) => {
    setDecision(accepted ? "accepted" : "declined");
    onDecide?.(accepted);
  };

  return (
    <div
      role="region"
      aria-label="Cookie consent"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-3 border-t border-neutral-200 bg-white p-4 text-sm shadow-lg sm:flex-row sm:justify-between dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
    >
      <p>{labels.message}</p>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => decide(false)}
          className="rounded-md border border-neutral-300 px-3 py-1.5 font-medium hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          {labels.decline}
        </button>
        <button
          type="button"
          onClick={() => decide(true)}
          className="rounded-md bg-neutral-900 px-3 py-1.5 font-medium text-white hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-neutral-100 dark:text-neutral-900"
        >
          {labels.accept}
        </button>
      </div>
    </div>
  );
}
