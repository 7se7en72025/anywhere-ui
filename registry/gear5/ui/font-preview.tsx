"use client";

import React, { useState } from "react";

export interface FontPreviewProps {
  text?: string;
  fonts?: string[];
  label?: string;
}

const defaultFonts = [
  "Arial",
  "Verdana",
  "Georgia",
  "Times New Roman",
  "Courier New",
  "Trebuchet MS",
  "Palatino",
  "Garamond",
  "Comic Sans MS",
  "Impact",
  "system-ui",
  "monospace",
];

export function FontPreview({
  text = "The quick brown fox jumps over the lazy dog",
  fonts = defaultFonts,
  label = "Font preview",
}: FontPreviewProps) {
  const [fontSize, setFontSize] = useState(16);

  return (
    <div
      role="region"
      aria-label={label}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        <label
          htmlFor="font-size-slider"
          style={{ fontSize: "0.875rem", color: "#666" }}
        >
          Size: {fontSize}px
        </label>
        <input
          id="font-size-slider"
          type="range"
          min={12}
          max={48}
          value={fontSize}
          onChange={(e) => setFontSize(Number(e.target.value))}
          aria-label="Font size"
          style={{ flex: 1, height: 4 }}
        />
      </div>
      <div
        role="list"
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "0.5rem",
        }}
      >
        {fonts.map((font) => (
          <div
            key={font}
            role="listitem"
            style={{
              padding: "0.75rem 1rem",
              borderRadius: "0.5rem",
              border: "1px solid #e0e0e0",
              backgroundColor: "#fafafa",
            }}
          >
            <span
              style={{
                fontSize: "0.6875rem",
                color: "#999",
                display: "block",
                marginBottom: "0.25rem",
              }}
            >
              {font}
            </span>
            <span
              style={{
                fontFamily: font,
                fontSize: `${fontSize}px`,
                lineHeight: 1.4,
                color: "#1a1a1a",
              }}
            >
              {text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
