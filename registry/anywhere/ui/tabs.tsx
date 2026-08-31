"use client";

import { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

export interface TabsProps {
  items: TabItem[];
  defaultId?: string;
  className?: string;
}

/**
 * Follows the WAI-ARIA Tabs pattern: arrow keys move between tabs (Left/Right
 * flip meaning under `dir="rtl"`, matching what a keyboard user expects to
 * happen — "next" is still whichever direction reads forward), Home/End jump
 * to the ends, and only the active tab is in the page's Tab order.
 */
export function Tabs({ items, defaultId, className }: TabsProps) {
  const [activeId, setActiveId] = useState(defaultId ?? items[0]?.id);
  const baseId = useId();
  const { direction } = useLocale();
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
  const backward = direction === "rtl" ? "ArrowRight" : "ArrowLeft";

  const move = (index: number) => {
    const next = items[(index + items.length) % items.length];
    setActiveId(next.id);
    tabRefs.current[next.id]?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent, index: number) => {
    if (event.key === forward) move(index + 1);
    else if (event.key === backward) move(index - 1);
    else if (event.key === "Home") move(0);
    else if (event.key === "End") move(items.length - 1);
    else return;
    event.preventDefault();
  };

  return (
    <div className={className}>
      <div role="tablist" className="flex gap-1 border-b border-neutral-200 dark:border-neutral-800">
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
                "border-b-2 px-3 py-2 text-sm font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                isActive
                  ? "border-blue-600 text-blue-700 dark:text-blue-400"
                  : "border-transparent text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => {
        const tabId = `${baseId}-${item.id}-tab`;
        const panelId = `${baseId}-${item.id}-panel`;
        const isActive = item.id === activeId;

        return (
          <div key={item.id} id={panelId} role="tabpanel" aria-labelledby={tabId} hidden={!isActive} className="pt-4 text-sm">
            {isActive && item.content}
          </div>
        );
      })}
    </div>
  );
}
