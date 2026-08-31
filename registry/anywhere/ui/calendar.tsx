"use client";

import { useMemo, useState } from "react";
import { getCalendar, getFirstDayOfWeek } from "../lib/locale";
import { useLocale } from "../lib/use-locale";
import { cn } from "../lib/cn";

export interface CalendarProps {
  value: Date;
  onChange: (date: Date) => void;
  className?: string;
}

/**
 * A month grid in the reader's own calendar system — `islamic-umalqura` for
 * `ar-SA`, `buddhist` for `th-TH`, `persian` for `fa-IR` — and starting on
 * their week's actual first day, not always Sunday. Built on
 * `Intl.DateTimeFormat`'s calendar-aware formatting rather than hand-rolled
 * Gregorian month arithmetic, which is simply wrong outside it.
 */
export function Calendar({ value, onChange, className }: CalendarProps) {
  const { locale } = useLocale();
  const calendar = getCalendar(locale);
  const firstDay = getFirstDayOfWeek(locale);
  const [cursor, setCursor] = useState(new Date(value.getFullYear(), value.getMonth(), 1));

  const monthFormat = useMemo(() => new Intl.DateTimeFormat(locale, { month: "long", year: "numeric", calendar }), [locale, calendar]);
  const dayFormat = useMemo(() => new Intl.DateTimeFormat(locale, { day: "numeric", calendar }), [locale, calendar]);
  const weekdayFormat = useMemo(() => new Intl.DateTimeFormat(locale, { weekday: "short" }), [locale]);

  const days = useMemo(() => {
    const start = new Date(cursor);
    const startWeekday = (start.getDay() - (firstDay % 7) + 7) % 7;
    start.setDate(start.getDate() - startWeekday);

    return Array.from({ length: 42 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  }, [cursor, firstDay]);

  const weekdayLabels = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(2024, 0, 7 + ((i + firstDay) % 7));
    return weekdayFormat.format(date);
  });

  return (
    <div className={cn("w-72 text-start", className)}>
      <div className="mb-2 flex items-center justify-between">
        <button
          type="button"
          aria-label="Previous month"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
          className="rounded p-1 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800"
        >
          <span aria-hidden="true" className="rtl:-scale-x-100">‹</span>
        </button>
        <span className="text-sm font-medium">{monthFormat.format(cursor)}</span>
        <button
          type="button"
          aria-label="Next month"
          onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
          className="rounded p-1 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-800"
        >
          <span aria-hidden="true" className="rtl:-scale-x-100">›</span>
        </button>
      </div>

      {/* A grid role requires row children containing columnheader/gridcell —
          a flat list of gridcells directly under role="grid" fails
          aria-required-children. `contents` keeps each week's row invisible
          to CSS grid layout (its cells still lay out in the parent's 7
          columns) while giving axe and screen readers real row structure. */}
      <div role="grid" aria-label={monthFormat.format(cursor)} className="grid grid-cols-7 gap-0.5 text-center text-sm">
        <div role="row" className="contents">
          {weekdayLabels.map((label, i) => (
            // Not aria-hidden: an aria-hidden columnheader leaves its role="row"
            // with no accessible children at all, which is what a screen
            // reader user needs least — a grid with unlabelled columns.
            <div key={i} role="columnheader" className="pb-1 text-xs text-neutral-500 dark:text-neutral-400">
              {label}
            </div>
          ))}
        </div>

        {Array.from({ length: days.length / 7 }, (_, week) => (
          <div key={week} role="row" className="contents">
            {days.slice(week * 7, week * 7 + 7).map((date) => {
              const inMonth = date.getMonth() === cursor.getMonth();
              const isSelected = date.toDateString() === value.toDateString();

              return (
                <button
                  key={date.toISOString()}
                  type="button"
                  role="gridcell"
                  aria-selected={isSelected}
                  tabIndex={isSelected ? 0 : -1}
                  onClick={() => onChange(date)}
                  className={cn(
                    "aspect-square rounded-md text-xs focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                    !inMonth && "text-neutral-300 dark:text-neutral-700",
                    isSelected && "bg-blue-600 text-white",
                    inMonth && !isSelected && "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                  )}
                >
                  {dayFormat.format(date)}
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}
