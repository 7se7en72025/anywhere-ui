"use client";

import { useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";

export interface CopyButtonProps {
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
}

/**
 * Copies to the clipboard and announces success, since the only visible
 * feedback is otherwise a label that changes back before most people finish
 * reading it — and nothing at all for a screen reader user.
 */
export function CopyButton({ value, label = "Copy", copiedLabel = "Copied", className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      announce(copiedLabel, "polite");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard access denied or unavailable. Nothing useful to recover
      // into — the button simply does not confirm success.
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-md border border-neutral-300 px-2.5 py-1 text-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-800",
        className,
      )}
    >
      {copied ? copiedLabel : label}
    </button>
  );
}
