"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface ScrollSpyItem {
  id: string;
  label: string;
}

export interface ScrollSpyProps {
  items: ScrollSpyItem[];
  children: React.ReactNode;
  navClassName?: string;
  activeClassName?: string;
  activeStyle?: React.CSSProperties;
  offset?: number;
}

export function ScrollSpy({
  items,
  children,
  navClassName = "",
  activeClassName = "",
  activeStyle,
  offset = 100,
}: ScrollSpyProps) {
  const [activeId, setActiveId] = useState<string>("");
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[];

    if (headings.length === 0) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: `-${offset}px 0px -60% 0px`,
        threshold: 0,
      }
    );

    headings.forEach((heading) => observerRef.current!.observe(heading));

    return () => observerRef.current?.disconnect();
  }, [items, offset]);

  const scrollTo = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    },
    []
  );

  return (
    <nav aria-label="Table of contents" className={navClassName}>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(item.id);
              }}
              className={activeId === item.id ? activeClassName : ""}
              style={{
                display: "block",
                paddingBlock: "0.5rem",
                paddingInline: "1rem",
                color: activeId === item.id
                  ? "var(--color-primary, #3b82f6)"
                  : "inherit",
                textDecoration: "none",
                fontWeight: activeId === item.id ? 600 : 400,
                borderInlineStart: activeId === item.id
                  ? "2px solid var(--color-primary, #3b82f6)"
                  : "2px solid transparent",
                transition: "all 0.2s ease",
                ...activeStyle,
              }}
              aria-current={activeId === item.id ? "location" : undefined}
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
      {children}
    </nav>
  );
}
