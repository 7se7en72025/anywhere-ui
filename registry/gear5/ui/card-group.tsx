"use client";

import React from "react";

export interface CardGroupProps {
  children: React.ReactNode;
  columns?: number;
  gap?: string;
  className?: string;
  ariaLabel?: string;
}

export function CardGroup({
  children,
  columns = 3,
  gap = "1.5rem",
  className = "",
  ariaLabel,
}: CardGroupProps) {
  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, calc((100% - ${(columns - 1) * 1.5}rem) / ${columns})), 1fr))`,
        gap,
      }}
    >
      {React.Children.map(children, (child, index) => (
        <div key={index} role="listitem">
          {child}
        </div>
      ))}
    </div>
  );
}
