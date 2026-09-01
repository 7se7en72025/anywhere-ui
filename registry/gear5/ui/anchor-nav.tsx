"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface AnchorNavItem {
  id: string;
  label: string;
}

export interface AnchorNavProps {
  items: AnchorNavItem[];
  offset?: number;
  className?: string;
}

/**
 * Navigation that scrolls to sections and highlights the active section on
 * scroll using IntersectionObserver. Each link uses `aria-current="true"` when
 * its section is in view.
 */
export function AnchorNav({ items, offset = 80, className }: AnchorNavProps) {
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    items.forEach((item) => {
      const el = document.getElementById(item.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setActiveId(item.id);
            }
          }
        },
        { rootMargin: `-${offset}px 0px -60% 0px`, threshold: 0 },
      );
      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, [items, offset]);

  function scrollTo(id: string) {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <nav ref={navRef} aria-label="Anchor navigation" className={cn("flex gap-1 overflow-x-auto", className)}>
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          aria-current={item.id === activeId ? "true" : undefined}
          onClick={() => scrollTo(item.id)}
          className={cn(
            "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
            item.id === activeId
              ? "bg-blue-600 text-white"
              : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100",
          )}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}
