"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface FaqAccordionProps {
  items: FaqItem[];
  showSearch?: boolean;
  className?: string;
}

/**
 * FAQ accordion with optional search. Each item uses `aria-expanded` on the
 * trigger button and `aria-labelledby` / `id` pairing for the panel.
 */
export function FaqAccordion({ items, showSearch = true, className }: FaqAccordionProps) {
  const baseId = useId();
  const [openId, setOpenId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const filtered = items.filter(
    (item) =>
      item.question.toLowerCase().includes(query.toLowerCase()) ||
      item.answer.toLowerCase().includes(query.toLowerCase()),
  );

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {showSearch && (
        <div>
          <label htmlFor={`${baseId}-search`} className="sr-only">
            Search FAQs
          </label>
          <input
            id={`${baseId}-search`}
            type="search"
            placeholder="Search FAQs..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="py-4 text-center text-sm text-neutral-500 dark:text-neutral-400">
          No matching questions found.
        </p>
      ) : (
        <div className="flex flex-col gap-2">
          {filtered.map((item) => {
            const isOpen = openId === item.id;
            const questionId = `${baseId}-${item.id}-q`;
            const answerId = `${baseId}-${item.id}-a`;

            return (
              <div key={item.id} className="rounded-lg border border-neutral-200 dark:border-neutral-800">
                <button
                  type="button"
                  id={questionId}
                  aria-expanded={isOpen}
                  aria-controls={answerId}
                  onClick={() => toggle(item.id)}
                  className="flex w-full items-center justify-between p-4 text-start text-sm font-medium text-neutral-900 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-neutral-100 dark:hover:bg-neutral-900"
                >
                  {item.question}
                  <span aria-hidden="true" className="ms-2 text-neutral-400">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>
                {isOpen && (
                  <div
                    id={answerId}
                    role="region"
                    aria-labelledby={questionId}
                    className="border-t border-neutral-100 px-4 pb-4 pt-3 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400"
                  >
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
