"use client";

import { useId, useRef } from "react";
import { cn } from "../lib/cn";

export interface RatingInputProps {
  value: number;
  max?: number;
  label: string;
  onChange?: (value: number) => void;
  className?: string;
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={cn("size-5", filled ? "fill-amber-400" : "fill-neutral-300 dark:fill-neutral-700")}
    >
      <path d="M10 1.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L10 14.9l-5.2 2.7 1-5.8-4.3-4.1 5.9-.9z" />
    </svg>
  );
}

export function RatingInput({ value, max = 5, label, onChange, className }: RatingInputProps) {
  const id = useId();
  const stars = Array.from({ length: max }, (_, i) => i + 1);
  const refs = useRef<Array<HTMLButtonElement | null>>([]);

  const handleKeyDown = (e: React.KeyboardEvent, star: number) => {
    if (!onChange) return;
    let next = star;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      next = Math.min(max, star + 1);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      next = Math.max(1, star - 1);
    } else if (e.key === "Home") {
      e.preventDefault();
      next = 1;
    } else if (e.key === "End") {
      e.preventDefault();
      next = max;
    } else {
      return;
    }

    onChange(next);
    refs.current[next - 1]?.focus();
  };

  if (!onChange) {
    return (
      <span role="img" aria-label={`${label}: ${value} out of ${max} stars`} className={cn("inline-flex gap-0.5", className)}>
        {stars.map((star) => (
          <Star key={star} filled={star <= value} />
        ))}
      </span>
    );
  }

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <span id={id} className="text-sm font-medium">{label}</span>
      <div role="radiogroup" aria-labelledby={id} className="inline-flex gap-0.5">
        {stars.map((star) => (
          <button
            key={star}
            ref={(node) => { const arr = [...refs.current]; arr[star - 1] = node; refs.current = arr; }}
            type="button"
            role="radio"
            aria-checked={star === value}
            aria-label={`${star} star${star !== 1 ? "s" : ""}`}
            tabIndex={star === value ? 0 : -1}
            onClick={() => onChange(star)}
            onKeyDown={(e) => handleKeyDown(e, star)}
            className="cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            <Star filled={star <= value} />
          </button>
        ))}
      </div>
      <div aria-live="polite" className="text-xs text-neutral-600 dark:text-neutral-400">
        {value > 0 ? `${value} of ${max} stars` : "No rating"}
      </div>
    </div>
  );
}
