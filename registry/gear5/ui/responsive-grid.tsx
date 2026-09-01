"use client";

import React from "react";

export interface ResponsiveGridProps {
  children: React.ReactNode;
  minColumnSize?: string;
  maxColumnSize?: string;
  gap?: string;
  className?: string;
  ariaLabel?: string;
}

export function ResponsiveGrid({
  children,
  minColumnSize = "250px",
  maxColumnSize = "1fr",
  gap = "1rem",
  className = "",
  ariaLabel,
}: ResponsiveGridProps) {
  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minColumnSize}, 100%), ${maxColumnSize}))`,
        gap,
      }}
    >
      {children}
    </div>
  );
}
