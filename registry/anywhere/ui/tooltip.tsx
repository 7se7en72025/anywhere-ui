"use client";

import { cloneElement, isValidElement, useCallback, useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface TooltipProps {
  content: string;
  children: React.ReactElement;
  side?: "top" | "bottom";
  className?: string;
}

/**
 * A hover/focus label bound with `aria-describedby`, not a native `title`
 * attribute — `title` is invisible to touch and keyboard users and its
 * timing is outside the page's control. Opens on focus as well as hover, so
 * the tooltip is not a mouse-only feature, and closes on Escape.
 */
export function Tooltip({ content, children, side = "top", className }: TooltipProps) {
  const [open, setOpen] = useState(false);
  const id = useId();
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // Hooks run unconditionally, before the early return below — the debounce
  // timer these close over is only ever read inside a real event handler
  // (mouseenter/focus/keydown), never during render, but static analysis
  // cannot see that far through cloneElement's prop object.
  const show = useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setOpen(true), 200);
  }, []);
  const hide = useCallback(() => {
    clearTimeout(timer.current);
    setOpen(false);
  }, []);
  const hideOnEscape = useCallback(
    (event: React.KeyboardEvent) => {
      if (event.key === "Escape") hide();
    },
    [hide],
  );

  if (!isValidElement(children)) return children;

  // show/hide/hideOnEscape are stable event-handler callbacks that only ever
  // run later, on user interaction — never during this render.
  // eslint-disable-next-line react-hooks/refs
  const trigger = cloneElement(children as React.ReactElement<Record<string, unknown>>, {
    "aria-describedby": open ? id : undefined,
    onMouseEnter: show,
    onMouseLeave: hide,
    onFocus: show,
    onBlur: hide,
    onKeyDown: hideOnEscape,
  });

  return (
    <span className="relative inline-block">
      {trigger}
      {open && (
        <span
          role="tooltip"
          id={id}
          className={cn(
            "absolute start-1/2 z-10 -translate-x-1/2 rtl:translate-x-1/2 whitespace-nowrap rounded-md bg-neutral-900 px-2 py-1 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900",
            side === "top" ? "bottom-full mb-2" : "top-full mt-2",
            className,
          )}
        >
          {content}
        </span>
      )}
    </span>
  );
}
