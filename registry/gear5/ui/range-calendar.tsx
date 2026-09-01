"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "../lib/cn";

export interface DateRange2 {
  start: Date | null;
  end: Date | null;
}

export interface RangeCalendarProps {
  value: DateRange2;
  onChange: (range: DateRange2) => void;
  label: string;
  className?: string;
}

const WEEKDAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function isSameDay(a: Date | null, b: Date | null): boolean {
  if (!a || !b) return false;
  return a.toDateString() === b.toDateString();
}

function isBetween(date: Date, start: Date | null, end: Date | null): boolean {
  if (!start || !end) return false;
  return date > start && date < end;
}

export function RangeCalendar({ value, onChange, label, className }: RangeCalendarProps) {
  const id = useId();
  const [cursor, setCursor] = useState(new Date());
  const [selecting, setSelecting] = useState<"start" | "end">("start");

  const days = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startDay = first.getDay();
    const start = new Date(first);
    start.setDate(start.getDate() - startDay);

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, [cursor]);

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

  const handleKeyDown = (e: React.KeyboardEvent, date: Date) => {
    const currentIdx = days.findIndex((d) => d.toDateString() === date.toDateString());
    let nextIdx = currentIdx;

    if (e.key === "ArrowRight") nextIdx = currentIdx + 1;
    else if (e.key === "ArrowLeft") nextIdx = currentIdx - 1;
    else if (e.key === "ArrowDown") nextIdx = currentIdx + 7;
    else if (e.key === "ArrowUp") nextIdx = currentIdx - 7;
    else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      selectDate(date);
      return;
    } else return;

    e.preventDefault();
    if (nextIdx >= 0 && nextIdx < days.length) {
      const nextDate = days[nextIdx];
      if (nextDate.getMonth() !== cursor.getMonth()) {
        setCursor(new Date(nextDate.getFullYear(), nextDate.getMonth(), 1));
      }
    }
  };

  const rangeText = value.start && value.end
    ? `${value.start.toLocaleDateString()} – ${value.end.toLocaleDateString()}`
    : value.start
      ? `${value.start.toLocaleDateString()} – Select end date`
      : "Select a date range";

  return (
    <div className={cn("w-72 text-start", className)}>
      <span id={id} className="text-sm font-medium">{label}</span>
      <div aria-live="polite" className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
        {rangeText}
      </div>

      <div className="mb-2 mt-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="rounded p-1 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800"
        >
          ‹
        </button>
        <span className="text-sm font-medium">{MONTHS[cursor.getMonth()]} {cursor.getFullYear()}</span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="rounded p-1 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800"
        >
          ›
        </button>
      </div>

      <div role="grid" aria-labelledby={id} className="grid grid-cols-7 gap-0.5 text-center text-sm">
        <div role="row" className="contents">
          {WEEKDAYS.map((d) => (
            <div key={d} role="columnheader" className="pb-1 text-xs text-neutral-500 dark:text-neutral-400">{d}</div>
          ))}
        </div>
        {Array.from({ length: days.length / 7 }, (_, week) => (
          <div key={week} role="row" className="contents">
            {days.slice(week * 7, week * 7 + 7).map((date) => {
              const inMonth = date.getMonth() === cursor.getMonth();
              const isStart = isSameDay(date, value.start);
              const isEnd = isSameDay(date, value.end);
              const inRange = isBetween(date, value.start, value.end);

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  role="gridcell"
                  aria-selected={isStart || isEnd}
                  tabIndex={isStart || isEnd ? 0 : -1}
                  onClick={() => selectDate(date)}
                  onKeyDown={(e) => handleKeyDown(e, date)}
                  className={cn(
                    "aspect-square rounded-md text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                    !inMonth && "text-neutral-300 dark:text-neutral-700",
                    (isStart || isEnd) && "bg-blue-600 text-white",
                    inRange && "bg-blue-100 dark:bg-blue-900/30",
                    inMonth && !isStart && !isEnd && !inRange && "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  )}
                >
                  {date.getDate()}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
