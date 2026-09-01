import { cn } from "../lib/cn";

export interface DirectionalIconProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Wraps an icon that points somewhere — an arrow, a chevron, a "next" glyph —
 * and mirrors it under RTL via `rtl:-scale-x-100`. Icons that represent
 * physical direction (a play button, a checkmark) should not be wrapped in
 * this; only ones whose meaning is "forward/back" or "next/previous" relative
 * to reading direction.
 */
export function DirectionalIcon({ children, className }: DirectionalIconProps) {
  return (
    <span aria-hidden="true" className={cn("inline-flex rtl:-scale-x-100", className)}>
      {children}
    </span>
  );
}
