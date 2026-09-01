"use client";

import { useEffect, useState } from "react";
import { sanitizeHref } from "../lib/sanitize";
import { cn } from "../lib/cn";

export interface TocEntry {
  id: string;
  label: string;
  depth?: number;
}

export interface TableOfContentsProps {
  entries: TocEntry[];
  className?: string;
}

/**
 * A jump-list that tracks and marks the currently visible heading with
 * `aria-current="location"` via `IntersectionObserver` — cheaper than a
 * scroll listener, and inert (no work at all) until a watched heading
 * actually crosses the viewport.
 */
export function TableOfContents({ entries, className }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const elements = entries.map((e) => document.getElementById(e.id)).filter((el): el is HTMLElement => !!el);
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (observerEntries) => {
        const visible = observerEntries.filter((e) => e.isIntersecting);
        if (visible.length > 0) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -70% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [entries]);

  return (
    <nav aria-label="Table of contents" className={className}>
      <ul className="flex flex-col gap-1 text-sm">
        {entries.map((entry) => (
          <li key={entry.id} style={{ paddingInlineStart: `${(entry.depth ?? 0) * 12}px` }}>
            <a
              href={sanitizeHref(`#${entry.id}`)}
              aria-current={activeId === entry.id ? "location" : undefined}
              className={cn(
                "block py-1",
                activeId === entry.id ? "font-medium text-blue-700 dark:text-blue-400" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
              )}
            >
              {entry.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
