"use client";

import React, { useCallback, useState } from "react";

export interface InlineAlertProps {
  tone: "info" | "warning" | "error" | "success";
  children: React.ReactNode;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const toneStyles: Record<string, { bg: string; border: string; color: string; icon: string }> = {
  info: { bg: "#e8f4fd", border: "#2196f3", color: "#0d47a1", icon: "ℹ" },
  warning: { bg: "#fff8e1", border: "#ffc107", color: "#e65100", icon: "⚠" },
  error: { bg: "#fdecea", border: "#f44336", color: "#b71c1c", icon: "✕" },
  success: { bg: "#e8f5e9", border: "#4caf50", color: "#1b5e20", icon: "✓" },
};

export function InlineAlert({
  tone,
  children,
  dismissible = false,
  onDismiss,
}: InlineAlertProps) {
  const [visible, setVisible] = useState(true);
  const styles = toneStyles[tone];

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  if (!visible) return null;

  const role = tone === "error" ? "alert" : "status";

  return (
    <div
      role={role}
      aria-live={tone === "error" ? "assertive" : "polite"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "0.75rem",
        padding: "0.875rem 1rem",
        borderRadius: "0.5rem",
        borderInlineStart: `4px solid ${styles.border}`,
        backgroundColor: styles.bg,
        color: styles.color,
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
      }}
    >
      <span aria-hidden="true" style={{ fontSize: "1rem", lineHeight: 1 }}>
        {styles.icon}
      </span>
      <div style={{ flex: 1 }}>{children}</div>
      {dismissible && (
        <button
          onClick={handleDismiss}
          aria-label="Dismiss alert"
          style={{
            background: "none",
            border: "none",
            color: styles.color,
            cursor: "pointer",
            padding: "0.125rem",
            borderRadius: "0.25rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
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
