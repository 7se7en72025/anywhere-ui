"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

/** A thin bar across the top of the viewport showing reading progress down the page. */
export function ScrollProgress({ className }: { className?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const max = scrollHeight - clientHeight;
      setProgress(max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      role="progressbar"
      aria-label="Reading progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(progress)}
      className={cn("fixed inset-x-0 top-0 z-40 h-1 bg-transparent", className)}
    >
      <div className="h-full bg-blue-600 transition-[width] duration-150 motion-reduce:transition-none" style={{ width: `${progress}%` }} />
    </div>
  );
}
