import { sanitizeHref } from "../lib/sanitize";
import { cn } from "../lib/cn";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  /** Auto-mirrors under RTL: rendered via `rtl:` variants, not hardcoded. */
  separator?: string;
  className?: string;
}

/**
 * `<nav aria-label="Breadcrumb">` around an ordered list, with the current
 * page marked `aria-current="page"` — the separator is decorative and
 * `aria-hidden`, so a screen reader hears "Home, Products, current page:
 * Shoes" instead of a stream of ">" characters.
 */
export function Breadcrumb({ items, separator = "/", className }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-neutral-600 dark:text-neutral-400">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.href && !isLast ? (
                <a href={sanitizeHref(item.href)} className="hover:text-neutral-900 hover:underline dark:hover:text-neutral-100">
                  {item.label}
                </a>
              ) : (
                <span aria-current={isLast ? "page" : undefined} className={cn(isLast && "font-medium text-neutral-900 dark:text-neutral-100")}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span aria-hidden="true" className="text-neutral-400">
                  {separator}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
