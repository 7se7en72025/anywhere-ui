"use client";

import React from "react";

export interface OnlineIndicatorProps {
  online: boolean;
  size?: number;
  label?: string;
}

export function OnlineIndicator({
  online,
  size = 10,
  label,
}: OnlineIndicatorProps) {
  return (
    <span
      role="status"
      aria-label={label || (online ? "Online" : "Offline")}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "0.375rem",
        fontSize: "0.875rem",
        color: "#333",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          backgroundColor: online ? "#4caf50" : "#f44336",
          flexShrink: 0,
          boxShadow: online
            ? "0 0 0 2px rgba(76,175,80,0.2)"
            : "0 0 0 2px rgba(244,67,54,0.2)",
        }}
      />
      {label && (online ? "Online" : "Offline")}
    </span>
  );
}
