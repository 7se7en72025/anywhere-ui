import { cn } from "../lib/cn";

/** Prints the page. A tiny component, included because `window.print()` needs no framework — just a button that calls it. */
export function PrintButton({ label = "Print", className }: { label?: string; className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={cn(
        "rounded-md border border-neutral-300 px-3 py-1.5 text-sm hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:hover:bg-neutral-800",
        className,
      )}
    >
      {label}
    </button>
  );
}
