"use client";

import { useState } from "react";
import { cn } from "../lib/cn";

export interface TimelineEntry {
  id: string;
  title: string;
  description?: string;
  time: string;
  group: string;
  icon?: React.ReactNode;
}

export interface TimelineAdvancedProps {
  entries: TimelineEntry[];
  groups?: string[];
  className?: string;
}

/**
 * Grouped timeline with filtering. Each entry uses `aria-label` for its full
 * description. Group headings are `aria-level="2"`. Filter buttons use
 * `aria-pressed`.
 */
export function TimelineAdvanced({ entries, groups, className }: TimelineAdvancedProps) {
  const allGroups = groups ?? [...new Set(entries.map((e) => e.group))];
  const [activeGroups, setActiveGroups] = useState<Set<string>>(() => new Set(allGroups));

  function toggleGroup(group: string) {
    setActiveGroups((prev) => {
      const next = new Set(prev);
      if (next.has(group)) next.delete(group);
      else next.add(group);
      return next;
    });
  }

  const filtered = entries.filter((e) => activeGroups.has(e.group));
  const grouped = allGroups
    .filter((g) => activeGroups.has(g))
    .map((g) => ({ group: g, items: filtered.filter((e) => e.group === g) }));

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div role="group" aria-label="Filter by group" className="flex flex-wrap gap-2">
        {allGroups.map((group) => (
          <button
            key={group}
            type="button"
            aria-pressed={activeGroups.has(group)}
            onClick={() => toggleGroup(group)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
              activeGroups.has(group)
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-300 text-neutral-600 hover:border-neutral-400 dark:border-neutral-700 dark:text-neutral-400",
            )}
          >
            {group}
          </button>
        ))}
      </div>

      <ol className="relative flex flex-col gap-6 ps-6" aria-label="Timeline">
        <span aria-hidden="true" className="absolute inset-y-0 start-[5px] w-px bg-neutral-200 dark:bg-neutral-800" />
        {grouped.map(({ group, items }) => (
          <li key={group}>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              {group}
            </h2>
            <ol className="relative flex flex-col gap-4 ps-6">
              <span aria-hidden="true" className="absolute inset-y-0 start-[5px] w-px bg-neutral-200 dark:bg-neutral-800" />
              {items.map((entry) => (
                <li
                  key={entry.id}
                  aria-label={`${entry.title} — ${entry.time}`}
                  className="relative"
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute -start-6 top-1 size-2.5 rounded-full",
                      entry.icon ? "bg-blue-600" : "bg-neutral-400",
                    )}
                  />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">{entry.time}</span>
                    <span className="text-sm font-medium">{entry.title}</span>
                    {entry.description && (
                      <span className="text-sm text-neutral-600 dark:text-neutral-400">{entry.description}</span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    </div>
  );
}
