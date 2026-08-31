"use client";

import { useEffect, useState } from "react";

export function StreamingText({
  text,
  speedMs = 20,
}: {
  text: string;
  speedMs?: number;
}) {
  const [shown, setShown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setShown((prev) => {
        if (prev >= text.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, speedMs);
    return () => clearInterval(interval);
  }, [text, speedMs]);

  const done = shown >= text.length;

  return (
    <p className="max-w-md font-mono text-sm leading-relaxed text-foreground">
      {text.slice(0, shown)}
      {!done && <span className="ml-0.5 inline-block h-4 w-2 animate-pulse bg-accent align-middle" />}
    </p>
  );
}
