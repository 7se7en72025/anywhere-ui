"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface RatingProps {
  value: number;
  max?: number;
  label: string;
  onChange?: (value: number) => void;
  className?: string;
}

/**
 * A star rating. Read-only mode is a `role="img"` with one accessible label
 * ("4 out of 5 stars") — not five separate icons a screen reader announces
 * one at a time. Editable mode is a real radio group, so keyboard users can
 * arrow between values.
 */
export function Rating({ value, max = 5, label, onChange, className }: RatingProps) {
  const id = useId();
  const stars = Array.from({ length: max }, (_, i) => i + 1);

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
    <fieldset className={cn("inline-flex gap-0.5", className)}>
      <legend className="sr-only">{label}</legend>
      {stars.map((star) => (
        <label key={star} className="cursor-pointer">
          <input
            type="radio"
            name={id}
            value={star}
            checked={value === star}
            onChange={() => onChange(star)}
            className="sr-only"
          />
          <Star filled={star <= value} />
        </label>
      ))}
    </fieldset>
  );
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
