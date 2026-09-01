"use client";

import { useEffect, useId } from "react";
import { useFocusTrap } from "../lib/use-focus-trap";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";
import { Portal } from "./portal";

export interface DrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  /**
   * "start"/"end" rather than "left"/"right": under RTL, "end" is the left
   * edge, and a caller thinking in physical sides gets it backwards for half
   * the world's readers.
   */
  side?: "start" | "end";
  className?: string;
}

/** A modal panel anchored to a screen edge — the same contract as Dialog. */
export function Drawer({ open, onClose, title, children, side = "end", className }: DrawerProps) {
  const titleId = useId();
  const trapRef = useFocusTrap<HTMLDivElement>(open);
  const { direction } = useLocale();

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <Portal>
      <div className="fixed inset-0 z-50">
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          dir={direction}
          tabIndex={-1}
          className={cn(
            "absolute inset-y-0 flex w-full max-w-sm flex-col gap-4 bg-white p-6 text-start shadow-xl dark:bg-neutral-900",
            side === "start" ? "start-0" : "end-0",
            className,
          )}
        >
          <h2 id={titleId} className="text-base font-semibold">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </Portal>
  );
}
