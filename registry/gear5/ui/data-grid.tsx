"use client";

import { useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface DataGridColumn<T> {
  key: string;
  header: string;
  render: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: number;
  minWidth?: number;
  maxWidth?: number;
}

export interface DataGridProps<T> {
  columns: DataGridColumn<T>[];
  rows: T[];
  sortKey?: string;
  sortDirection?: "asc" | "desc";
  onSort?: (key: string) => void;
  className?: string;
}

/**
 * Data grid table with sortable headers and column resizing. Sortable columns
 * use `aria-sort`. Column resizer handles use `aria-label` to announce the
 * column being resized.
 */
export function DataGrid<T>({
  columns,
  rows,
  sortKey,
  sortDirection,
  onSort,
  className,
}: DataGridProps<T>) {
  const [columnWidths, setColumnWidths] = useState<Record<string, number>>({});
  const resizingRef = useRef<{ key: string; startX: number; startWidth: number } | null>(null);

  function handleResizeStart(key: string, event: React.MouseEvent) {
    event.preventDefault();
    const startWidth = columnWidths[key] ?? columns.find((c) => c.key === key)?.width ?? 150;
    resizingRef.current = { key, startX: event.clientX, startWidth };

    function handleMouseMove(e: MouseEvent) {
      if (!resizingRef.current) return;
      const diff = e.clientX - resizingRef.current.startX;
      const col = columns.find((c) => c.key === resizingRef.current!.key);
      const newWidth = Math.max(
        col?.minWidth ?? 60,
        Math.min(col?.maxWidth ?? 600, resizingRef.current.startWidth + diff),
      );
      setColumnWidths((prev) => ({ ...prev, [resizingRef.current!.key]: newWidth }));
    }

    function handleMouseUp() {
      resizingRef.current = null;
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }

  return (
    <div className={cn("overflow-x-auto text-start", className)}>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-800">
            {columns.map((column) => {
              const width = columnWidths[column.key] ?? column.width;
              return (
                <th
                  key={column.key}
                  scope="col"
                  aria-sort={
                    sortKey === column.key
                      ? sortDirection === "desc"
                        ? "descending"
                        : "ascending"
                      : column.sortable
                        ? "none"
                        : undefined
                  }
                  style={width ? { width } : undefined}
                  className="relative p-2 text-start font-medium text-neutral-600 dark:text-neutral-400"
                >
                  <div className="flex items-center gap-1">
                    {column.sortable ? (
                      <button
                        type="button"
                        onClick={() => onSort?.(column.key)}
                        className="flex items-center gap-1 hover:text-neutral-900 dark:hover:text-neutral-100"
                      >
                        {column.header}
                        {sortKey === column.key && (
                          <span aria-hidden="true">{sortDirection === "desc" ? "▾" : "▴"}</span>
                        )}
                      </button>
                    ) : (
                      column.header
                    )}
                  </div>
                  {column.sortable !== false && (
                    <span
                      role="separator"
                      aria-label={`Resize ${column.header}`}
                      onMouseDown={(e) => handleResizeStart(column.key, e)}
                      className="absolute inset-y-0 end-0 w-1 cursor-col-resize hover:bg-neutral-300 dark:hover:bg-neutral-600"
                    />
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b border-neutral-100 dark:border-neutral-900">
              {columns.map((column) => (
                <td key={column.key} className="p-2">
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
