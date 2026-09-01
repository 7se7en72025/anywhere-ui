"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DateRangePickerProps {
  value: DateRange;
  onChange: (range: DateRange) => void;
  label: string;
  className?: string;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  return Array.from({ length: last.getDate() }, (_, i) => new Date(year, month, i + 1));
}

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.toDateString() === b.toDateString();
}

function isBetween(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return date > start && date < end;
}

export function DateRangePicker({ value, onChange, label, className }: DateRangePickerProps) {
  const id = useId();
  const { locale } = useLocale();
  const [leftMonth, setLeftMonth] = useState(() => new Date());
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const weekdays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(2024, 0, 7 + i);
      return new Intl.DateTimeFormat(locale, { weekday: "short" }).format(d);
    }), [locale]);

  const months = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => {
      const d = new Date(2024, i, 1);
      return new Intl.DateTimeFormat(locale, { month: "long" }).format(d);
    }), [locale]);

  const rightMonth = useMemo(() => new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1), [leftMonth]);

  const selectDate = (date: Date) => {
    if (selecting === "start") {
      onChange({ start: date, end: null });
      setSelecting("end");
    } else {
      if (value.start && date < value.start) {
        onChange({ start: date, end: value.start });
      } else {
        onChange({ start: value.start, end: date });
      }
      setSelecting("start");
    }
  };

  const renderMonth = (month: Date) => {
    const days = getDaysInMonth(month.getFullYear(), month.getMonth());
    const startPad = month.getDay();
    const paddedDays = [...Array(startPad).fill(null), ...days];

    return (
      <div className="w-64">
        <div className="mb-2 text-center text-sm font-medium">
          {months[month.getMonth()]} {month.getFullYear()}
        </div>
        <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
          {weekdays.map((d) => (
            <div key={d} className="pb-1 text-neutral-500 dark:text-neutral-400">{d}</div>
          ))}
          {paddedDays.map((day, i) => {
            if (!day) return <div key={`pad-${i}`} />;
            const isStart = isSameDay(day, value.start);
            const isEnd = isSameDay(day, value.end);
            const inRange = isBetween(day, value.start, value.end);

            return (
              <button
                key={day.toISOString()}
                type="button"
                aria-label={`${months[day.getMonth()]} ${day.getDate()}, ${day.getFullYear()}`}
                aria-current={isStart || isEnd ? "date" : undefined}
                onClick={() => selectDate(day)}
                className={cn(
                  "aspect-square rounded-md text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                  (isStart || isEnd) && "bg-blue-600 text-white",
                  inRange && "bg-blue-100 dark:bg-blue-900/30",
                  !isStart && !isEnd && !inRange && "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                )}
              >
                {day.getDate()}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  const rangeText = value.start && value.end
    ? `${value.start.toLocaleDateString(locale)} – ${value.end.toLocaleDateString(locale)}`
    : value.start
      ? `${value.start.toLocaleDateString(locale)} – Select end date`
      : "Select a date range";

  return (
    <div className={cn("flex flex-col gap-2 text-start", className)}>
      <span id={id} className="text-sm font-medium">{label}</span>
      <div aria-live="polite" className="text-sm text-neutral-600 dark:text-neutral-400">
        {rangeText}
      </div>
      <div className="flex gap-4">
        {renderMonth(leftMonth)}
        {renderMonth(rightMonth)}
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() - 1, 1))}
          className="rounded px-2 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          ← Previous
        </button>
        <button
          type="button"
          onClick={() => setLeftMonth(new Date(leftMonth.getFullYear(), leftMonth.getMonth() + 1, 1))}
          className="rounded px-2 py-1 text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800"
        >
          Next →
        </button>
      </div>
    </div>
  );
}
