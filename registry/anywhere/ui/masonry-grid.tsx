import { cn } from "../lib/cn";

export interface MasonryGridProps {
  children: React.ReactNode;
  columns?: number;
  className?: string;
}

/**
 * CSS columns, not a JavaScript layout engine: this reflows correctly on
 * resize and under RTL for free (browsers already fill multi-column layouts
 * start-to-end, not literally left-to-right), and adds no runtime cost whatsoever.
 */
export function MasonryGrid({ children, columns = 3, className }: MasonryGridProps) {
  return (
    <div
      className={cn("gap-4 [&>*]:mb-4 [&>*]:break-inside-avoid", className)}
      style={{ columnCount: columns, columnGap: "1rem" }}
    >
      {children}
    </div>
  );
}
