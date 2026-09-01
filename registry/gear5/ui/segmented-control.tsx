"use client";

import { useId, useRef } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface SegmentedOption {
  value: string;
  label: string;
}

export interface SegmentedControlProps {
  label: string;
  options: SegmentedOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

/**
 * A segmented control implemented as a real radiogroup with roving tabindex.
 *
 * The usual version is a row of buttons with `aria-pressed`, which tells a
 * screen reader there are four independent toggles rather than one choice of
 * four, and leaves every segment in the tab order. Here the group takes one
 * tab stop and arrow keys move between segments — the pattern the ARIA
 * authoring practices specify, and the one keyboard users expect.
 *
 * Arrow direction follows the writing direction: under RTL, ArrowLeft moves
 * to the *next* option, because that is where "next" visually is.
 */
export function SegmentedControl({
  label,
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps) {
  const id = useId();
  const { direction } = useLocale();
  const container = useRef<HTMLDivElement>(null);

  function focusAt(index: number) {
    const wrapped = (index + options.length) % options.length;
    onChange(options[wrapped].value);

    const radios = container.current?.querySelectorAll<HTMLElement>('[role="radio"]');
    radios?.[wrapped]?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const index = options.findIndex((option) => option.value === value);
    const forward = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const backward = direction === "rtl" ? "ArrowRight" : "ArrowLeft";

    if (event.key === forward || event.key === "ArrowDown") {
      event.preventDefault();
      focusAt(index + 1);
    } else if (event.key === backward || event.key === "ArrowUp") {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusAt(0);
    } else if (event.key === "End") {
      event.preventDefault();
      focusAt(options.length - 1);
    }
  }

  return (
    <div
      ref={container}
      role="radiogroup"
      aria-label={label}
      dir={direction}
      onKeyDown={handleKeyDown}
      className={cn(
        "inline-flex rounded-md border border-neutral-300 p-0.5 text-start dark:border-neutral-700",
        className,
      )}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <button
            key={option.value}
            id={`${id}-${option.value}`}
            type="button"
            role="radio"
            aria-checked={selected}
            // Exactly one segment is tabbable; arrows move within the group.
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded px-3 py-1.5 text-sm font-medium",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
              selected
                ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "text-neutral-600 dark:text-neutral-400",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
