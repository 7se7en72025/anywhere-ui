"use client";

import React from "react";

export interface TestimonialCardProps {
  quote: string;
  avatar?: React.ReactNode;
  name: string;
  role?: string;
  className?: string;
  ariaLabel?: string;
}

export function TestimonialCard({
  quote,
  avatar,
  name,
  role,
  className = "",
  ariaLabel,
}: TestimonialCardProps) {
  return (
    <figure
      aria-label={ariaLabel}
      className={className}
      style={{
        margin: 0,
        padding: "1.5rem",
        border: "1px solid var(--color-border, #e5e7eb)",
        borderRadius: "0.75rem",
        background: "var(--color-bg, #fff)",
      }}
    >
      <blockquote
        style={{
          margin: 0,
          padding: 0,
          fontSize: "1rem",
          lineHeight: 1.6,
          color: "var(--color-text, #374151)",
          fontStyle: "italic",
          marginBlockEnd: "1rem",
        }}
      >
        <span aria-hidden="true" style={{ fontSize: "1.5rem", lineHeight: 0 }}>{'\u0022'}</span>
        {quote}
        <span aria-hidden="true" style={{ fontSize: "1.5rem", lineHeight: 0 }}>{'\u0022'}</span>
      </blockquote>

      <figcaption
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {avatar && (
          <div
            style={{
              width: "2.5rem",
              height: "2.5rem",
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
              background: "var(--color-border, #e5e7eb)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {avatar}
          </div>
        )}
        <div>
          <div
            style={{
              fontWeight: 600,
              fontSize: "0.875rem",
              color: "var(--color-text, #111827)",
            }}
          >
            {name}
          </div>
          {role && (
            <div
              style={{
                fontSize: "0.75rem",
                color: "var(--color-muted, #6b7280)",
              }}
            >
              {role}
            </div>
          )}
        </div>
      </figcaption>
    </figure>
  );
}
