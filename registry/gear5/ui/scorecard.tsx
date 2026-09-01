"use client";

import React from "react";

export interface ScoreItem {
  label: string;
  value: number;
  maxValue?: number;
}

export interface ScorecardProps {
  stats: ScoreItem[];
  columns?: number;
  className?: string;
  ariaLabel?: string;
}

export function Scorecard({
  stats,
  columns = 3,
  className = "",
  ariaLabel,
}: ScorecardProps) {
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
      {stats.map((stat, index) => {
        const max = stat.maxValue ?? 100;
        const pct = Math.min(100, (stat.value / max) * 100);

        return (
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
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                marginBlockEnd: "0.5rem",
              }}
            >
              <span
                style={{
                  fontSize: "0.75rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  color: "var(--color-muted, #6b7280)",
                }}
              >
                {stat.label}
              </span>
              <span
                style={{
                  fontSize: "1.25rem",
                  fontWeight: 700,
                  color: "var(--color-text, #111827)",
                }}
              >
                {stat.value}
                <span
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 400,
                    color: "var(--color-muted, #6b7280)",
                    marginInlineStart: "0.125rem",
                  }}
                >
                  /{max}
                </span>
              </span>
            </div>
            <div
              role="meter"
              aria-label={`${stat.label}: ${stat.value} of ${max}`}
              aria-valuemin={0}
              aria-valuemax={max}
              aria-valuenow={stat.value}
              style={{
                height: "6px",
                borderRadius: "3px",
                background: "var(--color-border, #e5e7eb)",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  height: "100%",
                  width: `${pct}%`,
                  borderRadius: "3px",
                  background: "var(--color-primary, #3b82f6)",
                  transition: "width 0.3s ease",
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
