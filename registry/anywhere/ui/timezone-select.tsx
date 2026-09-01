"use client";

import { useId, useMemo } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface TimezoneSelectProps {
  label: string;
  name?: string;
  value: string;
  onChange: (zone: string) => void;
  /** Restrict the list. Defaults to every zone the runtime knows. */
  zones?: string[];
  description?: string;
  className?: string;
}

/** Current UTC offset for a zone, in minutes, via formatted parts. */
function offsetMinutes(zone: string, at: Date): number {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "longOffset",
  }).formatToParts(at);

  const name = parts.find((part) => part.type === "timeZoneName")?.value ?? "GMT";
  const match = /GMT([+-])(\d{2}):?(\d{2})?/.exec(name);
  if (!match) return 0;

  const sign = match[1] === "-" ? -1 : 1;
  return sign * (Number(match[2]) * 60 + Number(match[3] ?? 0));
}

/**
 * A timezone picker labelled in the reader's language and ordered by offset.
 *
 * The usual version lists raw IANA identifiers — "Asia/Kolkata" — alphabetically,
 * which asks the user to know their own zone's database name and to find it in
 * a list of nearly 600. Here each entry pairs the localised long zone name with
 * its current offset, and the list is ordered by offset, so a user scans to
 * roughly where they are rather than searching for a string.
 *
 * Offsets are computed for the current moment, so they reflect daylight saving
 * as it actually stands today rather than a hardcoded table that is wrong for
 * half the year.
 */
export function TimezoneSelect({
  label,
  name,
  value,
  onChange,
  zones,
  description,
  className,
}: TimezoneSelectProps) {
  const id = useId();
  const { locale, direction } = useLocale();
  const descriptionId = `${id}-description`;

  const options = useMemo(() => {
    const now = new Date();

    const list =
      zones ??
      // supportedValuesOf is the only way to enumerate zones, and is missing on
      // older runtimes; fall back to the user's own zone plus UTC so the
      // control still functions rather than rendering empty.
      (typeof Intl.supportedValuesOf === "function"
        ? Intl.supportedValuesOf("timeZone")
        : [Intl.DateTimeFormat().resolvedOptions().timeZone, "UTC"]);

    return list
      .map((zone) => {
        const offset = offsetMinutes(zone, now);
        const sign = offset < 0 ? "-" : "+";
        const absolute = Math.abs(offset);
        const stamp = `${sign}${String(Math.floor(absolute / 60)).padStart(2, "0")}:${String(absolute % 60).padStart(2, "0")}`;

        const long =
          new Intl.DateTimeFormat(locale, { timeZone: zone, timeZoneName: "long" })
            .formatToParts(now)
            .find((part) => part.type === "timeZoneName")?.value ?? zone;

        return { zone, offset, label: `(UTC${stamp}) ${long} — ${zone}` };
      })
      .sort((a, b) => a.offset - b.offset || a.zone.localeCompare(b.zone, locale));
  }, [zones, locale]);

  return (
    <div dir={direction} className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}

      <select
        id={id}
        name={name}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-describedby={description ? descriptionId : undefined}
        className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
      >
        {options.map((option) => (
          <option key={option.zone} value={option.zone}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
