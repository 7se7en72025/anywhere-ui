"use client";

import React, { useCallback } from "react";

export interface ColorSwatchProps {
  colors: { name: string; hex: string }[];
  label?: string;
}

export function ColorSwatch({ colors, label = "Color palette" }: ColorSwatchProps) {
  const handleCopy = useCallback(async (hex: string) => {
    try {
      await navigator.clipboard.writeText(hex);
    } catch {
      // Fallback: ignore
    }
  }, []);

  return (
    <div
      role="list"
      aria-label={label}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "0.75rem",
      }}
    >
      {colors.map((color) => (
        <div
          key={color.hex}
          role="listitem"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "0.375rem",
          }}
        >
          <div
            style={{
              width: 48,
              height: 48,
              borderRadius: "0.5rem",
              backgroundColor: color.hex,
              border: "1px solid rgba(0,0,0,0.1)",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
            }}
          />
          <span
            style={{
              fontSize: "0.6875rem",
              color: "#666",
              fontFamily: "monospace",
            }}
          >
            {color.hex}
          </span>
          <button
            onClick={() => handleCopy(color.hex)}
            aria-label={`Copy ${color.name} color ${color.hex}`}
            style={{
              padding: "0.125rem 0.375rem",
              border: "1px solid #e0e0e0",
              borderRadius: "0.25rem",
              backgroundColor: "#fff",
              fontSize: "0.625rem",
              color: "#666",
              cursor: "pointer",
            }}
          >
            Copy
          </button>
        </div>
      ))}
    </div>
  );
}
