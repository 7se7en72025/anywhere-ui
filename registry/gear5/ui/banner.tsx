"use client";

import React, { useCallback, useState } from "react";

export interface BannerProps {
  children: React.ReactNode;
  tone?: "info" | "warning" | "error" | "success";
  dismissible?: boolean;
  onDismiss?: () => void;
  ariaLabel?: string;
}

const toneColors: Record<string, { bg: string; color: string }> = {
  info: { bg: "#e3f2fd", color: "#0d47a1" },
  warning: { bg: "#fff3e0", color: "#e65100" },
  error: { bg: "#fdecea", color: "#b71c1c" },
  success: { bg: "#e8f5e9", color: "#1b5e20" },
};

export function Banner({
  children,
  tone = "info",
  dismissible = true,
  onDismiss,
  ariaLabel,
}: BannerProps) {
  const [visible, setVisible] = useState(true);
  const colors = toneColors[tone];

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
      aria-label={ariaLabel}
      style={{
        width: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.75rem",
        padding: "0.625rem 1rem",
        backgroundColor: colors.bg,
        color: colors.color,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        textAlign: "center",
      }}
    >
      <span style={{ flex: 1 }}>{children}</span>
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss banner"
          style={{
            background: "none",
            border: "none",
            color: colors.color,
            cursor: "pointer",
            padding: "0.25rem",
            borderRadius: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 4L12 12M12 4L4 12"
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
