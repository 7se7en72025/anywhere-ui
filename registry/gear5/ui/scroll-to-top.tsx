"use client";

import React, { useCallback, useEffect, useState } from "react";

export interface ScrollToTopProps {
  threshold?: number;
  className?: string;
  ariaLabel?: string;
  children?: React.ReactNode;
}

export function ScrollToTop({
  threshold = 300,
  className = "",
  ariaLabel = "Scroll to top",
  children,
}: ScrollToTopProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        scrollToTop();
      }
    },
    [scrollToTop]
  );

  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      className={className}
      onClick={scrollToTop}
      onKeyDown={handleKeyDown}
      style={{
        position: "fixed",
        bottom: "1.5rem",
        insetInlineEnd: "1.5rem",
        width: "3rem",
        height: "3rem",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-primary, #3b82f6)",
        color: "#fff",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.2)",
        transition: "opacity 0.2s, transform 0.2s",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(8px)",
        zIndex: 50,
      }}
    >
      {children ?? (
        <span aria-hidden="true" style={{ fontSize: "1.25rem", lineHeight: 1 }}>
          ↑
        </span>
      )}
    </button>
  );
}
