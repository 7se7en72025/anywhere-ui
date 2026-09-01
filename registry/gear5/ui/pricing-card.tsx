"use client";

import React from "react";

export interface PricingCardProps {
  planName: string;
  price: string;
  period?: string;
  description?: string;
  features: string[];
  ctaText?: string;
  onCtaClick?: () => void;
  highlighted?: boolean;
  className?: string;
  ariaLabel?: string;
}

export function PricingCard({
  planName,
  price,
  period,
  description,
  features,
  ctaText = "Get started",
  onCtaClick,
  highlighted = false,
  className = "",
  ariaLabel,
}: PricingCardProps) {
  return (
    <article
      aria-label={ariaLabel ?? `${planName} pricing plan`}
      className={className}
      style={{
        border: highlighted
          ? "2px solid var(--color-primary, #3b82f6)"
          : "1px solid var(--color-border, #e5e7eb)",
        borderRadius: "0.75rem",
        padding: "2rem",
        background: "var(--color-bg, #fff)",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {highlighted && (
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 0,
            insetInline: 0,
            height: "3px",
            background: "var(--color-primary, #3b82f6)",
          }}
        />
      )}

      <h3
        style={{
          fontSize: "1.25rem",
          fontWeight: 600,
          marginBlockEnd: "0.5rem",
        }}
      >
        {planName}
      </h3>

      <div style={{ marginBlockEnd: "0.5rem" }}>
        <span style={{ fontSize: "2.5rem", fontWeight: 700 }}>{price}</span>
        {period && (
          <span
            style={{
              fontSize: "0.875rem",
              color: "var(--color-muted, #6b7280)",
              marginInlineStart: "0.25rem",
            }}
          >
            / {period}
          </span>
        )}
      </div>

      {description && (
        <p
          style={{
            fontSize: "0.875rem",
            color: "var(--color-muted, #6b7280)",
            marginBlockEnd: "1.5rem",
            lineHeight: 1.5,
          }}
        >
          {description}
        </p>
      )}

      <ul
        role="list"
        style={{
          listStyle: "none",
          padding: 0,
          margin: 0,
          marginBlockEnd: "1.5rem",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: "0.75rem",
        }}
      >
        {features.map((feature, index) => (
          <li
            key={index}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: "0.5rem",
              fontSize: "0.875rem",
            }}
          >
            <span aria-hidden="true" style={{ color: "var(--color-success, #10b981)", flexShrink: 0 }}>✓</span>
            {feature}
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={onCtaClick}
        aria-label={`${ctaText} for ${planName}`}
        style={{
          width: "100%",
          padding: "0.75rem 1.5rem",
          borderRadius: "0.5rem",
          border: highlighted ? "none" : "1px solid var(--color-border, #e5e7eb)",
          background: highlighted
            ? "var(--color-primary, #3b82f6)"
            : "var(--color-bg, #fff)",
          color: highlighted ? "#fff" : "var(--color-text, #111827)",
          fontWeight: 600,
          fontSize: "0.875rem",
          cursor: "pointer",
          transition: "background 0.2s, color 0.2s",
        }}
      >
        {ctaText}
      </button>
    </article>
  );
}
