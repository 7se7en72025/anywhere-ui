"use client";

import React, { createContext, useCallback, useContext, useState } from "react";

interface AccordionContextValue {
  expandedItems: Set<string>;
  toggle: (id: string) => void;
}

const AccordionContext = createContext<AccordionContextValue>({
  expandedItems: new Set(),
  toggle: () => {},
});

export interface AccordionNestedProps {
  children: React.ReactNode;
  className?: string;
  ariaLabel?: string;
  allowMultiple?: boolean;
}

export function AccordionNested({
  children,
  className = "",
  ariaLabel,
  allowMultiple = false,
}: AccordionNestedProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggle = useCallback(
    (id: string) => {
      setExpandedItems((prev) => {
        const next = new Set(allowMultiple ? prev : []);
        if (prev.has(id)) {
          next.delete(id);
        } else {
          next.add(id);
        }
        return next;
      });
    },
    [allowMultiple]
  );

  return (
    <AccordionContext.Provider value={{ expandedItems, toggle }}>
      <div
        className={className}
        role="region"
        aria-label={ariaLabel}
      >
        {children}
      </div>
    </AccordionContext.Provider>
  );
}

export interface AccordionItemProps {
  id: string;
  trigger: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function AccordionItem({
  id,
  trigger,
  children,
  className = "",
}: AccordionItemProps) {
  const { expandedItems, toggle } = useContext(AccordionContext);
  const isExpanded = expandedItems.has(id);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle(id);
      }
    },
    [id, toggle]
  );

  return (
    <div className={className} data-state={isExpanded ? "open" : "closed"}>
      <h3>
        <button
          type="button"
          aria-expanded={isExpanded}
          aria-controls={`${id}-content`}
          id={`${id}-trigger`}
          onClick={() => toggle(id)}
          onKeyDown={handleKeyDown}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            padding: "1rem",
            background: "none",
            border: "none",
            cursor: "pointer",
            fontWeight: 500,
            textAlign: "start",
          }}
        >
          {trigger}
          <span
            aria-hidden="true"
            style={{
              display: "inline-block",
              transition: "transform 0.2s ease",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
              marginInlineStart: "0.5rem",
            }}
          >
            ▾
          </span>
        </button>
      </h3>
      <div
        id={`${id}-content`}
        role="region"
        aria-labelledby={`${id}-trigger`}
        hidden={!isExpanded}
        style={{
          overflow: "hidden",
          transition: "max-height 0.3s ease",
          maxHeight: isExpanded ? "500px" : 0,
        }}
      >
        <div style={{ padding: "0 1rem 1rem" }}>
          {children}
        </div>
      </div>
    </div>
  );
}
