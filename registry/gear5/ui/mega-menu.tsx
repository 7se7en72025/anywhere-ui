"use client";

import { useId, useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface MegaMenuColumn {
  heading: string;
  items: { id: string; label: string; href?: string; onClick?: () => void }[];
}

export interface MegaMenuProps {
  trigger: React.ReactNode;
  columns: MegaMenuColumn[];
  className?: string;
}

/**
 * A dropdown with multiple columns of links. The trigger button uses
 * `aria-expanded` and `aria-haspopup="true"`. Arrow keys move between items
 * across columns; Escape closes and returns focus to the trigger.
 */
export function MegaMenu({ trigger, columns, className }: MegaMenuProps) {
  const baseId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const flatItems = columns.flatMap((col) => col.items);

  function focusItem(index: number) {
    const clamped = Math.max(0, Math.min(index, flatItems.length - 1));
    setActiveIndex(clamped);
    const el = panelRef.current?.querySelector<HTMLElement>(`[data-mega-item="${clamped}"]`);
    el?.focus();
  }

  function handleTriggerKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown" || event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setOpen(true);
      requestAnimationFrame(() => focusItem(0));
    }
  }

  function handlePanelKeyDown(event: React.KeyboardEvent) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusItem(activeIndex + 1);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusItem(activeIndex - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusItem(Math.min(activeIndex + 1, flatItems.length - 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusItem(Math.max(activeIndex - 1, 0));
    } else if (event.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    } else if (event.key === "Home") {
      event.preventDefault();
      focusItem(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusItem(flatItems.length - 1);
    }
  }

  const columnStartIndices = useMemo(() => {
    const indices: number[] = [];
    let offset = 0;
    for (const column of columns) {
      indices.push(offset);
      offset += column.items.length;
    }
    return indices;
  }, [columns]);

  return (
    <div className={cn("relative inline-block", className)}>
      <button
        ref={triggerRef}
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls={`${baseId}-panel`}
        onClick={() => {
          setOpen((prev) => !prev);
          if (!open) requestAnimationFrame(() => focusItem(0));
        }}
        onKeyDown={handleTriggerKeyDown}
        className="rounded-md px-3 py-2 text-sm font-medium hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800"
      >
        {trigger}
      </button>
      {open && (
        <div
          ref={panelRef}
          id={`${baseId}-panel`}
          role="menu"
          aria-label="Mega menu"
          onKeyDown={handlePanelKeyDown}
          className="absolute top-full mt-2 flex gap-6 rounded-lg border border-neutral-200 bg-white p-4 shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          {columns.map((column, colIdx) => {
            const startIndex = columnStartIndices[colIdx];
            return (
              <div key={column.heading} className="flex flex-col gap-1">
                <span className="px-2 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
                  {column.heading}
                </span>
                {column.items.map((item, colIndex) => {
                  const globalIndex = startIndex + colIndex;
                  const Wrapper = item.href ? "a" : "button";
                  return (
                    <Wrapper
                      key={item.id}
                      {...(item.href ? { href: item.href } : { type: "button" as const })}
                      role="menuitem"
                      data-mega-item={globalIndex}
                      tabIndex={globalIndex === activeIndex ? 0 : -1}
                      onClick={() => {
                        item.onClick?.();
                        setOpen(false);
                      }}
                      className="rounded px-2 py-1.5 text-sm text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    >
                      {item.label}
                    </Wrapper>
                  );
                })}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
