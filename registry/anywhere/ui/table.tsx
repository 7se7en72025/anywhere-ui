"use client";

import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface Column<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
}

export interface TableProps<T> {
  columns: Column<T>[];
  rows: T[];
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  className?: string;
}

/**
 * A real `<table>`, not a grid of `<div>`s: screen readers navigate tables by
 * row and column ("row 3, column Status") only when the markup is actually
 * tabular. Sortable headers use `aria-sort`, and arrow direction in
 * `wrapDirectionIcon` is left to the caller's own icon component so a single
 * table implementation works for both reading directions.
 */
export function Table<T>({ columns, rows, sortKey, sortDirection, onSort, className }: TableProps<T>) {
  const { locale } = useLocale();

  return (
    <div className={cn("overflow-x-auto text-start", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            {columns.map((column) => (
              <th
                key={column.key}
                scope="col"
                aria-sort={sortKey === column.key ? (sortDirection === "desc" ? "descending" : "ascending") : column.sortable ? "none" : undefined}
                className="p-2 text-start font-medium text-neutral-600 dark:text-neutral-400"
              >
                {column.sortable ? (
                  <button type="button" onClick={() => onSort?.(column.key)} className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100">
                    {column.header}
                    {sortKey === column.key && <span aria-hidden="true">{sortDirection === "desc" ? "▾" : "▴"}</span>}
                  </button>
                ) : (
                  column.header
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-neutral-100 dark:border-neutral-900">
              {columns.map((column) => (
                <td key={column.key} className="p-2" lang={locale}>
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
