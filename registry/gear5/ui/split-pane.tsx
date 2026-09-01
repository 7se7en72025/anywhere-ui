"use client";

import React, { useCallback, useRef, useState } from "react";

export interface SplitPaneProps {
  left: React.ReactNode;
  right: React.ReactNode;
  defaultRatio?: number;
  minSize?: string;
  maxSize?: string;
  direction?: "horizontal" | "vertical";
  className?: string;
  ariaLabel?: string;
}

export function SplitPane({
  left,
  right,
  defaultRatio = 50,
  minSize = "200px",
  maxSize = "80%",
  direction = "horizontal",
  className = "",
  ariaLabel,
}: SplitPaneProps) {
  const [ratio, setRatio] = useState(defaultRatio);
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const isHorizontal = direction === "horizontal";

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      isDragging.current = true;

      const handleMouseMove = (moveEvent: MouseEvent) => {
        if (!isDragging.current || !containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const clientPos = isHorizontal ? moveEvent.clientX : moveEvent.clientY;
        const totalSize = isHorizontal ? rect.width : rect.height;
        const offset = clientPos - (isHorizontal ? rect.left : rect.top);
        const pct = Math.max(10, Math.min(90, (offset / totalSize) * 100));

        setRatio(pct);
      };

      const handleMouseUp = () => {
        isDragging.current = false;
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("mouseup", handleMouseUp);
        document.body.style.cursor = "";
        document.body.style.userSelect = "";
      };

      document.body.style.cursor = isHorizontal ? "col-resize" : "row-resize";
      document.body.style.userSelect = "none";
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    },
    [isHorizontal]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const step = 2;
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setRatio((r) => Math.max(10, r - step));
      } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setRatio((r) => Math.min(90, r + step));
      }
    },
    []
  );

  return (
    <div
      ref={containerRef}
      role="group"
      aria-label={ariaLabel}
      className={className}
      style={{
        display: "flex",
        flexDirection: isHorizontal ? "row" : "column",
        height: "100%",
        width: "100%",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: `0 0 ${ratio}%`,
          overflow: "auto",
        }}
      >
        {left}
      </div>

      <div
        role="separator"
        aria-orientation={isHorizontal ? "vertical" : "horizontal"}
        aria-valuenow={Math.round(ratio)}
        tabIndex={0}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        style={{
          flex: "0 0 6px",
          cursor: isHorizontal ? "col-resize" : "row-resize",
          background: "var(--color-border, #e5e7eb)",
          touchAction: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          transition: "background 0.15s",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "var(--color-primary, #3b82f6)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLDivElement).style.background = "var(--color-border, #e5e7eb)";
        }}
      >
        <div
          style={{
            width: isHorizontal ? 2 : 20,
            height: isHorizontal ? 20 : 2,
            borderRadius: 1,
            background: "var(--color-text, #374151)",
          }}
        />
      </div>

      <div
        style={{
          flex: `0 0 ${100 - ratio}%`,
          overflow: "auto",
        }}
      >
        {right}
      </div>
    </div>
  );
}
