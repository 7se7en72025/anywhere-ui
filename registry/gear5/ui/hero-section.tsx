"use client";

import React from "react";

export interface HeroSectionProps {
  title: string;
  subtitle?: string;
  primaryCta?: { text: string; onClick?: () => void; href?: string };
  secondaryCta?: { text: string; onClick?: () => void; href?: string };
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
}

export function HeroSection({
  title,
  subtitle,
  primaryCta,
  secondaryCta,
  children,
  className = "",
  ariaLabel,
}: HeroSectionProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={className}
      style={{
        width: "100%",
        padding: "4rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        background: "var(--color-hero-bg, #f9fafb)",
      }}
    >
      <h1
        style={{
          fontSize: "clamp(2rem, 5vw, 3.5rem)",
          fontWeight: 800,
          lineHeight: 1.1,
          marginBlockEnd: "1rem",
          color: "var(--color-text, #111827)",
          maxWidth: "48rem",
        }}
      >
        {title}
      </h1>

      {subtitle && (
        <p
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            lineHeight: 1.6,
            color: "var(--color-muted, #6b7280)",
            maxWidth: "36rem",
            marginBlockEnd: "2rem",
          }}
        >
          {subtitle}
        </p>
      )}

      {(primaryCta || secondaryCta) && (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
          }}
        >
          {primaryCta && (
            <a
              href={primaryCta.href}
              onClick={primaryCta.onClick}
              role="button"
              aria-label={primaryCta.text}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                background: "var(--color-primary, #3b82f6)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "1rem",
                textDecoration: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {primaryCta.text}
            </a>
          )}
          {secondaryCta && (
            <a
              href={secondaryCta.href}
              onClick={secondaryCta.onClick}
              role="button"
              aria-label={secondaryCta.text}
              style={{
                display: "inline-flex",
                alignItems: "center",
                padding: "0.75rem 1.5rem",
                borderRadius: "0.5rem",
                border: "1px solid var(--color-border, #e5e7eb)",
                background: "var(--color-bg, #fff)",
                color: "var(--color-text, #111827)",
                fontWeight: 600,
                fontSize: "1rem",
                textDecoration: "none",
                cursor: "pointer",
                transition: "background 0.2s",
              }}
            >
              {secondaryCta.text}
            </a>
          )}
        </div>
      )}

      {children && (
        <div style={{ marginBlockStart: "2rem", width: "100%", maxWidth: "64rem" }}>
          {children}
        </div>
      )}
    </section>
  );
}
