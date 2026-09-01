"use client";

import { useMemo, useState } from "react";
import { cn } from "../lib/cn";

export type CalendarViewMode = "month" | "week" | "day";

export interface CalendarEvent {
  id: string;
  title: string;
  date: Date;
  color?: string;
}

export interface CalendarViewProps {
  events?: CalendarEvent[];
  className?: string;
}

function startOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function startOfWeek(date: Date): Date {
  const d = new Date(date);
  d.setDate(d.getDate() - d.getDay());
  return d;
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function isSameDay(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatMonthYear(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { month: "long", year: "numeric" }).format(date);
}

function formatDay(date: Date): string {
  return new Intl.DateTimeFormat(undefined, { weekday: "short", month: "short", day: "numeric" }).format(date);
}

const WEEKDAY_LABELS = Array.from({ length: 7 }, (_, i) => {
  const d = new Date(2024, 0, 7 + i);
  return new Intl.DateTimeFormat(undefined, { weekday: "short" }).format(d);
});

/**
 * Calendar with month/week/day views and keyboard navigation. The month grid
 * uses `role="grid"` with proper row/cell structure. Arrow keys navigate days;
 * Enter/Space selects.
 */
export function CalendarView({ events = [], className }: CalendarViewProps) {
  const [mode, setMode] = useState<CalendarViewMode>("month");
  const [cursor, setCursor] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(null);

  const monthDays = useMemo(() => {
    const start = startOfMonth(cursor);
    const gridStart = startOfWeek(start);
    return Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));
  }, [cursor]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(cursor);
    return Array.from({ length: 7 }, (_, i) => addDays(start, i));
  }, [cursor]);

  const dayEvents = events.filter((e) => isSameDay(e.date, cursor));

  function navigatePrev() {
    if (mode === "month") {
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1));
    } else if (mode === "week") {
      setCursor(addDays(cursor, -7));
    } else {
      setCursor(addDays(cursor, -1));
    }
  }

  function navigateNext() {
    if (mode === "month") {
      setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1));
    } else if (mode === "week") {
      setCursor(addDays(cursor, 7));
    } else {
      setCursor(addDays(cursor, 1));
    }
  }

  function handleDayKeyDown(event: React.KeyboardEvent, date: Date) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setSelected(date);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      setCursor(addDays(cursor, 1));
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      setCursor(addDays(cursor, -1));
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setCursor(addDays(cursor, 7));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setCursor(addDays(cursor, -7));
    }
  }

  const headerLabel = mode === "month" ? formatMonthYear(cursor) : mode === "week" ? formatMonthYear(cursor) : formatDay(cursor);

  return (
    <div className={cn("w-80 text-start", className)}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Previous"
            onClick={navigatePrev}
            className="rounded p-1 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800"
          >
            <span aria-hidden="true" className="rtl:-scale-x-100">‹</span>
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={navigateNext}
            className="rounded p-1 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800"
          >
            <span aria-hidden="true" className="rtl:-scale-x-100">›</span>
          </button>
          <span className="ms-2 text-sm font-semibold">{headerLabel}</span>
        </div>
        <div className="flex gap-1">
          {(["month", "week", "day"] as const).map((m) => (
            <button
              key={m}
              type="button"
              aria-pressed={mode === m}
              onClick={() => setMode(m)}
              className={cn(
                "rounded px-2 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                mode === m
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {mode === "month" && (
        <div role="grid" aria-label={formatMonthYear(cursor)} className="grid grid-cols-7 gap-0.5 text-center text-xs">
          <div role="row" className="contents">
            {WEEKDAY_LABELS.map((label) => (
              <div role="columnheader" key={label} className="p-1 font-medium text-neutral-500">
                {label}
              </div>
            ))}
          </div>
          {monthDays.map((day, i) => {
            const isCurrent = isSameDay(day, new Date());
            const isSelected = selected && isSameDay(day, selected);
            const hasEvents = events.some((e) => isSameDay(e.date, day));
            return (
              <div role="row" key={i} className="contents">
                <button
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected ?? undefined}
                  aria-current={isCurrent ? "date" : undefined}
                  tabIndex={isCurrent ? 0 : -1}
                  onClick={() => setSelected(day)}
                  onKeyDown={(e) => handleDayKeyDown(e, day)}
                  className={cn(
                    "relative rounded p-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                    isCurrent && !isSelected && "bg-blue-50 dark:bg-blue-950",
                    isSelected && "bg-blue-600 text-white",
                  )}
                >
                  {day.getDate()}
                  {hasEvents && (
                    <span aria-hidden="true" className="absolute bottom-0.5 start-1/2 size-1 -translate-x-1/2 rounded-full bg-blue-500" />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {mode === "week" && (
        <div className="flex flex-col gap-1">
          {weekDays.map((day) => {
            const dayEvts = events.filter((e) => isSameDay(e.date, day));
            const isCurrent = isSameDay(day, new Date());
            return (
              <button
                key={day.toISOString()}
                type="button"
                aria-label={formatDay(day)}
                onClick={() => {
                  setSelected(day);
                  setCursor(day);
                }}
                className={cn(
                  "flex items-center gap-3 rounded p-2 text-start text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                  isCurrent && "bg-blue-50 dark:bg-blue-950",
                )}
              >
                <span className="w-8 text-center font-medium">{day.getDate()}</span>
                <span className="flex-1 text-neutral-600 dark:text-neutral-400">
                  {dayEvts.length > 0 ? `${dayEvts.length} event(s)` : "No events"}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {mode === "day" && (
        <div className="flex flex-col gap-2">
          {dayEvents.length === 0 ? (
            <p className="py-8 text-center text-sm text-neutral-400">No events</p>
          ) : (
            dayEvents.map((event) => (
              <div
                key={event.id}
                className="rounded-md border border-neutral-200 p-3 dark:border-neutral-800"
              >
                <span className="text-sm font-medium">{event.title}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
