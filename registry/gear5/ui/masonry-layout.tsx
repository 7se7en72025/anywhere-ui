"use client";

import React from "react";

export interface MasonryLayoutProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
  className?: string;
  ariaLabel?: string;
}

export function MasonryLayout({
  children,
  columns = 3,
  gap = "1rem",
  className = "",
  ariaLabel,
}: MasonryLayoutProps) {
  const columnStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap,
    breakInside: "avoid",
  };

  const columnsArray = Array.from({ length: columns }, (_, i) => i);

  const childArray = React.Children.toArray(children);
  const distributed = columnsArray.map(() => [] as React.ReactNode[]);

  childArray.forEach((child, index) => {
    distributed[index % columns].push(child);
  });

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={className}
      style={{
        columnCount: columns,
        columnGap: gap,
      }}
    >
      {distributed.map((column, colIndex) => (
        <div key={colIndex} style={columnStyle}>
          {column}
        </div>
      ))}
    </div>
  );
}
