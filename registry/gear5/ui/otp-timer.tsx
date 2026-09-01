"use client";

import { useId, useEffect, useMemo, useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";

export interface OtpTimerProps {
  /** Duration in seconds. */
  duration: number;
  onResend: () => void;
  label?: string;
  className?: string;
}

export function OtpTimer({ duration, onResend, label = "Didn't receive a code?", className }: OtpTimerProps) {
  const id = useId();
  const [remaining, setRemaining] = useState(duration);
  const canResend = useMemo(() => remaining <= 0, [remaining]);

  useEffect(() => {
    if (remaining <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(timer);
          return 0;
        }
        return r - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [remaining]);

  const handleResend = () => {
    setRemaining(duration);
    onResend();
    announce("New code sent", "polite");
  };

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const timeStr = `${minutes}:${seconds.toString().padStart(2, "0")}`;

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <span id={id} className="text-sm text-neutral-600 dark:text-neutral-400">
        {label}
      </span>
      <div className="flex items-center gap-3">
        {!canResend ? (
          <div aria-live="polite" className="flex items-center gap-2">
            <span aria-hidden="true" className="font-mono text-lg tabular-nums">
              {timeStr}
            </span>
            <span className="sr-only">Code expires in {timeStr}</span>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleResend}
            className="text-sm font-medium text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-400"
          >
            Resend code
          </button>
        )}
      </div>
    </div>
  );
}
