"use client";

import { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface VerticalTabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsVerticalProps {
  items: VerticalTabItem[];
  defaultId?: string;
  className?: string;
}

/**
 * Vertical tab list following the WAI-ARIA tabs pattern. Up/Down arrow keys
 * move between tabs, Home/End jump to the ends, and only the active tab is
 * in the page's Tab order. `aria-selected` and `aria-controls` are present.
 */
export function TabsVertical({ items, defaultId, className }: TabsVerticalProps) {
  const [activeId, setActiveId] = useState(defaultId ?? items[0]?.id);
  const baseId = useId();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const move = (index: number) => {
    const next = items[(index + items.length) % items.length];
    setActiveId(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === "ArrowDown") move(index + 1);
    else if (event.key === "ArrowUp") move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
    else return;
    event.preventDefault();
  };

  const activeItem = items.find((item) => item.id === activeId);

  return (
    <div className={cn("flex gap-4", className)}>
      <div role="tablist" aria-orientation="vertical" className="flex flex-col gap-1">
        {items.map((item, index) => {
          const isActive = item.id === activeId;
          const tabId = `${baseId}-${item.id}-tab`;
          const panelId = `${baseId}-${item.id}-panel`;

          return (
            <button
              key={item.id}
              ref={(node) => {
                tabRefs.current[item.id] = node;
              }}
              id={tabId}
              role="tab"
              type="button"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => setActiveId(item.id)}
              onKeyDown={(event) => onKeyDown(event, index)}
              className={cn(
                "rounded-s-md px-3 py-2 text-sm font-medium text-start focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                isActive
                  ? "border-s-2 border-blue-600 bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
                  : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>
      {activeItem && (
        <div
          role="tabpanel"
          id={`${baseId}-${activeItem.id}-panel`}
          aria-labelledby={`${baseId}-${activeItem.id}-tab`}
          tabIndex={0}
          className="flex-1 rounded-md border border-neutral-200 p-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-800"
        >
          {activeItem.content}
        </div>
      )}
    </div>
  );
}
