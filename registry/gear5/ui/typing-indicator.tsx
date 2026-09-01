"use client";

import React from "react";

export interface TypingIndicatorProps {
  label?: string;
  dotSize?: number;
}

const bounceKeyframes = `
@keyframes typing-bounce {
  0%, 60%, 100% { transform: translateY(0); }
  30% { transform: translateY(-4px); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
`;

export function TypingIndicator({
  label = "typing",
  dotSize = 6,
}: TypingIndicatorProps) {
  return (
    <div
      role="status"
      aria-label={label}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "3px",
        padding: "0.5rem 0.75rem",
        backgroundColor: "#f0f0f0",
        borderRadius: "1rem",
      }}
    >
      <style>{bounceKeyframes}</style>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          aria-hidden="true"
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            backgroundColor: "#999",
            animation: `typing-bounce 1.2s infinite`,
            animationDelay: `${i * 0.15}s`,
          }}
        />
      ))}
    </div>
  );
}
