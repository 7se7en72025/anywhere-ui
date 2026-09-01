"use client";

import React, { useCallback, useEffect, useState } from "react";

type Breakpoint = "sm" | "md" | "lg" | "xl" | "2xl";

export interface ResponsiveContainerProps {
  children: (breakpoint: Breakpoint) => React.ReactNode;
  className?: string;
}

const breakpoints: { key: Breakpoint; min: number }[] = [
  { key: "2xl", min: 1536 },
  { key: "xl", min: 1280 },
  { key: "lg", min: 1024 },
  { key: "md", min: 768 },
  { key: "sm", min: 640 },
];

function getBreakpoint(width: number): Breakpoint {
  for (const bp of breakpoints) {
    if (width >= bp.min) return bp.key;
  }
  return "sm";
}

export function ResponsiveContainer({
  children,
  className = "",
}: ResponsiveContainerProps) {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>(() =>
    typeof window !== "undefined" ? getBreakpoint(window.innerWidth) : "sm"
  );

  const update = useCallback(() => {
    setBreakpoint(getBreakpoint(window.innerWidth));
  }, []);

  useEffect(() => {
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [update]);

  return (
    <div className={className}>
      {children(breakpoint)}
    </div>
  );
}
