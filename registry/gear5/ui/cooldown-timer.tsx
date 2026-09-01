"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface CooldownTimerProps {
  durationMs: number;
  onComplete?: () => void;
  label?: string;
}

function formatMs(ms: number): string {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) return `${minutes}:${String(seconds).padStart(2, "0")}`;
  return `${seconds}s`;
}

export function CooldownTimer({
  durationMs,
  onComplete,
  label = "Cooldown",
}: CooldownTimerProps) {
  const [remaining, setRemaining] = useState(durationMs);
  const startTime = useRef(0);
  const rafId = useRef<number>(0);

  useEffect(() => {
    startTime.current = Date.now();

    const tick = () => {
      const elapsed = Date.now() - startTime.current;
      const left = Math.max(0, durationMs - elapsed);
      setRemaining(left);
      if (left > 0) {
        rafId.current = requestAnimationFrame(tick);
      } else {
        onComplete?.();
      }
    };

    rafId.current = requestAnimationFrame(tick);
    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [durationMs, onComplete]);

  const progress = remaining > 0 ? remaining / durationMs : 0;

  return (
    <div
      role="timer"
      aria-live="polite"
      aria-label={`${label}: ${formatMs(remaining)} remaining`}
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "0.5rem",
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          background: `conic-gradient(#1a73e8 ${progress * 360}deg, #e0e0e0 ${progress * 360}deg)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            backgroundColor: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "0.75rem",
            fontWeight: 700,
            color: "#333",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          {formatMs(remaining)}
        </div>
      </div>
    </div>
  );
}
