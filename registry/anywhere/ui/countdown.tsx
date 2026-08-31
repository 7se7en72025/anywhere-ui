"use client";

import { useEffect, useState } from "react";
import { useLocale } from "../lib/use-locale";

export interface CountdownProps {
  target: Date | number;
  /** Called once when the countdown reaches zero. */
  onComplete?: () => void;
  className?: string;
}

function remaining(target: Date | number): number {
  return Math.max(0, new Date(target).getTime() - Date.now());
}

/**
 * A live countdown with digits formatted through `Intl.NumberFormat`, so a
 * reader using Arabic-Indic or Devanagari numerals sees their own digits, not
 * Western ones dropped into an otherwise-translated page. Updates once a
 * second — no animation, so there is nothing here for reduced-motion to
 * disable.
 */
export function Countdown({ target, onComplete, className }: CountdownProps) {
  const { locale } = useLocale();
  const [ms, setMs] = useState(() => remaining(target));

  useEffect(() => {
    if (ms <= 0) {
      onComplete?.();
      return;
    }
    const timer = setInterval(() => setMs(remaining(target)), 1000);
    return () => clearInterval(timer);
  }, [target, ms, onComplete]);

  const totalSeconds = Math.ceil(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const format = (n: number) => new Intl.NumberFormat(locale, { minimumIntegerDigits: 2 }).format(n);

  return (
    <span role="timer" aria-live="off" className={className}>
      {hours > 0 && `${format(hours)}:`}
      {format(minutes)}:{format(seconds)}
    </span>
  );
}
