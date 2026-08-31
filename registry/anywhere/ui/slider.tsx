"use client";

import { useId } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface SliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  label: string;
  onChange: (value: number) => void;
  className?: string;
}

/**
 * A native range input. The direction the thumb moves for "increase" already
 * flips correctly under `dir="rtl"` in every real browser — a from-scratch
 * custom slider has to reimplement that by hand and reliably gets it
 * backwards on the first attempt.
 */
export function Slider({ value, min = 0, max = 100, step = 1, label, onChange, className }: SliderProps) {
  const id = useId();
  const { locale } = useLocale();

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <div className="flex justify-between text-sm">
        <label htmlFor={id}>{label}</label>
        <span aria-hidden="true">{new Intl.NumberFormat(locale).format(value)}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer accent-blue-600"
      />
    </div>
  );
}
