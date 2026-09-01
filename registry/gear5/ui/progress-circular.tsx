"use client";

import React from "react";

export interface ProgressCircularProps {
  value?: number;
  size?: number;
  strokeWidth?: number;
  indeterminate?: boolean;
  label?: string;
}

const rotateKeyframes = `
@keyframes circular-rotate {
  to { transform: rotate(360deg); }
}
`;

const dashKeyframes = `
@keyframes circular-dash {
  0% { stroke-dasharray: 1, 200; stroke-dashoffset: 0; }
  50% { stroke-dasharray: 90, 200; stroke-dashoffset: -35; }
  100% { stroke-dasharray: 90, 200; stroke-dashoffset: -124; }
}
`;

const reducedMotionStyles = `
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

export function ProgressCircular({
  value = 0,
  size = 40,
  strokeWidth = 3.5,
  indeterminate = false,
  label,
}: ProgressCircularProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.min(100, Math.max(0, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuenow={indeterminate ? undefined : clamped}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={label || (indeterminate ? "Loading" : `${clamped}% complete`)}
      style={{
        width: size,
        height: size,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <style>{`${rotateKeyframes}\n${dashKeyframes}\n${reducedMotionStyles}`}</style>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{
          transform: "rotate(-90deg)",
          ...(indeterminate
            ? { animation: "circular-rotate 2s linear infinite" }
            : {}),
        }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e0e0e0"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#1a73e8"
          strokeWidth={strokeWidth}
          strokeDasharray={indeterminate ? undefined : circumference}
          strokeDashoffset={indeterminate ? undefined : offset}
          strokeLinecap="round"
          style={
            indeterminate
              ? {
                  strokeDasharray: "90, 200",
                  animation: "circular-dash 1.5s ease-in-out infinite",
                }
              : { transition: "stroke-dashoffset 0.3s" }
          }
        />
      </svg>
      {!indeterminate && (
        <span
          style={{
            position: "absolute",
            fontSize: size * 0.25,
            fontWeight: 600,
            color: "#333",
          }}
        >
          {Math.round(clamped)}%
        </span>
      )}
    </div>
  );
}
