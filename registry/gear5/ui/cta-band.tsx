"use client";

import React from "react";

export interface CtaBandProps {
  title: string;
  description?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  ctaHref?: string;
  children?: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  gradientFrom?: string;
  gradientTo?: string;
}

export function CtaBand({
  title,
  description,
  ctaText = "Get started",
  onCtaClick,
  ctaHref,
  children,
  className = "",
  ariaLabel,
  gradientFrom = "var(--color-primary, #3b82f6)",
  gradientTo = "var(--color-primary-dark, #2563eb)",
}: CtaBandProps) {
  return (
    <section
      aria-label={ariaLabel}
      className={className}
      style={{
        width: "100%",
        padding: "3rem 1.5rem",
        background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})`,
        color: "#fff",
        borderRadius: "0.75rem",
      }}
    >
      <div
        style={{
          maxWidth: "48rem",
          margin: "0 auto",
          textAlign: "center",
        }}
      >
        <h2
          style={{
            fontSize: "clamp(1.5rem, 3vw, 2rem)",
            fontWeight: 700,
            marginBlockEnd: "0.75rem",
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            style={{
              fontSize: "1.125rem",
              opacity: 0.9,
              marginBlockEnd: "1.5rem",
              lineHeight: 1.6,
            }}
          >
            {description}
          </p>
        )}

        {children}

        <a
          href={ctaHref}
          onClick={onCtaClick}
          role="button"
          aria-label={ctaText}
          style={{
            display: "inline-flex",
            alignItems: "center",
            padding: "0.75rem 2rem",
            borderRadius: "0.5rem",
            background: "#fff",
            color: "var(--color-primary, #3b82f6)",
            fontWeight: 600,
            fontSize: "1rem",
            textDecoration: "none",
            cursor: "pointer",
            transition: "transform 0.2s, box-shadow 0.2s",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-1px)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 12px rgba(0,0,0,0.15)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
            (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
          }}
        >
          {ctaText}
        </a>
      </div>
    </section>
  );
}
