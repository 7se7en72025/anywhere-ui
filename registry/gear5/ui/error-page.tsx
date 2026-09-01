"use client";

import React, { useCallback, useState } from "react";

export interface ErrorPageProps {
  statusCode: 404 | 500 | 503;
  title?: string;
  description?: string;
  onRetry?: () => void;
}

const defaults: Record<number, { title: string; description: string }> = {
  404: {
    title: "Page not found",
    description: "The page you are looking for does not exist or has been moved.",
  },
  500: {
    title: "Server error",
    description: "Something went wrong on our end. Please try again later.",
  },
  503: {
    title: "Service unavailable",
    description: "We are currently performing maintenance. Please check back soon.",
  },
};

export function ErrorPage({
  statusCode,
  title,
  description,
  onRetry,
}: ErrorPageProps) {
  const [retrying, setRetrying] = useState(false);
  const fallback = defaults[statusCode];

  const handleRetry = useCallback(async () => {
    if (!onRetry) return;
    setRetrying(true);
    try {
      await onRetry();
    } finally {
      setRetrying(false);
    }
  }, [onRetry]);

  return (
    <div
      role="alert"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      }}
    >
      <div
        aria-hidden="true"
        style={{
          width: 120,
          height: 120,
          borderRadius: "50%",
          backgroundColor: "#f5f5f5",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: "1.5rem",
          fontSize: "3rem",
          color: "#999",
        }}
      >
        {statusCode === 404 ? "?" : statusCode === 500 ? "!" : "🔧"}
      </div>
      <h1
        style={{
          fontSize: "2rem",
          fontWeight: 700,
          color: "#1a1a1a",
          margin: "0 0 0.5rem",
        }}
      >
        {title || fallback.title}
      </h1>
      <p
        style={{
          fontSize: "1rem",
          color: "#666",
          margin: "0 0 1.5rem",
          maxWidth: 420,
        }}
      >
        {description || fallback.description}
      </p>
      {onRetry && (
        <button
          onClick={handleRetry}
          disabled={retrying}
          style={{
            padding: "0.625rem 1.5rem",
            borderRadius: "0.5rem",
            border: "none",
            backgroundColor: "#1a73e8",
            color: "#fff",
            fontSize: "0.875rem",
            fontWeight: 600,
            cursor: retrying ? "not-allowed" : "pointer",
            opacity: retrying ? 0.7 : 1,
          }}
        >
          {retrying ? "Retrying…" : "Try again"}
        </button>
      )}
    </div>
  );
}
