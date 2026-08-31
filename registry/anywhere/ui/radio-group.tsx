"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface RadioOption {
  value: string;
  label: string;
}

export interface RadioGroupProps {
  name: string;
  legend: string;
  options: RadioOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * A `<fieldset>`/`<legend>` pair around real radio inputs. The legend is the
 * group's name read once by a screen reader on entry — the piece a `<div>`
 * of styled buttons with `role="radio"` sprinkled on has to reimplement by
 * hand and usually gets half right.
 */
export function RadioGroup({ name, legend, options, value, onChange, className }: RadioGroupProps) {
  const id = useId();

  return (
    <fieldset className={cn("flex flex-col gap-2 text-start", className)}>
      <legend className="mb-1 text-sm font-medium">{legend}</legend>
      {options.map((option) => (
        <label key={option.value} htmlFor={`${id}-${option.value}`} className="flex items-center gap-2 text-sm">
          <input
            id={`${id}-${option.value}`}
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
            className="size-4 border-neutral-300 text-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700"
          />
          {option.label}
        </label>
      ))}
    </fieldset>
  );
}
