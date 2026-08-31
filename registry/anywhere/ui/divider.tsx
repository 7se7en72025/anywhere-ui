import { cn } from "../lib/cn";

export interface DividerProps {
  orientation?: "horizontal" | "vertical";
  /** Optional label, e.g. "or". Splits the rule into two segments around it. */
  label?: string;
  className?: string;
}

/**
 * A semantic rule, horizontal or vertical, with an optional inline label.
 *
 * Uses `role="separator"` rather than a bare `<hr>` when labelled, since a
 * label turns it into a compound element `<hr>` cannot express; margins use
 * logical properties so a vertical divider's spacing does not need mirroring
 * by hand in RTL layouts.
 */
export function Divider({ orientation = "horizontal", label, className }: DividerProps) {
  if (orientation === "vertical") {
    return (
      <div
        role="separator"
        aria-orientation="vertical"
        className={cn("mx-2 inline-block h-full w-px self-stretch bg-neutral-200 dark:bg-neutral-800", className)}
      />
    );
  }

  if (!label) {
    return <hr className={cn("border-neutral-200 dark:border-neutral-800", className)} />;
  }

  return (
    <div
      role="separator"
      aria-orientation="horizontal"
      className={cn("flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400", className)}
    >
      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
      <span>{label}</span>
      <span className="h-px flex-1 bg-neutral-200 dark:bg-neutral-800" />
    </div>
  );
}
