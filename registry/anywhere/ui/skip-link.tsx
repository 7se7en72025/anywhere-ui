import { sanitizeHref } from "../lib/sanitize";
import { cn } from "../lib/cn";

export interface SkipLinkProps {
  href: string;
  children?: React.ReactNode;
  className?: string;
}

/**
 * The first focusable element on the page for a keyboard user — invisible
 * until it receives focus, at which point it must become visible; a skip
 * link a sighted keyboard user cannot see when it is focused is not
 * meaningfully different from no skip link at all.
 */
export function SkipLink({ href, children = "Skip to content", className }: SkipLinkProps) {
  return (
    <a
      href={sanitizeHref(href)}
      className={cn(
        "sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-blue-600 focus:px-4 focus:py-2 focus:text-white",
        className,
      )}
    >
      {children}
    </a>
  );
}
