"use client";

import { sanitizeHref } from "../lib/sanitize";
import { cn } from "../lib/cn";

export interface ShareButtonProps {
  url: string;
  title?: string;
  text?: string;
  label?: string;
  className?: string;
}

/**
 * Uses the Web Share API where available — the OS's own native share sheet,
 * which most desktop browsers still lack — and falls back to opening the URL
 * as a plain link. Never fails silently: on an unsupported, non-secure
 * context there is still a working link underneath.
 */
export function ShareButton({ url, title, text, label = "Share", className }: ShareButtonProps) {
  const safeUrl = sanitizeHref(url);
  const canShare = typeof navigator !== "undefined" && typeof navigator.share === "function";

  if (!canShare) {
    return (
      <a
        href={safeUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "inline-block rounded-md border border-neutral-300 px-2.5 py-1 text-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-800",
          className,
        )}
      >
        {label}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        navigator.share({ url: safeUrl, title, text }).catch(() => {
          // User cancelled the native share sheet — not an error.
        });
      }}
      className={cn(
        "rounded-md border border-neutral-300 px-2.5 py-1 text-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-800",
        className,
      )}
    >
      {label}
    </button>
  );
}
