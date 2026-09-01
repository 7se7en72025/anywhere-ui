"use client";

import React, { useEffect, useRef, useState } from "react";

export interface StickyHeaderProps {
  children: React.ReactNode;
  offset?: number;
  className?: string;
  shadowOnStuck?: boolean;
}

export function StickyHeader({
  children,
  offset = 0,
  className = "",
  shadowOnStuck = true,
}: StickyHeaderProps) {
  const [isStuck, setIsStuck] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsStuck(!entry.isIntersecting);
      },
      { threshold: [1], rootMargin: `-${offset + 1}px 0px 0px 0px` }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [offset]);

  return (
    <>
      <div ref={sentinelRef} style={{ height: 0, visibility: "hidden" }} aria-hidden="true" />
      <header
        className={className}
        style={{
          position: "sticky",
          top: offset,
          zIndex: 10,
          transition: "box-shadow 0.2s ease",
          boxShadow: shadowOnStuck && isStuck
            ? "0 2px 8px rgba(0, 0, 0, 0.1)"
            : "none",
        }}
      >
        {children}
      </header>
    </>
  );
}
