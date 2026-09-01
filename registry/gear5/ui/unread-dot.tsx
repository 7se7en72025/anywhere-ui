"use client";

import React from "react";

export interface UnreadDotProps {
  size?: number;
  label?: string;
}

export function UnreadDot({ size = 8, label = "Unread" }: UnreadDotProps) {
  return (
    <span
      role="status"
      aria-label={label}
      aria-hidden={!label ? undefined : false}
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        backgroundColor: "#1a73e8",
        flexShrink: 0,
      }}
    />
  );
}
