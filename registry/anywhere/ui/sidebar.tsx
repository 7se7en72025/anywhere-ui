"use client";

import { cn } from "../lib/cn";

export interface SidebarItem {
  label: string;
  href: string;
  current?: boolean;
}

export interface SidebarProps {
  items: SidebarItem[];
  label?: string;
  className?: string;
}

/**
 * A landmark navigation column. `insetInlineStart`-based active-item styling
 * (via `border-s-2`) rather than `border-l-2` — the current-item indicator
 * sits on the correct edge whichever direction the sidebar's own list flows.
 */
export function Sidebar({ items, label = "Sidebar", className }: SidebarProps) {
  return (
    <nav aria-label={label} className={cn("flex w-56 flex-col gap-0.5 text-start", className)}>
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          aria-current={item.current ? "page" : undefined}
          className={cn(
            "rounded-md border-s-2 px-3 py-2 text-sm",
            item.current
              ? "border-blue-600 bg-blue-50 font-medium text-blue-700 dark:bg-blue-950/40 dark:text-blue-300"
              : "border-transparent text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-900",
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  );
}
