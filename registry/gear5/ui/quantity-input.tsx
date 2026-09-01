"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface QuantityInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

export function QuantityInput({ value, onChange, label, min = 0, max = Infinity, step = 1, className }: QuantityInputProps) {
  const id = useId();

  const decrement = () => onChange(Math.max(min, value - step));
  const increment = () => onChange(Math.min(max, value + step));

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="inline-flex items-center">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={decrement}
          disabled={value <= min}
          className="flex size-9 items-center justify-center rounded-s-md border border-neutral-300 text-lg font-medium hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          −
        </button>
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => {
            const v = Number(e.target.value);
            if (Number.isFinite(v)) onChange(Math.min(max, Math.max(min, v)));
          }}
          aria-label={label}
          className="h-9 w-16 border-y border-neutral-300 bg-white text-center text-base tabular-nums focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={increment}
          disabled={value >= max}
          className="flex size-9 items-center justify-center rounded-e-md border border-neutral-300 text-lg font-medium hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 dark:border-neutral-700 dark:hover:bg-neutral-800"
        >
          +
        </button>
      </div>
    </div>
  );
}
