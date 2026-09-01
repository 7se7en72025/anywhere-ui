"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/cn";

/**
 * Appears after the reader has scrolled a screenful, and returns to the top.
 * Honours reduced motion by jumping instead of animating the scroll — a
 * simulated smooth-scroll is itself a several-hundred-millisecond motion
 * effect, not exempt from the same preference every other animation here is.
 */
export function BackToTop({ label = "Back to top", className }: { label?: string; className?: string }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={() => {
        const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      }}
      className={cn(
        "fixed bottom-6 end-6 z-40 rounded-full bg-neutral-900 px-4 py-2 text-sm text-white shadow-lg hover:bg-neutral-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-neutral-100 dark:text-neutral-900",
        className,
      )}
    >
      {label}
    </button>
  );
}
