"use client";

import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface PaginationLabels {
  previous: string;
  next: string;
  page: (n: number) => string;
}

const DEFAULT_LABELS: PaginationLabels = {
  previous: "Previous",
  next: "Next",
  page: (n) => `Page ${n}`,
};

export interface PaginationProps {
  page: number;
  pageCount: number;
  onChange: (page: number) => void;
  labels?: Partial<PaginationLabels>;
  className?: string;
}

/**
 * Page numbers render through `Intl.NumberFormat`, so a Bengali or Arabic
 * user reading with native digits sees ৩ or ٣, not a Western "3" dropped into
 * an otherwise-translated page.
 */
export function Pagination({ page, pageCount, onChange, labels: labelOverrides, className }: PaginationProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { locale } = useLocale();
  const format = (n: number) => new Intl.NumberFormat(locale).format(n);

  return (
    <nav aria-label="Pagination" className={cn("flex items-center gap-1", className)}>
      <button
        type="button"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        className="rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40 dark:hover:bg-neutral-800"
      >
        {labels.previous}
      </button>

      <ul className="flex items-center gap-1">
        {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
          <li key={n}>
            <button
              type="button"
              aria-current={n === page ? "page" : undefined}
              aria-label={labels.page(n)}
              onClick={() => onChange(n)}
              className={cn(
                "size-8 rounded-md text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
                n === page
                  ? "bg-blue-600 text-on-accent"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
              )}
            >
              {format(n)}
            </button>
          </li>
        ))}
      </ul>

      <button
        type="button"
        disabled={page >= pageCount}
        onClick={() => onChange(page + 1)}
        className="rounded-md px-2 py-1.5 text-sm hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-40 dark:hover:bg-neutral-800"
      >
        {labels.next}
      </button>
    </nav>
  );
}
