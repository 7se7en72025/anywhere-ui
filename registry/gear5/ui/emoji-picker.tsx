"use client";

import React, { useCallback, useMemo, useRef, useState } from "react";

export interface EmojiPickerProps {
  onSelect?: (emoji: string) => void;
  label?: string;
}

const categories: { name: string; emojis: string[] }[] = [
  { name: "Smileys", emojis: ["😀", "😃", "😄", "😁", "😆", "😅", "🤣", "😂", "🙂", "😊", "😇", "🥰", "😍", "🤩", "😘", "😗", "😚", "😙", "🥲", "😋", "😛", "😜", "🤪", "😝", "🤑", "🤗", "🤭", "🤫", "🤔", "🫡"] },
  { name: "Gestures", emojis: ["👋", "🤚", "✋", "🖖", "👌", "🤌", "🤏", "✌️", "🤞", "🫰", "🤟", "🤘", "🤙", "👈", "👉", "👆", "🖕", "👇", "☝️", "👍", "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "🫶", "👐", "🤲"] },
  { name: "Hearts", emojis: ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟", "♥️"] },
  { name: "Animals", emojis: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐻‍❄️", "🐨", "🐯", "🦁", "🐮", "🐷", "🐸", "🐵", "🙈", "🙉", "🙊", "🐒", "🐔", "🐧", "🐦", "🐤", "🐣", "🐥", "🦆", "🦅", "🦉", "🦇"] },
  { name: "Food", emojis: ["🍎", "🍐", "🍊", "🍋", "🍌", "🍉", "🍇", "🍓", "🫐", "🍈", "🍒", "🍑", "🥭", "🍍", "🥥", "🥝", "🍅", "🍆", "🥑", "🥦", "🥬", "🥒", "🌶️", "🫑", "🌽", "🥕", "🫒", "🧄", "🧅", "🥔"] },
];

export function EmojiPicker({ onSelect, label = "Emoji picker" }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const [activeIndex, setActiveIndex] = useState(0);
  const gridRef = useRef<HTMLDivElement>(null);

  const visibleEmojis = useMemo(() => {
    const cat = categories[activeCategory];
    if (!cat) return [];
    if (!search) return cat.emojis;
    return cat.emojis;
  }, [activeCategory, search]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const cols = 8;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, visibleEmojis.length - 1));
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + cols, visibleEmojis.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - cols, 0));
      } else if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        if (visibleEmojis[activeIndex]) {
          onSelect?.(visibleEmojis[activeIndex]);
        }
      }
    },
    [visibleEmojis, activeIndex, onSelect]
  );

  return (
    <div
      role="dialog"
      aria-label={label}
      style={{
        display: "flex",
        flexDirection: "column",
        width: 320,
        borderRadius: "0.75rem",
        border: "1px solid #e0e0e0",
        backgroundColor: "#fff",
        overflow: "hidden",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div style={{ padding: "0.5rem", borderBottom: "1px solid #e0e0e0" }}>
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setActiveIndex(0);
          }}
          placeholder="Search emoji…"
          aria-label="Search emoji"
          style={{
            width: "100%",
            border: "1px solid #e0e0e0",
            borderRadius: "0.375rem",
            padding: "0.5rem",
            fontSize: "0.875rem",
            outline: "none",
            boxSizing: "border-box",
          }}
        />
      </div>
      <div
        role="tablist"
        aria-label="Emoji categories"
        style={{
          display: "flex",
          borderBottom: "1px solid #e0e0e0",
          overflowX: "auto",
        }}
      >
        {categories.map((cat, i) => (
          <button
            key={cat.name}
            role="tab"
            aria-selected={i === activeCategory}
            aria-label={cat.name}
            onClick={() => {
              setActiveCategory(i);
              setActiveIndex(0);
            }}
            style={{
              flex: 1,
              padding: "0.5rem 0.25rem",
              border: "none",
              borderBottom: i === activeCategory ? "2px solid #1a73e8" : "2px solid transparent",
              backgroundColor: i === activeCategory ? "#e8f0fe" : "transparent",
              cursor: "pointer",
              fontSize: "0.6875rem",
              color: i === activeCategory ? "#1a73e8" : "#666",
              whiteSpace: "nowrap",
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>
      <div
        ref={gridRef}
        role="grid"
        aria-label="Emojis"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(8, 1fr)",
          gap: 2,
          padding: "0.5rem",
          maxHeight: 240,
          overflowY: "auto",
        }}
      >
        {visibleEmojis.map((emoji, i) => (
          <div key={`${emoji}-${i}`} role="row">
            <button
              role="gridcell"
              aria-label={emoji}
              aria-selected={i === activeIndex}
              onClick={() => onSelect?.(emoji)}
              style={{
                width: 36,
                height: 36,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: i === activeIndex ? "2px solid #1a73e8" : "none",
                borderRadius: "0.375rem",
                backgroundColor: i === activeIndex ? "#e8f0fe" : "transparent",
                cursor: "pointer",
                fontSize: "1.25rem",
                padding: 0,
                background: "none",
              }}
            >
              {emoji}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
