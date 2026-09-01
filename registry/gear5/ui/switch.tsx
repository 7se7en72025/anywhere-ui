"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface SwitchProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

/**
 * A binary toggle built on a real `<button role="switch">`, not a checkbox
 * styled to look like one — `role="switch"` announces "on/off", where a
 * checkbox announces "checked/unchecked", and the two are not interchangeable
 * to a screen reader user choosing between them by ear.
 */
export function Switch({ checked, onCheckedChange, label, disabled, className }: SwitchProps) {
  const id = useId();

  return (
    <label htmlFor={id} className={cn("flex items-center gap-2 text-sm", className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors motion-reduce:transition-none",
          "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
          checked ? "bg-blue-600" : "bg-neutral-300 dark:bg-neutral-700",
          disabled && "opacity-50",
        )}
      >
        <span
          className={cn(
            "inline-block size-4 translate-x-0.5 rounded-full bg-white transition-transform motion-reduce:transition-none rtl:-translate-x-0.5",
            checked && "translate-x-4 rtl:-translate-x-4",
          )}
        />
      </button>
      {label}
    </label>
  );
}
