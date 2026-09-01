"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface FilterPill {
  id: string;
  label: string;
  count?: number;
}

export interface FilterBarProps {
  filters: FilterPill[];
  activeIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
}

/**
 * Horizontal scrollable filter pills. Each pill uses `aria-pressed` to
 * communicate toggle state. The bar is keyboard-scrollable and labelled
 * for screen readers.
 */
export function FilterBar({ filters, activeIds, onChange, className }: FilterBarProps) {
  const baseId = useId();

  function toggle(id: string) {
    if (activeIds.includes(id)) {
      onChange(activeIds.filter((i) => i !== id));
    } else {
      onChange([...activeIds, id]);
    }
  }

  return (
    <div
      role="group"
      aria-label="Filters"
      className={cn("flex gap-2 overflow-x-auto scrollbar-none", className)}
    >
      {filters.map((filter) => {
        const isActive = activeIds.includes(filter.id);
        return (
          <button
            key={filter.id}
            id={`${baseId}-${filter.id}`}
            type="button"
            role="switch"
            aria-checked={isActive}
            onClick={() => toggle(filter.id)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
              isActive
                ? "border-blue-600 bg-blue-600 text-white"
                : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-neutral-600",
            )}
          >
            {filter.label}
            {filter.count !== undefined && (
              <span
                aria-hidden="true"
                className={cn(
                  "rounded-full px-1.5 text-xs",
                  isActive ? "bg-white/20" : "bg-neutral-100 dark:bg-neutral-800",
                )}
              >
                {filter.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
