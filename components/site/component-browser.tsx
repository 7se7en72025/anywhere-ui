"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Preview } from "./preview";

export interface BrowserItem {
  name: string;
  title: string;
  description: string;
  category: string;
  tier?: string;
}

export interface ComponentBrowserProps {
  items: BrowserItem[];
  categories: string[];
}

export function ComponentBrowser({ items, categories }: ComponentBrowserProps) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const matches = useMemo(() => {
    const needle = query.trim().toLowerCase();

    return items.filter((item) => {
      if (category && item.category !== category) return false;
      if (!needle) return true;

      return (
        item.name.includes(needle) ||
        item.title.toLowerCase().includes(needle) ||
        item.description.toLowerCase().includes(needle) ||
        item.category.toLowerCase().includes(needle)
      );
    });
  }, [items, query, category]);

  const grouped = useMemo(() => {
    const groups = new Map<string, BrowserItem[]>();

    for (const item of matches) {
      const existing = groups.get(item.category);
      if (existing) existing.push(item);
      else groups.set(item.category, [item]);
    }

    return [...groups];
  }, [matches]);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="component-search" className="text-sm font-medium">
            Search components
          </label>
          <input
            id="component-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="offline, calendar, focus…"
            className="w-full max-w-md rounded-md border border-neutral-300 bg-white px-3 py-2 text-base dark:border-neutral-700 dark:bg-neutral-950"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className={
              category === null
                ? "rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
                : "rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
            }
          >
            All
          </button>

          {categories.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => setCategory(name === category ? null : name)}
              aria-pressed={category === name}
              className={
                category === name
                  ? "rounded-md bg-neutral-900 px-3 py-1.5 text-sm text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "rounded-md border border-neutral-300 px-3 py-1.5 text-sm dark:border-neutral-700"
              }
            >
              {name}
            </button>
          ))}
        </div>

        {/* Announced rather than only shown, so a screen reader user filtering
            by keyboard hears how many results their query left. */}
        <p role="status" aria-live="polite" className="text-sm text-neutral-600 dark:text-neutral-400">
          {matches.length} {matches.length === 1 ? "component" : "components"}
        </p>
      </div>

      {grouped.map(([name, groupItems]) => (
        <section key={name} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{name}</h2>

          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groupItems.map((item) => (
              <li
                key={item.name}
                className="flex flex-col gap-3 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
              >
                <Preview name={item.name} />

                <div className="flex flex-col gap-1">
                  <h3 className="font-mono text-sm font-semibold">
                    <Link href={`/components/${item.name}`} className="underline-offset-4 hover:underline">
                      {item.title}
                    </Link>
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {matches.length === 0 && (
        <p className="text-neutral-600 dark:text-neutral-400">
          Nothing matches “{query}”. Try a broader term, or clear the category filter.
        </p>
      )}
    </div>
  );
}
