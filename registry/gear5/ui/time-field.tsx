"use client";

import { useId, useMemo } from "react";
import { useLocale } from "../lib/use-locale";

export interface TimeFieldProps {
  value: string; // "HH:MM", 24-hour, as <input type="time"> always uses internally
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

/**
 * A native `<input type="time">`. The browser already renders it 12-hour with
 * an AM/PM picker or 24-hour, matching each user's own OS locale setting —
 * exactly what `Intl.Locale`'s `hourCycle` would tell a custom-built field to
 * do by hand, for free and for every locale the platform itself supports.
 */
export function TimeField({ value, onChange, label, className }: TimeFieldProps) {
  const id = useId();
  const { locale } = useLocale();

  const preview = useMemo(() => {
    if (!value) return "";
    const [hours, minutes] = value.split(":").map(Number);
    const date = new Date();
    date.setHours(hours, minutes, 0, 0);
    return new Intl.DateTimeFormat(locale, { timeStyle: "short" }).format(date);
  }, [value, locale]);

  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={preview ? `${id}-preview` : undefined}
        className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
      />
      {preview && (
        <span id={`${id}-preview`} className="sr-only">
          {preview}
        </span>
      )}
    </div>
  );
}
