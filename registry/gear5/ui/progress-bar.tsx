"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface ProgressBarProps {
  /** 0–100. Omit for an indeterminate bar. */
  value?: number;
  label: string;
  className?: string;
}

/**
 * A determinate or indeterminate progress bar with a real accessible value —
 * `aria-valuenow`, not just a filled `<div>` a screen reader has no way to
 * read the percentage of.
 */
export function ProgressBar({ value, label, className }: ProgressBarProps) {
  const id = useId();
  const determinate = typeof value === "number";
  const clamped = determinate ? Math.min(100, Math.max(0, value)) : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <div className="flex justify-between text-sm">
        <span id={id}>{label}</span>
        {determinate && <span aria-hidden="true">{Math.round(clamped!)}%</span>}
      </div>

      <div
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={determinate ? Math.round(clamped!) : undefined}
        className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800"
      >
        <div
          className={cn(
            "h-full rounded-full bg-blue-600 transition-[width] duration-300 motion-reduce:transition-none",
            !determinate && "w-1/3 animate-pulse motion-reduce:animate-none",
          )}
          style={determinate ? { width: `${clamped}%` } : undefined}
        />
      </div>
    </div>
  );
}
