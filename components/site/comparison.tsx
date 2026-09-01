"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { LocaleProvider } from "@/registry/anywhere/lib/use-locale";

export interface Comparison {
  /** Registry name, for the link and install command. */
  name: string;
  title: string;
  /** The bug, in one sentence, in the reader's terms. */
  problem: string;
  /** The line of code people actually write. */
  naiveCode: string;
  /** Locale this failure is visible in. */
  locale: string;
  localeName: string;
  /** What the naive code produces. Computed live, never hardcoded. */
  naive: () => ReactNode;
  /** What this library's component produces, rendered under `locale`. */
  correct: () => ReactNode;
}

/**
 * One wrong/right pair.
 *
 * Both sides are computed at render time from real code — the left is an
 * honest implementation of what people actually ship, not a strawman, and the
 * right is the library's actual component. Nothing here is a screenshot or a
 * hardcoded "before" string, because the entire persuasive weight of this
 * section rests on the reader being able to verify it in devtools.
 */
export function ComparisonCard({ comparison }: { comparison: Comparison }) {
  return (
    <article className="flex flex-col gap-4 rounded-lg border border-hairline bg-anvil p-5">
      <div className="flex flex-col gap-1.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="font-mono text-body-sm font-medium text-cream">{comparison.title}</h3>
          <span className="text-caption text-smoke" lang={comparison.locale}>
            {comparison.localeName}
          </span>
        </div>
        <p className="text-body-sm text-smoke">{comparison.problem}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-caption tracking-[0.16em] text-smoke uppercase">What most apps ship</p>
          <div className="rounded-md border border-hairline px-3 py-2.5">
            <p className="text-body-sm break-words text-cream/60 line-through decoration-coral/70">
              {comparison.naive()}
            </p>
          </div>
          <code className="block overflow-x-auto font-mono text-caption text-smoke">
            {comparison.naiveCode}
          </code>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-caption tracking-[0.16em] text-coral uppercase">
            {comparison.title}
          </p>
          <div className="rounded-md border border-coral/40 px-3 py-2.5">
            <p className="text-body-sm break-words text-cream">
              <LocaleProvider locale={comparison.locale}>{comparison.correct()}</LocaleProvider>
            </p>
          </div>
          <Link
            href={`/components/${comparison.name}`}
            className="text-caption text-smoke underline-offset-4 hover:text-cream hover:underline"
          >
            {comparison.name} →
          </Link>
        </div>
      </div>
    </article>
  );
}

export function ComparisonGrid({ comparisons }: { comparisons: Comparison[] }) {
  const [showAll, setShowAll] = useState(false);
  const visible = showAll ? comparisons : comparisons.slice(0, 4);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-5 lg:grid-cols-2">
        {visible.map((comparison) => (
          <ComparisonCard key={comparison.name} comparison={comparison} />
        ))}
      </div>

      {!showAll && (
        <button
          type="button"
          onClick={() => setShowAll(true)}
          className="w-fit rounded-md border border-hairline px-5 py-2.5 text-body-sm text-cream transition-colors hover:bg-cream/10"
        >
          Show all {comparisons.length}
        </button>
      )}
    </div>
  );
}
