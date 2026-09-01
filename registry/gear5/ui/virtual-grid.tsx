"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface VirtualGridProps<T> {
  items: T[];
  columns?: number;
  rowHeight?: number;
  gap?: number;
  renderItem: (item: T, index: number) => React.ReactNode;
  className?: string;
  ariaLabel?: string;
  overscan?: number;
}

export function VirtualGrid<T>({
  items,
  columns = 3,
  rowHeight = 200,
  gap = 16,
  renderItem,
  className = "",
  ariaLabel,
  overscan = 3,
}: VirtualGridProps<T>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollTop, setScrollTop] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => setScrollTop(container.scrollTop);
    const handleResize = () => setContainerHeight(container.clientHeight);

    container.addEventListener("scroll", handleScroll, { passive: true });

    let resizeObserver: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(handleResize);
      resizeObserver.observe(container);
    }

    handleResize();

    return () => {
      container.removeEventListener("scroll", handleScroll);
      resizeObserver?.disconnect();
    };
  }, []);

  const totalRows = Math.ceil(items.length / columns);
  const totalHeight = totalRows * (rowHeight + gap) - gap;

  const startRow = Math.max(0, Math.floor(scrollTop / (rowHeight + gap)) - overscan);
  const endRow = Math.min(
    totalRows,
    Math.ceil((scrollTop + containerHeight) / (rowHeight + gap)) + overscan
  );

  const visibleItems: { item: T; index: number; row: number; col: number }[] = [];

  for (let row = startRow; row < endRow; row++) {
    for (let col = 0; col < columns; col++) {
      const index = row * columns + col;
      if (index < items.length) {
        visibleItems.push({ item: items[index], index, row, col });
      }
    }
  }

  const cellWidth = `calc((100% - ${(columns - 1) * gap}px) / ${columns})`;

  return (
    <div
      ref={containerRef}
      role="list"
      aria-label={ariaLabel}
      className={className}
      style={{
        overflow: "auto",
        position: "relative",
        height: "100%",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          height: totalHeight,
          position: "relative",
        }}
      >
        {visibleItems.map(({ item, index, row, col }) => {
          const top = row * (rowHeight + gap);
          const left = `calc(${col} * (${cellWidth} + ${gap}px))`;

          return (
            <div
              key={index}
              role="listitem"
              style={{
                position: "absolute",
                top,
                left,
                width: cellWidth,
                height: rowHeight,
              }}
            >
              {renderItem(item, index)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
