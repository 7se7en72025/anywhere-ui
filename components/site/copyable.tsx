"use client";

import { useEffect, useRef, useState } from "react";
import { announce } from "@/registry/gear5/lib/announce";

export interface CopyableProps {
  /** The exact text placed on the clipboard. */
  value: string;
  /** Accessible name for the copy control, e.g. "Copy install command". */
  label: string;
  /** Render the value as a scrollable block rather than a single line. */
  block?: boolean;
}

/**
 * A code snippet with a copy button.
 *
 * The clipboard write is the one place this site touches a browser capability
 * the registry's own privacy rules forbid components from using — it lives
 * here, in site chrome, rather than inside any shipped component.
 */
export function Copyable({ value, label, block = false }: CopyableProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      // Clipboard permission denied, or an insecure origin. The text is
      // selectable either way, so say nothing rather than throw.
      return;
    }

    setCopied(true);
    announce("Copied to clipboard", "polite");

    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="relative">
      <pre
        className={`overflow-x-auto rounded-lg bg-neutral-100 py-2.5 pe-12 ps-4 font-mono text-xs dark:bg-neutral-900 ${
          block ? "max-h-[32rem] overflow-y-auto leading-relaxed" : "whitespace-pre-wrap"
        }`}
      >
        <code>{value}</code>
      </pre>

      <button
        type="button"
        onClick={copy}
        className="absolute end-2 top-2 rounded-md border border-neutral-300 bg-white px-2 py-1 text-xs font-medium hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-950 dark:hover:bg-neutral-900"
      >
        {copied ? "Copied" : "Copy"}
        <span className="sr-only">: {label}</span>
      </button>
    </div>
  );
}
