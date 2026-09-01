"use client";

import React from "react";

export interface FeaturedCardProps {
  children: React.ReactNode;
  title?: string;
  accentColor?: string;
  className?: string;
  ariaLabel?: string;
}

export function FeaturedCard({
  children,
  title,
  accentColor = "var(--color-primary, #3b82f6)",
  className = "",
  ariaLabel,
}: FeaturedCardProps) {
  return (
    <article
      aria-label={ariaLabel}
      className={className}
      style={{
        border: "1px solid var(--color-border, #e5e7eb)",
        borderInlineStart: `4px solid ${accentColor}`,
        borderRadius: "0.5rem",
        padding: "1.5rem",
        background: "var(--color-bg, #fff)",
        transition: "box-shadow 0.2s ease",
      }}
    >
      {title && (
        <h3
          style={{
            fontSize: "1.125rem",
            fontWeight: 600,
            marginBlockEnd: "0.75rem",
            color: "var(--color-text, #111827)",
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </article>
  );
}
