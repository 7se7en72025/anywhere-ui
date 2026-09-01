"use client";

import { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface ColorPickerProps {
  value: string;
  onChange: (color: string) => void;
  label: string;
  colors?: string[];
  className?: string;
}

const DEFAULT_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e", "#14b8a6",
  "#3b82f6", "#8b5cf6", "#ec4899", "#f43f5e", "#06b6d4",
  "#10b981", "#84cc16", "#a855f7", "#6366f1", "#0ea5e9",
  "#d946ef", "#fb923c", "#facc15", "#4ade80", "#2dd4bf",
  "#60a5fa", "#a78bfa", "#f472b6", "#e11d48", "#0891b2",
];

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${r}, ${g}, ${b})`;
}

export function ColorPicker({ value, onChange, label, colors = DEFAULT_COLORS, className }: ColorPickerProps) {
  const id = useId();
  const [activeIndex, setActiveIndex] = useState(colors.indexOf(value));

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const cols = 5;
    let next = activeIndex;

    if (e.key === "ArrowRight") next = Math.min(colors.length - 1, activeIndex + 1);
    else if (e.key === "ArrowLeft") next = Math.max(0, activeIndex - 1);
    else if (e.key === "ArrowDown") next = Math.min(colors.length - 1, activeIndex + cols);
    else if (e.key === "ArrowUp") next = Math.max(0, activeIndex - cols);
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onChange(colors[activeIndex]);
      return;
    }

    if (next !== activeIndex) {
      e.preventDefault();
      setActiveIndex(next);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <span id={id} className="text-sm font-medium">
        {label}
      </span>
      <div
        role="radiogroup"
        aria-labelledby={id}
        onKeyDown={handleKeyDown}
        className="grid grid-cols-5 gap-1.5"
      >
        {colors.map((color, index) => (
          <button
            key={color}
            type="button"
            role="radio"
            aria-checked={color === value}
            aria-label={color}
            tabIndex={index === activeIndex ? 0 : -1}
            onClick={() => onChange(color)}
            className={cn(
              "size-8 rounded-full border-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
              color === value ? "border-neutral-900 dark:border-white scale-110" : "border-transparent",
            )}
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Selected: {value} ({hexToRgb(value)})
      </p>
    </div>
  );
}
