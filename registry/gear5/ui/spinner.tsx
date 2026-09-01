import { VisuallyHidden } from "./visually-hidden";
import { cn } from "../lib/cn";

export interface SpinnerProps {
  label?: string;
  className?: string;
}

/**
 * A loading indicator. The spin itself is `aria-hidden`; the label — spoken
 * once via `role="status"`, not repeated on every animation frame — is what
 * assistive technology actually hears.
 */
export function Spinner({ label = "Loading…", className }: SpinnerProps) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2", className)}>
      <span
        aria-hidden="true"
        className="size-4 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent motion-reduce:animate-none"
      />
      <VisuallyHidden>{label}</VisuallyHidden>
    </span>
  );
}
