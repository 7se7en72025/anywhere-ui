"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface TimeRangeProps {
  start: string;
  end: string;
  onStartChange: (time: string) => void;
  onEndChange: (time: string) => void;
  label: string;
  className?: string;
}

function timeToMinutes(time: string): number {
  if (!time) return 0;
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

function isValidRange(start: string, end: string): boolean {
  if (!start || !end) return true;
  return timeToMinutes(end) > timeToMinutes(start);
}

export function TimeRange({ start, end, onStartChange, onEndChange, label, className }: TimeRangeProps) {
  const id = useId();
  const startId = `${id}-start`;
  const endId = `${id}-end`;
  const [touched, setTouched] = useState(false);
  const valid = isValidRange(start, end);

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <span id={id} className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <div className="flex flex-col gap-1">
          <label htmlFor={startId} className="text-xs text-neutral-500 dark:text-neutral-400">
            Start
          </label>
          <input
            id={startId}
            type="time"
            value={start}
            onChange={(e) => onStartChange(e.target.value)}
            aria-describedby={touched && !valid ? `${id}-error` : undefined}
            className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
          />
        </div>
        <span aria-hidden="true" className="mt-5 text-neutral-400">–</span>
        <div className="flex flex-col gap-1">
          <label htmlFor={endId} className="text-xs text-neutral-500 dark:text-neutral-400">
            End
          </label>
          <input
            id={endId}
            type="time"
            value={end}
            onChange={(e) => onEndChange(e.target.value)}
            onBlur={() => setTouched(true)}
            aria-invalid={touched && !valid ? true : undefined}
            aria-describedby={touched && !valid ? `${id}-error` : undefined}
            className={cn(
              "rounded-md border bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-neutral-950",
              touched && !valid ? "border-red-500" : "border-neutral-300 dark:border-neutral-700",
            )}
          />
        </div>
      </div>
      {touched && !valid && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400">
          End time must be after start time
        </p>
      )}
    </div>
  );
}
