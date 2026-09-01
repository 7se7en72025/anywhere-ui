"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

export interface IconGridProps {
  icons: { name: string; path: string }[];
  onSelect?: (name: string) => void;
  label?: string;
}

export function IconGrid({
  icons,
  onSelect,
  label = "Icon picker",
}: IconGridProps) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    if (!search) return icons;
    const q = search.toLowerCase();
    return icons.filter((icon) => icon.name.toLowerCase().includes(q));
  }, [icons, search]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const cols = gridRef.current
        ? Math.floor(
            gridRef.current.getBoundingClientRect().width / 48
          )
        : 4;

      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + cols, filtered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - cols, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (filtered[activeIndex]) {
          onSelect?.(filtered[activeIndex].name);
        }
      }
    },
    [filtered, activeIndex, onSelect]
  );

  return (
    <div
      role="dialog"
      aria-label={label}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        padding: "0.75rem",
        borderRadius: "0.75rem",
        border: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#999" strokeWidth="1.5">
          <circle cx="7" cy="7" r="5" />
          <path d="M11 11l3 3" strokeLinecap="round" />
        </svg>
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveIndex(0);
          }}
          placeholder="Search icons…"
          aria-label="Search icons"
          style={{
            flex: 1,
            border: "none",
            outline: "none",
            fontSize: "0.875rem",
            padding: "0.375rem 0",
            backgroundColor: "transparent",
          }}
        />
      </label>
      <div
        ref={gridRef}
        role="grid"
        aria-label="Icons"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(40px, 1fr))",
          gap: "0.25rem",
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {filtered.map((icon, i) => (
          <div key={icon.name} role="row">
            <button
              role="gridcell"
              aria-label={icon.name}
              aria-selected={i === activeIndex}
              onClick={() => onSelect?.(icon.name)}
              style={{
                width: 40,
                height: 40,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: i === activeIndex ? "2px solid #1a73e8" : "1px solid transparent",
                borderRadius: "0.375rem",
                backgroundColor: i === activeIndex ? "#e8f0fe" : "transparent",
                cursor: "pointer",
                background: "none",
                padding: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={icon.path} />
              </svg>
            </button>
          </div>
        ))}
        {filtered.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "#999", fontSize: "0.875rem", padding: "1rem" }}>
            No icons found
          </p>
        )}
      </div>
    </div>
  );
}
