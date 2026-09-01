"use client";

import React, { useCallback, useEffect, useState } from "react";

export interface RateLimitNoticeProps {
  retryAfterSeconds: number;
  onRetry?: () => void;
}

export function RateLimitNotice({
  retryAfterSeconds,
  onRetry,
}: RateLimitNoticeProps) {
  const [remaining, setRemaining] = useState(retryAfterSeconds);

  useEffect(() => {
    if (remaining <= 0) return;
    const timer = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [retryAfterSeconds]);

  const handleRetry = useCallback(() => {
    if (remaining > 0 || !onRetry) return;
    setRemaining(retryAfterSeconds);
    onRetry();
  }, [remaining, onRetry, retryAfterSeconds]);

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "1rem",
        padding: "2rem",
        borderRadius: "0.75rem",
        backgroundColor: "#fff3e0",
        border: "1px solid #ffcc80",
        textAlign: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "2rem" }}>
        🐢
      </span>
      <h2
        style={{
          margin: 0,
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "#e65100",
        }}
      >
        Slow down
      </h2>
      <p style={{ margin: 0, fontSize: "0.875rem", color: "#bf360c" }}>
        You&apos;re sending requests too quickly. Please wait before trying
        again.
      </p>
      <span
        aria-label={`${remaining} seconds until you can retry`}
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#e65100",
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {remaining}s
      </span>
      <button
        onClick={handleRetry}
        disabled={remaining > 0}
        aria-label={remaining > 0 ? `Retry available in ${remaining} seconds` : "Retry now"}
        style={{
          padding: "0.5rem 1.25rem",
          borderRadius: "0.5rem",
          border: "none",
          backgroundColor: remaining > 0 ? "#ffcc80" : "#e65100",
          color: remaining > 0 ? "#bf360c" : "#fff",
          fontSize: "0.875rem",
          fontWeight: 600,
          cursor: remaining > 0 ? "not-allowed" : "pointer",
        }}
      >
        {remaining > 0 ? "Please wait" : "Retry now"}
      </button>
    </div>
  );
}
