"use client";

import { useEffect, useId } from "react";
import { useFocusTrap } from "../lib/use-focus-trap";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";
import { Portal } from "./portal";

export interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

/**
 * A modal built on the pieces a modal actually needs: `aria-modal`, a title
 * bound by `aria-labelledby`, a focus trap, Escape to close, focus returned
 * to the trigger on close, and background scroll locked while open — every
 * one of these is a real, separately-reported accessibility bug when it is
 * the one thing missing from a hand-rolled modal.
 */
export function Dialog({ open, onClose, title, children, className }: DialogProps) {
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div
          ref={trapRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          dir={direction}
          tabIndex={-1}
          className={cn(
            "relative z-10 w-full max-w-md rounded-xl bg-white p-6 text-start shadow-xl dark:bg-neutral-900",
            className,
          )}
        >
          <h2 id={titleId} className="mb-4 text-base font-semibold">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </Portal>
  );
}
