"use client";

import { useState } from "react";

export function ToolPermission({
  tool,
  args,
}: {
  tool: string;
  args: Record<string, string>;
}) {
  const [decision, setDecision] = useState<"pending" | "approved" | "denied">(
    "pending",
  );

  return (
    <div className="w-full max-w-sm rounded-xl border border-border bg-card p-4 font-mono text-sm">
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-2 text-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          {tool}
        </span>
        <span className="text-xs text-muted uppercase tracking-wide">
          {decision === "pending" ? "awaiting approval" : decision}
        </span>
      </div>

      <div className="mt-3 space-y-1 rounded-lg bg-background/60 p-3 text-xs text-muted">
        {Object.entries(args).map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <span className="text-accent">{key}:</span>
            <span className="truncate text-foreground/80">{value}</span>
          </div>
        ))}
      </div>

      {decision === "pending" && (
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => setDecision("approved")}
            className="flex-1 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-foreground transition-opacity hover:opacity-90"
          >
            Approve
          </button>
          <button
            onClick={() => setDecision("denied")}
            className="flex-1 rounded-md border border-border px-3 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-background/60"
          >
            Deny
          </button>
        </div>
      )}
    </div>
  );
}
