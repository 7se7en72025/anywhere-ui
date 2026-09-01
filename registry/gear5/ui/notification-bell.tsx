"use client";

import React from "react";

export interface NotificationBellProps {
  count?: number;
  onClick?: () => void;
  size?: number;
}

export function NotificationBell({
  count = 0,
  onClick,
  size = 24,
}: NotificationBellProps) {
  const hasNotifications = count > 0;

  return (
    <button
      onClick={onClick}
      aria-label={`Notifications${hasNotifications ? `, ${count} unread` : ""}`}
      style={{
        position: "relative",
        background: "none",
        border: "none",
        cursor: "pointer",
        padding: "0.5rem",
        borderRadius: "0.5rem",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
      {hasNotifications && (
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: 2,
            right: 2,
            minWidth: 18,
            height: 18,
            borderRadius: 9,
            backgroundColor: "#f44336",
            color: "#fff",
            fontSize: "0.6875rem",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 4px",
            lineHeight: 1,
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      )}
    </button>
  );
}
