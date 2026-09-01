"use client";

import { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface SliderRangeProps {
  min: number;
  max: number;
  minVal: number;
  maxVal: number;
  onChange: (min: number, max: number) => void;
  label: string;
  step?: number;
  className?: string;
}

export function SliderRange({ min, max, minVal, maxVal, onChange, label, step = 1, className }: SliderRangeProps) {
  const id = useId();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState<"min" | "max" | null>(null);

  const toPercent = (val: number) => ((val - min) / (max - min)) * 100;
  const fromPercent = (pct: number) => {
    const raw = min + (pct / 100) * (max - min);
    return Math.round(raw / step) * step;
  };

  const handlePointerDown = (thumb: "min" | "max") => (e: React.PointerEvent) => {
    e.preventDefault();
    setDragging(thumb);
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const pct = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const val = Math.round(fromPercent(pct) / step) * step;

    if (dragging === "min") {
      onChange(Math.min(val, maxVal - step), maxVal);
    } else {
      onChange(minVal, Math.max(val, minVal + step));
    }
  };

  const handlePointerUp = () => setDragging(null);

  const handleKeyDown = (thumb: "min" | "max") => (e: React.KeyboardEvent) => {
    const val = thumb === "min" ? minVal : maxVal;
    let next = val;

    if (e.key === "ArrowRight" || e.key === "ArrowUp") {
      e.preventDefault();
      next = Math.min(max, val + step);
    } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
      e.preventDefault();
      next = Math.max(min, val - step);
    } else if (e.key === "Home") {
      e.preventDefault();
      next = min;
    } else if (e.key === "End") {
      e.preventDefault();
      next = max;
    }

    if (thumb === "min") {
      onChange(Math.min(next, maxVal - step), maxVal);
    } else {
      onChange(minVal, Math.max(next, minVal + step));
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <div className="flex justify-between text-sm">
        <span id={id}>{label}</span>
        <span aria-hidden="true">{minVal} – {maxVal}</span>
      </div>
      <div
        ref={trackRef}
        role="group"
        aria-labelledby={id}
        className="relative h-2 cursor-pointer"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <div className="absolute inset-y-1/2 h-1 -translate-y-1/2 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        <div
          className="absolute inset-y-1/2 h-1 -translate-y-1/2 rounded-full bg-blue-600"
          style={{ left: `${toPercent(minVal)}%`, right: `${100 - toPercent(maxVal)}%` }}
        />
        <input
          type="range"
          aria-label={`${label} minimum`}
          aria-valuemin={min}
          aria-valuemax={maxVal - step}
          aria-valuenow={minVal}
          min={min}
          max={maxVal - step}
          step={step}
          value={minVal}
          onChange={(e) => onChange(Number(e.target.value), maxVal)}
          className="absolute inset-0 size-full opacity-0"
          style={{ pointerEvents: "none" }}
        />
        <div
          role="slider"
          aria-label={`${label} minimum`}
          aria-valuemin={min}
          aria-valuemax={maxVal - step}
          aria-valuenow={minVal}
          tabIndex={0}
          onPointerDown={handlePointerDown("min")}
          onKeyDown={handleKeyDown("min")}
          className="absolute top-1/2 z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-600 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-neutral-950"
          style={{ left: `${toPercent(minVal)}%` }}
        />
        <div
          role="slider"
          aria-label={`${label} maximum`}
          aria-valuemin={minVal + step}
          aria-valuemax={max}
          aria-valuenow={maxVal}
          tabIndex={0}
          onPointerDown={handlePointerDown("max")}
          onKeyDown={handleKeyDown("max")}
          className="absolute top-1/2 z-10 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-blue-600 bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-neutral-950"
          style={{ left: `${toPercent(maxVal)}%` }}
        />
      </div>
    </div>
  );
}
