"use client";

import React from "react";

export interface StatItem {
  label: string;
  value: string | number;
  description?: string;
}

export interface StatGridProps {
  stats: StatItem[];
  columns?: 2 | 3 | 4;
  className?: string;
  ariaLabel?: string;
  renderItem?: (stat: StatItem, index: number) => React.ReactNode;
}

export function StatGrid({
  stats,
  columns = 2,
  className = "",
  ariaLabel,
  renderItem,
}: StatGridProps) {
  return (
    <div
      role="list"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: "1rem",
      }}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          role="listitem"
          style={{
            padding: "1rem",
            border: "1px solid var(--color-border, #e5e7eb)",
            borderRadius: "0.5rem",
            background: "var(--color-bg, #fff)",
          }}
        >
          {renderItem ? (
            renderItem(stat, index)
          ) : (
            <>
              <div
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-muted, #6b7280)",
                  marginBlockEnd: "0.25rem",
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "var(--color-text, #111827)",
                }}
              >
                {stat.value}
              </div>
              {stat.description && (
                <div
                  style={{
                    fontSize: "0.875rem",
                    color: "var(--color-muted, #6b7280)",
                    marginBlockStart: "0.25rem",
                  }}
                >
                  {stat.description}
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
