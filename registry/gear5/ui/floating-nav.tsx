"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

export interface FloatingNavItem {
  id: string;
  label: string;
  icon?: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface FloatingNavProps {
  items: FloatingNavItem[];
  scrollThreshold?: number;
  className?: string;
}

/**
 * Navigation that appears once the user scrolls past a threshold, with a
 * dismiss button. Uses `role="navigation"` and `aria-label` for
 * accessibility. Dismissed state persists for the session via local state.
 */
export function FloatingNav({ items, scrollThreshold = 200, className }: FloatingNavProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    function handleScroll() {
      setVisible(window.scrollY > scrollThreshold);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollThreshold, dismissed]);

  if (!visible || dismissed) return null;

  return (
    <nav
      aria-label="Floating navigation"
      className={cn(
        "fixed inset-x-0 top-4 z-50 mx-auto flex max-w-lg items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-4 py-2 shadow-lg backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-900/90",
        className,
      )}
    >
      <div className="flex flex-1 items-center gap-1 overflow-x-auto scrollbar-none">
        {items.map((item) => {
          const Wrapper = item.href ? "a" : "button";
          return (
            <Wrapper
              key={item.id}
              {...(item.href ? { href: item.href } : { type: "button" as const })}
              onClick={item.onClick}
              aria-label={item.label}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-neutral-700 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              {item.icon && <span aria-hidden="true">{item.icon}</span>}
              <span>{item.label}</span>
            </Wrapper>
          );
        })}
      </div>
      <button
        type="button"
        aria-label="Dismiss navigation"
        onClick={() => setDismissed(true)}
        className="shrink-0 rounded-full p-1 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
      >
        <span aria-hidden="true">✕</span>
      </button>
    </nav>
  );
}
