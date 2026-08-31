"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface PopoverProps {
  trigger: (props: { onClick: () => void; "aria-expanded": boolean; "aria-controls": string }) => React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * A disclosure panel anchored to its trigger. Closes on outside click and on
 * Escape (returning focus to the trigger), and exposes `aria-expanded` /
 * `aria-controls` through the trigger render prop so the calling button's own
 * markup stays in the caller's control.
 */
export function Popover({ trigger, children, className }: PopoverProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.querySelector("button")?.focus();
      }
    }

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-block">
      <div ref={triggerRef}>
        {trigger({ onClick: () => setOpen((v) => !v), "aria-expanded": open, "aria-controls": id })}
      </div>
      {open && (
        <div
          id={id}
          role="dialog"
          className={cn(
            "absolute start-0 top-full z-10 mt-2 min-w-48 rounded-lg border border-neutral-200 bg-white p-3 text-start shadow-lg dark:border-neutral-800 dark:bg-neutral-900",
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}
