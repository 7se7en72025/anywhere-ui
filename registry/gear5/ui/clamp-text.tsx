"use client";

import React, { useCallback, useRef, useState } from "react";

export interface ClampTextProps {
  children: React.ReactNode;
  lines?: number;
  className?: string;
  showMoreText?: string;
  showLessText?: string;
  ariaLabel?: string;
}

export function ClampText({
  children,
  lines = 3,
  className = "",
  showMoreText = "Show more",
  showLessText = "Show less",
  ariaLabel,
}: ClampTextProps) {
  const [expanded, setExpanded] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggle = useCallback(() => {
    setExpanded((prev) => !prev);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    },
    [toggle]
  );

  return (
    <div className={className} aria-label={ariaLabel}>
      <div
        ref={contentRef}
        style={{
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: expanded ? "unset" : lines,
          overflow: expanded ? "visible" : "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {children}
      </div>
      <button
        type="button"
        onClick={toggle}
        onKeyDown={handleKeyDown}
        aria-expanded={expanded}
        style={{
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "var(--color-primary, #3b82f6)",
          fontWeight: 500,
          textDecoration: "underline",
          textDecorationStyle: "dotted",
          textUnderlineOffset: "2px",
          marginBlockStart: "0.5rem",
        }}
      >
        {expanded ? showLessText : showMoreText}
      </button>
    </div>
  );
}
