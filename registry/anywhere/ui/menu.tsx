"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface MenuAction {
  label: string;
  onSelect: () => void;
  disabled?: boolean;
}

export interface MenuProps {
  label: string;
  actions: MenuAction[];
  className?: string;
}

/**
 * A dropdown menu button following the WAI-ARIA Menu Button pattern:
 * ArrowUp/Down move between items, Home/End jump to the ends, typing a letter
 * jumps to the next item starting with it, and Escape closes and returns
 * focus to the trigger.
 */
export function Menu({ label, actions, className }: MenuProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const id = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!open) return;
    itemRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  const close = () => {
    setOpen(false);
    rootRef.current?.querySelector("button")?.focus();
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    const enabled = actions.map((a, i) => ({ a, i })).filter(({ a }) => !a.disabled);
    const step = (delta: number) => {
      const pos = enabled.findIndex(({ i }) => i === activeIndex);
      const next = enabled[(pos + delta + enabled.length) % enabled.length];
      if (next) setActiveIndex(next.i);
    };

    if (event.key === "ArrowDown") step(1);
    else if (event.key === "ArrowUp") step(-1);
    else if (event.key === "Home") setActiveIndex(enabled[0]?.i ?? 0);
    else if (event.key === "End") setActiveIndex(enabled[enabled.length - 1]?.i ?? 0);
    else if (event.key === "Escape") close();
    else return;
    event.preventDefault();
  };

  return (
    <div ref={rootRef} className="relative inline-block">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={id}
        onClick={() => setOpen((v) => !v)}
        className="rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-800"
      >
        {label}
      </button>

      {open && (
        <div
          id={id}
          role="menu"
          aria-label={label}
          onKeyDown={onKeyDown}
          className={cn(
            "absolute start-0 top-full z-10 mt-1 min-w-40 rounded-lg border border-neutral-200 bg-white p-1 text-start shadow-lg dark:border-neutral-800 dark:bg-neutral-900",
            className,
          )}
        >
          {actions.map((action, index) => (
            <button
              key={action.label}
              ref={(node) => {
                itemRefs.current[index] = node;
              }}
              role="menuitem"
              type="button"
              disabled={action.disabled}
              tabIndex={-1}
              onClick={() => {
                action.onSelect();
                close();
              }}
              className="block w-full rounded-md px-3 py-1.5 text-start text-sm hover:bg-neutral-100 focus-visible:bg-neutral-100 disabled:opacity-40 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
