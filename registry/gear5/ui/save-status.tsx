"use client";

import { useEffect, useRef } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";
import { useNetwork } from "../lib/use-network";

export type SaveState = "idle" | "saving" | "saved" | "failed";

export interface SaveStatusLabels {
  saving: string;
  saved: string;
  failed: string;
  /** Shown when a save failed and the device is offline. */
  offline: string;
}

const DEFAULT_LABELS: SaveStatusLabels = {
  saving: "Saving…",
  saved: "All changes saved",
  failed: "Couldn't save your changes",
  offline: "Offline — your changes are saved on this device",
};

export interface SaveStatusProps {
  state: SaveState;
  labels?: Partial<SaveStatusLabels>;
  className?: string;
}

/**
 * The autosave indicator, said out loud.
 *
 * Autosave UI is usually a small grey word that changes silently in a corner —
 * invisible to a screen reader, and invisible to anyone not watching that
 * corner. This announces each transition, and distinguishes "we could not
 * save" from "you are offline and it is being kept locally", because those ask
 * the user for completely different reactions.
 *
 * `saving` is deliberately not announced: on a slow connection it fires
 * constantly, and interrupting someone mid-sentence to say "Saving…" while
 * they type is worse than saying nothing.
 */
export function SaveStatus({ state, labels: labelOverrides, className }: SaveStatusProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { online } = useNetwork();
  const { direction } = useLocale();
  const previous = useRef<SaveState | null>(null);

  const message =
    state === "saving"
      ? labels.saving
      : state === "saved"
        ? labels.saved
        : state === "failed"
          ? online
            ? labels.failed
            : labels.offline
          : null;

  useEffect(() => {
    if (previous.current === state) return;

    const wasFirst = previous.current === null;
    previous.current = state;
    if (wasFirst || state === "idle" || state === "saving") return;

    announce(
      state === "saved" ? labels.saved : online ? labels.failed : labels.offline,
      state === "failed" ? "assertive" : "polite",
    );
  }, [state, online, labels.saved, labels.failed, labels.offline]);

  return (
    // Mounted even when empty: a live region created at the same moment its
    // text appears is not announced by most screen readers.
    <p
      role="status"
      aria-live="polite"
      dir={direction}
      className={cn(
        "text-start text-sm",
        state === "failed" ? "text-red-700 dark:text-red-400" : "text-neutral-600 dark:text-neutral-400",
        className,
      )}
    >
      {message}
    </p>
  );
}
