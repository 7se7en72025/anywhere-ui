import { cn } from "../lib/cn";

export interface ChipProps {
  children: React.ReactNode;
  /** Present it as removable — turns the chip into a labelled button. */
  onRemove?: () => void;
  removeLabel?: string;
  className?: string;
}

/**
 * A dismissible tag. When `onRemove` is given, the whole chip is a button
 * whose accessible name is "Remove {label}" — never a bare "×" icon with no
 * text, which announces as "button" and nothing else.
 */
export function Chip({ children, onRemove, removeLabel, className }: ChipProps) {
  const label = typeof children === "string" ? children : removeLabel;

  if (onRemove) {
    return (
      <button
        type="button"
        onClick={onRemove}
        className={cn(
          "inline-flex items-center gap-1 rounded-full border border-neutral-300 bg-white px-2.5 py-1 text-sm text-neutral-800 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200 dark:hover:bg-neutral-800",
          className,
        )}
        aria-label={label ? `Remove ${label}` : undefined}
      >
        <span>{children}</span>
        <span aria-hidden="true" className="text-neutral-400">
          ×
        </span>
      </button>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-neutral-300 bg-white px-2.5 py-1 text-sm text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200",
        className,
      )}
    >
      {children}
    </span>
  );
}
