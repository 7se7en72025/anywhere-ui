"use client";

import React from "react";

export interface LoadingSkeletonProps {
  width?: string | number;
  height?: string | number;
  variant?: "text" | "circular" | "rectangular";
  lines?: number;
  style?: React.CSSProperties;
}

const shimmerKeyframes = `
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

export function LoadingSkeleton({
  width = "100%",
  height = "1rem",
  variant = "text",
  lines = 1,
  style,
}: LoadingSkeletonProps) {
  const baseStyle: React.CSSProperties = {
    width,
    height: variant === "circular" ? width : height,
    borderRadius:
      variant === "circular"
        ? "50%"
        : variant === "rectangular"
          ? "0.5rem"
          : "0.25rem",
    background:
      "linear-gradient(90deg, #e0e0e0 25%, #f0f0f0 50%, #e0e0e0 75%)",
    backgroundSize: "200% 100%",
    animation: "shimmer 1.5s infinite linear",
    ...style,
  };

  if (variant === "text" && lines > 1) {
    return (
      <>
        <style>{shimmerKeyframes}</style>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              aria-hidden="true"
              style={{
                ...baseStyle,
                width: i === lines - 1 ? "60%" : "100%",
              }}
            />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <style>{shimmerKeyframes}</style>
      <div aria-hidden="true" style={baseStyle} />
    </>
  );
}
