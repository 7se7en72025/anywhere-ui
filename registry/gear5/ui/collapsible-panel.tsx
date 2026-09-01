"use client";

import React, { useCallback, useRef, useState } from "react";

export interface CollapsiblePanelProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  defaultOpen?: boolean;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function CollapsiblePanel({
  trigger,
  children,
  defaultOpen = false,
  className = "",
  triggerClassName = "",
  contentClassName = "",
}: CollapsiblePanelProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number | undefined>(
    defaultOpen ? undefined : 0
  );

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      if (next) {
        const el = contentRef.current;
        if (el) {
          setHeight(el.scrollHeight);
          requestAnimationFrame(() => setHeight(undefined));
        }
      } else {
        const el = contentRef.current;
        if (el) {
          setHeight(el.scrollHeight);
          requestAnimationFrame(() => setHeight(0));
        }
      }
      return next;
    });
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
    <div className={className}>
      <button
        type="button"
        aria-expanded={isOpen}
        className={triggerClassName}
        onClick={toggle}
        onKeyDown={handleKeyDown}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontWeight: 500,
          padding: "0.5rem 0",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            display: "inline-block",
            transition: "transform 0.2s ease",
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        >
          ▸
        </span>
        {trigger}
      </button>
      <div
        ref={contentRef}
        role="region"
        className={contentClassName}
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ overflow: "hidden" }}>
          <div style={{ paddingBlock: isOpen ? "0.5rem" : 0 }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
