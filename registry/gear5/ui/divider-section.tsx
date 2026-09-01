"use client";

import React from "react";

export interface DividerSectionProps {
  label?: string;
  ornament?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function DividerSection({
  label,
  ornament,
  className = "",
  style,
}: DividerSectionProps) {
  return (
    <div
      role="separator"
      aria-label={label}
      className={className}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "1rem",
        paddingBlock: "2rem",
        ...style,
      }}
    >
      <div
        aria-hidden="true"
        style={{
          flex: 1,
          height: "1px",
          background: "var(--color-border, #e5e7eb)",
        }}
      />

      {ornament ?? (
        <span
          style={{
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            color: "var(--color-muted, #9ca3af)",
            fontWeight: 500,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}

      <div
        aria-hidden="true"
        style={{
          flex: 1,
          height: "1px",
          background: "var(--color-border, #e5e7eb)",
        }}
      />
    </div>
  );
}
