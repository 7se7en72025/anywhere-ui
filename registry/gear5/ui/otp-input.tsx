"use client";

import { useRef } from "react";
import { cn } from "../lib/cn";

export interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  label: string;
  className?: string;
}

/**
 * One-time-code entry as a single logical field split across boxes for
 * sighted users, but announced and pasted as one value — each box carries
 * `autoComplete="one-time-code"` so a platform's SMS autofill can target it,
 * and that same attribute is exactly what excludes it from `draft-storage`.
 */
export function OtpInput({ value, onChange, length = 6, label, className }: OtpInputProps) {
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
            inputMode="numeric"
            autoComplete={index === 0 ? "one-time-code" : "off"}
            maxLength={1}
            aria-label={`Digit ${index + 1} of ${length}`}
            value={value[index] ?? ""}
            onChange={(event) => setDigit(index, event.target.value.replace(/\D/g, "").slice(-1))}
            onKeyDown={(event) => {
              if (event.key === "Backspace" && !value[index] && index > 0) refs.current[index - 1]?.focus();
            }}
            onPaste={(event) => {
              event.preventDefault();
              onChange(event.clipboardData.getData("text").replace(/\D/g, "").slice(0, length));
            }}
            className="size-11 rounded-md border border-neutral-300 text-center text-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
          />
        ))}
      </div>
    </fieldset>
  );
}
