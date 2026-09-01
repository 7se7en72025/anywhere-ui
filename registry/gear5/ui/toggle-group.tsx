"use client";

import { useId, useRef } from "react";
import { cn } from "../lib/cn";

export interface ToggleOption {
  value: string;
  label: string;
}

export interface ToggleGroupProps {
  options: ToggleOption[];
  value: string | string[];
  onChange: (value: string | string[]) => void;
  label: string;
  multiple?: boolean;
  className?: string;
}

export function ToggleGroup({ options, value, onChange, label, multiple = false, className }: ToggleGroupProps) {
  const id = useId();
  const containerRef = useRef<HTMLDivElement>(null);

  const isSelected = (opt: string) =>
    multiple ? (value as string[]).includes(opt) : value === opt;

  const toggle = (val: string) => {
    if (multiple) {
      const arr = value as string[];
      onChange(arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val]);
    } else {
      onChange(val);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    const buttons = containerRef.current?.querySelectorAll<HTMLElement>("[role='button']");
    if (!buttons) return;
    const index = Array.from(buttons).indexOf(document.activeElement as HTMLElement);

    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      buttons[(index + 1) % buttons.length]?.focus();
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      buttons[(index - 1 + buttons.length) % buttons.length]?.focus();
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <span id={id} className="text-sm font-medium">{label}</span>
      <div
        ref={containerRef}
        role="group"
        aria-labelledby={id}
        onKeyDown={handleKeyDown}
        className="inline-flex"
      >
        {options.map((option) => {
          const selected = isSelected(option.value);
          return (
            <button
              key={option.value}
              type="button"
              role="button"
              aria-pressed={selected}
              onClick={() => toggle(option.value)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium border focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                selected
                  ? "bg-neutral-900 text-white border-neutral-900 dark:bg-neutral-100 dark:text-neutral-900 dark:border-neutral-100"
                  : "bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50 dark:bg-neutral-950 dark:text-neutral-300 dark:border-neutral-700 dark:hover:bg-neutral-800",
                // Collapse borders between siblings
                "[&:not(:first-child)]:-ms-px",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
