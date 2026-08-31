"use client";

import { useState } from "react";

export function RunControls() {
  const [status, setStatus] = useState<"running" | "paused" | "stopped">(
    "running",
  );

  return (
    <div className="flex w-full max-w-sm items-center justify-between rounded-xl border border-border bg-card px-4 py-3">
      <div className="flex items-center gap-2 text-sm">
        <span
          className={`h-2 w-2 rounded-full ${
            status === "running"
              ? "bg-emerald-400 animate-pulse"
              : status === "paused"
                ? "bg-amber-400"
                : "bg-red-400"
          }`}
        />
        <span className="capitalize text-foreground">{status}</span>
      </div>

      <div className="flex gap-1.5">
        <button
          onClick={() => setStatus("running")}
          disabled={status === "running"}
          className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:bg-background/60 disabled:opacity-40"
        >
          Run
        </button>
        <button
          onClick={() => setStatus("paused")}
          disabled={status !== "running"}
          className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:bg-background/60 disabled:opacity-40"
        >
          Pause
        </button>
        <button
          onClick={() => setStatus("stopped")}
          disabled={status === "stopped"}
          className="rounded-md border border-border px-2.5 py-1 text-xs text-muted transition-colors hover:bg-background/60 disabled:opacity-40"
        >
          Stop
        </button>
      </div>
    </div>
  );
}
