import { cn } from "../lib/cn";

/**
 * A single keyboard key, styled like one and marked up as one.
 *
 * `<kbd>` over a styled `<span>` because screen readers that expose landmark
 * navigation announce it distinctly, and browser find-in-page / translation
 * tools treat it as inline code rather than prose to reflow.
 */
export function Kbd({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <kbd
      className={cn(
        "inline-flex min-w-5 items-center justify-center rounded border border-neutral-300 bg-neutral-100 px-1.5 py-0.5 font-mono text-xs text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300",
        className,
      )}
    >
      {children}
    </kbd>
  );
}
