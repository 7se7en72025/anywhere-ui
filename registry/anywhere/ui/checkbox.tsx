"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface CheckboxProps {
  checked: boolean | "indeterminate";
  onCheckedChange: (checked: boolean) => void;
  label: string;
  disabled?: boolean;
  className?: string;
}

/** A checkbox with a real, clickable, bound label — not an icon next to text. */
export function Checkbox({ checked, onCheckedChange, label, disabled, className }: CheckboxProps) {
  const id = useId();
  const indeterminate = checked === "indeterminate";

  return (
    <label htmlFor={id} className={cn("flex items-center gap-2 text-sm", className)}>
      <input
        id={id}
        type="checkbox"
        checked={indeterminate ? false : checked}
        ref={(node) => {
          if (node) node.indeterminate = indeterminate;
        }}
        disabled={disabled}
        onChange={(event) => onCheckedChange(event.target.checked)}
        className="size-4 rounded border-neutral-300 text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700"
      />
      {label}
    </label>
  );
}
