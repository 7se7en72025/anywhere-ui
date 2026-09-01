"use client";

import React, { useCallback, useEffect, useState } from "react";

export interface SnackbarProps {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  autoDismissMs?: number;
  onDismiss?: () => void;
  tone?: "default" | "error";
}

export function Snackbar({
  message,
  actionLabel,
  onAction,
  autoDismissMs = 5000,
  onDismiss,
  tone = "default",
}: SnackbarProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (autoDismissMs <= 0) return;
    const timer = setTimeout(() => {
      setVisible(false);
      onDismiss?.();
    }, autoDismissMs);
    return () => clearTimeout(timer);
  }, [autoDismissMs, onDismiss]);

  const handleDismiss = useCallback(() => {
    setVisible(false);
    onDismiss?.();
  }, [onDismiss]);

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      style={{
        position: "fixed",
        bottom: "1rem",
        left: "50%",
        transform: "translateX(-50%)",
        display: "flex",
        alignItems: "center",
        gap: "0.75rem",
        padding: "0.75rem 1rem",
        borderRadius: "0.5rem",
        backgroundColor: tone === "error" ? "#b3261e" : "#323232",
        color: "#fff",
        fontSize: "0.875rem",
        lineHeight: "1.25rem",
        boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
        zIndex: 9999,
        minWidth: "288px",
        maxWidth: "560px",
      }}
    >
      <span style={{ flex: 1 }}>{message}</span>
      {actionLabel && onAction && (
        <button
          onClick={() => {
            onAction();
            setVisible(false);
          }}
          style={{
            background: "none",
            border: "none",
            color: "#bb86fc",
            fontWeight: 600,
            cursor: "pointer",
            padding: "0.25rem 0.5rem",
            borderRadius: "0.25rem",
            fontSize: "0.875rem",
          }}
          aria-label={actionLabel}
        >
          {actionLabel}
        </button>
      )}
      <button
        onClick={handleDismiss}
        aria-label="Dismiss notification"
        style={{
          background: "none",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          padding: "0.25rem",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.7,
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
    </div>
  );
}
