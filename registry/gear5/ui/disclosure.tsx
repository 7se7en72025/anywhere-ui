"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface DisclosureProps {
  summary: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

/** A single collapsible section. For more than one, related, see `Accordion`. */
export function Disclosure({ summary, children, defaultOpen = false, className }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const id = useId();

  return (
    <div className={cn("rounded-lg border border-neutral-200 dark:border-neutral-800", className)}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-start text-sm font-medium hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 dark:hover:bg-neutral-900"
      >
        {summary}
        <span aria-hidden="true" className={cn("transition-transform motion-reduce:transition-none", open && "rotate-180")}>
          ▾
        </span>
      </button>
      {open && (
        <div id={id} className="px-4 pb-4 text-sm text-neutral-700 dark:text-neutral-300">
          {children}
        </div>
      )}
    </div>
  );
}
