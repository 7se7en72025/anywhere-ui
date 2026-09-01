"use client";

import { useId, useRef } from "react";
import { cn } from "../lib/cn";

export interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label: string;
  className?: string;
}

export function PinInput({ value, onChange, length = 6, label, className }: PinInputProps) {
  const id = useId();
  const refs = useRef<Array<HTMLInputElement | null>>([]);

  const setDigit = (index: number, digit: string) => {
    const next = value.split("");
    next[index] = digit;
    onChange(next.join("").slice(0, length));
    if (digit && index < length - 1) refs.current[index + 1]?.focus();
  };

  return (
    <fieldset className={cn("flex flex-col gap-1.5 text-start", className)}>
      <legend className="text-sm font-medium">{label}</legend>
      <div className="flex gap-2">
        {Array.from({ length }, (_, index) => (
          <input
            key={index}
            ref={(node) => {
              refs.current[index] = node;
            }}
            id={`${id}-${index}`}
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={1}
            aria-label={`Digit ${index + 1} of ${length}`}
            value={value[index] ?? ""}
            onChange={(event) => setDigit(index, event.target.value.replace(/\D/g, "").slice(-1))}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !value[index] && index > 0) {
                refs.current[index - 1]?.focus();
              }
            }}
            onPaste={(event) => {
              event.preventDefault();
              onChange(event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length));
            }}
            className="size-11 rounded-md border border-neutral-300 text-center text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
          />
        ))}
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Enter {length} digits
      </p>
    </fieldset>
  );
}
