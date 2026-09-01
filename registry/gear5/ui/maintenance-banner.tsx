"use client";

import React, { useCallback, useEffect, useState } from "react";

export interface MaintenanceBannerProps {
  scheduledEnd: Date;
  message?: string;
  onDismiss?: () => void;
}

function formatTimeRemaining(end: Date): string {
  const diff = Math.max(0, end.getTime() - Date.now());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);
  const parts: string[] = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}m`);
  parts.push(`${seconds}s`);
  return parts.join(" ");
}

export function MaintenanceBanner({
  scheduledEnd,
  message = "Scheduled maintenance in progress",
  onDismiss,
}: MaintenanceBannerProps) {
  const [remaining, setRemaining] = useState(() => formatTimeRemaining(scheduledEnd));
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRemaining(formatTimeRemaining(scheduledEnd));
    }, 1000);
    return () => clearInterval(interval);
  }, [scheduledEnd]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "1rem",
        padding: "0.75rem 1rem",
        backgroundColor: "#fff3e0",
        color: "#e65100",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "1rem" }}>
        🔧
      </span>
      <span>{message}</span>
      <span
        aria-label={`Estimated time remaining: ${remaining}`}
        style={{
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
        }}
      >
        {remaining}
      </span>
      {onDismiss && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss maintenance notice"
          style={{
            background: "none",
            border: "none",
            color: "#e65100",
            cursor: "pointer",
            padding: "0.25rem",
            borderRadius: "0.25rem",
            display: "flex",
            alignItems: "center",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path
              d="M3 3L11 11M11 3L3 11"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
