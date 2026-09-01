"use client";

import { useMemo, useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface SortableColumn<Row> {
  key: string;
  header: string;
  /** The comparable value for a row. Strings are compared with a collator. */
  value: (row: Row) => string | number;
}

export interface SortableTableLabels {
  /** `{column}` and `{direction}` are substituted. */
  sorted: string;
  ascending: string;
  descending: string;
}

const DEFAULT_LABELS: SortableTableLabels = {
  sorted: "Sorted by {column}, {direction}",
  ascending: "ascending",
  descending: "descending",
};

export interface SortableTableProps<Row> {
  caption: string;
  columns: SortableColumn<Row>[];
  rows: Row[];
  rowKey: (row: Row) => string;
  labels?: Partial<SortableTableLabels>;
  className?: string;
}

/**
 * A sortable table that sorts text the way the language sorts text.
 *
 * `Array#sort` on strings compares UTF-16 code points, which is not alphabetical
 * order in any language with accents or a non-Latin script: it files "Ångström"
 * after "Zebra", separates "é" from "e", and orders Chinese by codepoint rather
 * than by pinyin or stroke. `Intl.Collator` is the locale's actual collation,
 * and its `numeric` option additionally makes "item 2" sort before "item 10".
 *
 * The sort state is exposed through `aria-sort` on the header cell — the
 * attribute screen readers announce — and each change is also announced, since
 * a re-ordered table gives no other signal to someone who cannot see it move.
 */
export function SortableTable<Row>({
  caption,
  columns,
  rows,
  rowKey,
  labels: labelOverrides,
  className,
}: SortableTableProps<Row>) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { locale, direction } = useLocale();

  const [sort, setSort] = useState<{ key: string; ascending: boolean } | null>(null);

  const collator = useMemo(
    () => new Intl.Collator(locale, { numeric: true, sensitivity: "base" }),
    [locale],
  );

  const sorted = useMemo(() => {
    if (!sort) return rows;

    const column = columns.find((candidate) => candidate.key === sort.key);
    if (!column) return rows;

    return [...rows].sort((a, b) => {
      const left = column.value(a);
      const right = column.value(b);

      const comparison =
        typeof left === "number" && typeof right === "number"
          ? left - right
          : collator.compare(String(left), String(right));

      return sort.ascending ? comparison : -comparison;
    });
  }, [rows, columns, sort, collator]);

  function toggle(column: SortableColumn<Row>) {
    const ascending = sort?.key === column.key ? !sort.ascending : true;
    setSort({ key: column.key, ascending });

    announce(
      labels.sorted
        .replace("{column}", column.header)
        .replace("{direction}", ascending ? labels.ascending : labels.descending),
      "polite",
    );
  }

  return (
    <table dir={direction} className={cn("w-full text-start text-sm", className)}>
      <caption className="mb-2 text-start text-sm text-neutral-600 dark:text-neutral-400">
        {caption}
      </caption>

      <thead>
        <tr className="border-b border-neutral-200 dark:border-neutral-800">
          {columns.map((column) => {
            const active = sort?.key === column.key;

            return (
              <th
                key={column.key}
                scope="col"
                aria-sort={active ? (sort.ascending ? "ascending" : "descending") : "none"}
                className="p-0"
              >
                <button
                  type="button"
                  onClick={() => toggle(column)}
                  className="flex w-full items-center gap-1 px-3 py-2 text-start font-semibold focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  {column.header}
                  <span aria-hidden="true" className="text-neutral-500">
                    {active ? (sort.ascending ? "▲" : "▼") : "↕"}
                  </span>
                </button>
              </th>
            );
          })}
        </tr>
      </thead>

      <tbody>
        {sorted.map((row) => (
          <tr key={rowKey(row)} className="border-b border-neutral-200 dark:border-neutral-800">
            {columns.map((column) => (
              <td key={column.key} className="px-3 py-2">
                {String(column.value(row))}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
