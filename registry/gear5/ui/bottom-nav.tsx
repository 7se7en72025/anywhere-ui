"use client";

import { cn } from "../lib/cn";

export interface BottomNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
}

export interface BottomNavProps {
  items: BottomNavItem[];
  activeId?: string;
  className?: string;
}

/**
 * Fixed bottom navigation bar for mobile interfaces. Each item has an icon and
 * label, with `aria-label` on every interactive element. The active item is
 * communicated via `aria-current="page"`.
 */
export function BottomNav({ items, activeId, className }: BottomNavProps) {
  return (
    <nav
      aria-label="Bottom navigation"
      className={cn(
        "fixed inset-x-0 bottom-0 z-50 flex items-stretch border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
    >
      {items.map((item) => {
        const isActive = item.id === activeId;
        const Wrapper = item.href ? "a" : "button";

        return (
          <Wrapper
            key={item.id}
            {...(item.href ? { href: item.href } : { type: "button" as const })}
            onClick={item.onClick}
            aria-label={item.label}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex flex-1 flex-col items-center gap-1 py-2 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
              isActive
                ? "text-blue-600 dark:text-blue-400"
                : "text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200",
            )}
          >
            <span aria-hidden="true" className="text-lg">
              {item.icon}
            </span>
            <span>{item.label}</span>
          </Wrapper>
        );
      })}
    </nav>
  );
}
