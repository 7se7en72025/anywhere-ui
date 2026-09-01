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

const TIER_BADGES: Record<string, { label: string; color: string }> = {
  xs: { label: "XS", color: "bg-green-500/15 text-green-400 border-green-500/30" },
  sm: { label: "SM", color: "bg-blue-500/15 text-blue-400 border-blue-500/30" },
  md: { label: "MD", color: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30" },
  lg: { label: "LG", color: "bg-orange-500/15 text-orange-400 border-orange-500/30" },
};

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
          <div className="relative">
            <svg
              className="absolute start-3 top-1/2 size-4 -translate-y-1/2 text-neutral-400"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <input
              id="component-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by name, description, or category..."
                           className="w-full rounded-lg border border-neutral-300 bg-white py-2.5 ps-10 pe-4 text-base transition-colors focus:border-coral focus:outline-none focus:ring-1 focus:ring-coral dark:border-neutral-700 dark:bg-neutral-950 dark:focus:border-coral"
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200"
                aria-label="Clear search"
              >
                <svg className="size-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setCategory(null)}
            aria-pressed={category === null}
            className={
              category === null
                ? "rounded-full bg-neutral-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors dark:bg-neutral-100 dark:text-neutral-900"
                : "rounded-full border border-neutral-300 px-3.5 py-1.5 text-sm transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600"
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
                  ? "rounded-full bg-neutral-900 px-3.5 py-1.5 text-sm font-medium text-white transition-colors dark:bg-neutral-100 dark:text-neutral-900"
                  : "rounded-full border border-neutral-300 px-3.5 py-1.5 text-sm transition-colors hover:border-neutral-400 dark:border-neutral-700 dark:hover:border-neutral-600"
              }
            >
              {name}
            </button>
          ))}
        </div>

        <p role="status" aria-live="polite" className="text-sm text-neutral-500 dark:text-neutral-400">
          {matches.length} {matches.length === 1 ? "component" : "components"}
          {category && <> in <span className="font-medium text-neutral-700 dark:text-neutral-200">{category}</span></>}
          {query && <> matching <span className="font-medium text-neutral-700 dark:text-neutral-200">&ldquo;{query}&rdquo;</span></>}
        </p>
      </div>

      {grouped.map(([name, groupItems]) => (
        <section key={name} className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold tracking-tight">{name}</h2>

          <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {groupItems.map((item) => (
              <li
                key={item.name}
                className="group relative flex flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-all hover:border-neutral-300 hover:shadow-md dark:border-neutral-800 dark:bg-neutral-950 dark:hover:border-neutral-700"
              >
                <div className="relative overflow-hidden rounded-lg bg-neutral-50 dark:bg-neutral-900">
                  <Preview name={item.name} />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-mono text-sm font-semibold">
                      <Link
                        href={`/components/${item.name}`}
                        className="after:absolute after:inset-0 after:z-10 underline-offset-4 hover:underline"
                      >
                        {item.title}
                      </Link>
                    </h3>
                    {item.tier && TIER_BADGES[item.tier] && (
                      <span className={`shrink-0 rounded-full border px-2 py-0.5 text-xs font-medium ${TIER_BADGES[item.tier].color}`}>
                        {TIER_BADGES[item.tier].label}
                      </span>
                    )}
                  </div>
                  <p className="line-clamp-2 text-sm text-neutral-500 dark:text-neutral-400">{item.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {matches.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
          <svg className="size-12 text-neutral-300 dark:text-neutral-600" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <p className="text-neutral-600 dark:text-neutral-400">
            No components match &ldquo;{query}&rdquo;
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            Try a broader term, or{" "}
            <button
              type="button"
              onClick={() => { setQuery(""); setCategory(null); }}
              className="text-coral hover:underline"
            >
              clear all filters
            </button>
          </p>
        </div>
      )}
    </div>
  );
}
