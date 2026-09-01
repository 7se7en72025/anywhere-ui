"use client";

import React, { useCallback, useRef, useState } from "react";

export interface BeforeAfterProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  label?: string;
}

export function BeforeAfter({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  label = "Before and after comparison",
}: BeforeAfterProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(50);
  const dragging = useRef(false);

  const updatePosition = useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    setPosition((x / rect.width) * 100);
  }, []);

  const handleMouseDown = useCallback(() => {
    dragging.current = true;
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!dragging.current) return;
      updatePosition(e.clientX);
    },
    [updatePosition]
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = false;
  }, []);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      updatePosition(e.touches[0].clientX);
    },
    [updatePosition]
  );

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={label}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchMove={handleTouchMove}
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "0.75rem",
        cursor: "ew-resize",
        userSelect: "none",
      }}
    >
      <img
        src={afterSrc}
        alt={afterLabel}
        style={{ width: "100%", display: "block" }}
        draggable={false}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${position}%`,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src={beforeSrc}
          alt={beforeLabel}
          style={{
            width: `${(100 / position) * 100}%`,
            maxWidth: "none",
            display: "block",
          }}
          draggable={false}
        />
      </div>
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          top: 0,
          left: `${position}%`,
          width: 3,
          height: "100%",
          backgroundColor: "#fff",
          transform: "translateX(-50%)",
          boxShadow: "0 0 4px rgba(0,0,0,0.3)",
        }}
      />
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleMouseDown}
        role="slider"
        aria-label="Comparison slider"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(position)}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") setPosition((p) => Math.max(0, p - 2));
          if (e.key === "ArrowRight") setPosition((p) => Math.min(100, p + 2));
        }}
        style={{
          position: "absolute",
          top: "50%",
          left: `${position}%`,
          transform: "translate(-50%, -50%)",
          width: 40,
          height: 40,
          borderRadius: "50%",
          backgroundColor: "#fff",
          boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "ew-resize",
          outline: "none",
        }}
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M6 10H14M6 10L8 7M6 10L8 13M14 10L12 7M14 10L12 13" stroke="#333" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </div>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "0.75rem",
          left: "0.75rem",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.25rem",
          fontSize: "0.75rem",
        }}
      >
        {beforeLabel}
      </span>
      <span
        aria-hidden="true"
        style={{
          position: "absolute",
          bottom: "0.75rem",
          right: "0.75rem",
          backgroundColor: "rgba(0,0,0,0.6)",
          color: "#fff",
          padding: "0.25rem 0.5rem",
          borderRadius: "0.25rem",
          fontSize: "0.75rem",
        }}
      >
        {afterLabel}
      </span>
    </div>
  );
}
