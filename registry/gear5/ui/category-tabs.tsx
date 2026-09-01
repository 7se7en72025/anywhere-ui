"use client";

import { useRef } from "react";
import { cn } from "../lib/cn";

export interface CategoryTab {
  id: string;
  label: string;
}

export interface CategoryTabsProps {
  tabs: CategoryTab[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
}

/**
 * Horizontal scrollable category pills. Uses `role="tablist"` with
 * `aria-orientation="horizontal"` and each pill is a `role="tab"` with
 * `aria-selected`. The list is keyboard-scrollable with arrow keys.
 */
export function CategoryTabs({ tabs, activeId, onChange, className }: CategoryTabsProps) {
  const listRef = useRef<HTMLDivElement>(null);

  function handleKeyDown(event: React.KeyboardEvent) {
    const index = tabs.findIndex((t) => t.id === activeId);
    if (event.key === "ArrowRight") {
      event.preventDefault();
      const next = tabs[(index + 1) % tabs.length];
      onChange(next.id);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      const prev = tabs[(index - 1 + tabs.length) % tabs.length];
      onChange(prev.id);
    } else if (event.key === "Home") {
      event.preventDefault();
      onChange(tabs[0].id);
    } else if (event.key === "End") {
      event.preventDefault();
      onChange(tabs[tabs.length - 1].id);
    }
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Categories"
      aria-orientation="horizontal"
      onKeyDown={handleKeyDown}
      className={cn("flex gap-2 overflow-x-auto scrollbar-none", className)}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`cat-tab-${tab.id}`}
            aria-selected={isActive}
            tabIndex={isActive ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className={cn(
              "inline-flex shrink-0 items-center rounded-full px-4 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
              isActive
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-400 dark:hover:bg-neutral-700",
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
