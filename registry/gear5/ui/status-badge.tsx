"use client";

import React from "react";

export interface StatusBadgeProps {
  tone: "info" | "success" | "warning" | "error" | "neutral";
  label: string;
  size?: "sm" | "md";
}

const toneColors: Record<string, string> = {
  info: "#2196f3",
  success: "#4caf50",
  warning: "#ff9800",
  error: "#f44336",
  neutral: "#9e9e9e",
};

export function StatusBadge({ tone, label, size = "md" }: StatusBadgeProps) {
  const dotSize = size === "sm" ? 6 : 8;
  const fontSize = size === "sm" ? "0.75rem" : "0.875rem";

  return (
    <span
      role="status"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        fontSize,
        lineHeight: 1,
        color: "#333",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: "50%",
          backgroundColor: toneColors[tone],
          flexShrink: 0,
        }}
      />
      {label}
    </span>
  );
}
