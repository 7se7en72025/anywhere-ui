"use client";

import { useMemo, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  height: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
}

/**
 * Renders only the rows near the viewport, plus a small overscan buffer —
 * the difference between a smooth scroll and a dropped-frame one on the
 * low-end Android hardware most of the world actually browses on, once a
 * list passes a few hundred rows.
 *
 * A `role="list"`/`role="listitem"` pair rather than semantic `<ul>`/`<li>`:
 * the scroll container's real children do not span the full list, so a plain
 * `<ul>` would misreport its item count to assistive technology. `aria-setsize`
 * / `aria-posinset` on each row restore that count explicitly.
 */
export function VirtualList<T>({ items, itemHeight, height, renderItem, className }: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const overscan = 4;
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const visibleCount = Math.ceil(height / itemHeight) + overscan * 2;
  const endIndex = Math.min(items.length, startIndex + visibleCount);

  const visible = useMemo(() => items.slice(startIndex, endIndex), [items, startIndex, endIndex]);

  return (
    <div
      ref={containerRef}
      role="list"
      onScroll={(event) => setScrollTop(event.currentTarget.scrollTop)}
      className={cn("overflow-y-auto", className)}
      style={{ height }}
    >
      <div style={{ height: items.length * itemHeight, position: "relative" }}>
        {visible.map((item, i) => {
          const index = startIndex + i;
          return (
            <div
              key={index}
              role="listitem"
              aria-setsize={items.length}
              aria-posinset={index + 1}
              style={{ position: "absolute", top: index * itemHeight, insetInlineStart: 0, insetInlineEnd: 0, height: itemHeight }}
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
