import { cn } from "../lib/cn";

export interface QuoteBlockProps {
  children: React.ReactNode;
  citation?: string;
  className?: string;
}

/**
 * `<blockquote>` with `<cite>` for the attribution — a border-left visual
 * treatment on a plain `<div>` carries none of this to a screen reader,
 * which announces `<blockquote>` as a distinct region.
 */
export function QuoteBlock({ children, citation, className }: QuoteBlockProps) {
  return (
    <figure className={cn("border-s-4 border-neutral-300 ps-4 text-start dark:border-neutral-700", className)}>
      <blockquote className="text-neutral-800 italic dark:text-neutral-200">{children}</blockquote>
      {citation && <figcaption className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">— {citation}</figcaption>}
    </figure>
  );
}
