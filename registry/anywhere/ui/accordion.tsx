"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps {
  items: AccordionItem[];
  /** Allow more than one panel open at once. Default: single-open. */
  multiple?: boolean;
  defaultOpen?: string[];
  className?: string;
}

/**
 * Collapsible sections built on real `<button aria-expanded>` triggers
 * controlling `id`-linked panels — the pattern screen readers and the
 * WAI-ARIA Accordion spec both expect, rather than a `<div onClick>` with a
 * chevron that never announces its state.
 */
export function Accordion({ items, multiple = false, defaultOpen = [], className }: AccordionProps) {
  const [open, setOpen] = useState<Set<string>>(new Set(defaultOpen));
  const baseId = useId();

  const toggle = (id: string) => {
    setOpen((prev) => {
      const next = multiple ? new Set(prev) : new Set<string>();
      if (prev.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className={cn("flex flex-col divide-y divide-neutral-200 rounded-lg border border-neutral-200 dark:divide-neutral-800 dark:border-neutral-800", className)}>
      {items.map((item) => {
        const isOpen = open.has(item.id);
        const triggerId = `${baseId}-${item.id}-trigger`;
        const panelId = `${baseId}-${item.id}-panel`;

        return (
          <div key={item.id}>
            <h3>
              <button
                id={triggerId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-start text-sm font-medium hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-blue-600 dark:hover:bg-neutral-900"
              >
                {item.title}
                <span aria-hidden="true" className={cn("transition-transform motion-reduce:transition-none", isOpen && "rotate-180")}>
                  ▾
                </span>
              </button>
            </h3>
            {isOpen && (
              <div id={panelId} role="region" aria-labelledby={triggerId} className="px-4 pb-4 text-sm text-neutral-700 dark:text-neutral-300">
                {item.content}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
