"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";
import { LocaleProvider } from "@/registry/gear5/lib/use-locale";

export interface Comparison {
  name: string;
  title: string;
  problem: string;
  naiveCode: string;
  locale: string;
  localeName: string;
  naive: () => ReactNode;
  correct: () => ReactNode;
}

/**
 * One wrong/right pair.
 *
 * Both sides are computed at render time from real code. The left is an
 * honest implementation of what people actually ship, not a strawman. The
 * right is the library's actual component. Nothing here is a screenshot or a
 * hardcoded "before" string, because the entire persuasive weight of this
 * section rests on the reader being able to verify it in devtools.
 */
export function ComparisonCard({ comparison }: { comparison: Comparison }) {
  return (
    <article className="group flex flex-col gap-4 rounded-xl border border-hairline bg-anvil p-5 transition-all hover:border-hairline/80 hover:shadow-lg">
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
          <div className="rounded-lg border border-hairline bg-canvas/50 px-3 py-2.5">
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
          <div className="rounded-lg border border-coral/30 bg-coral/5 px-3 py-2.5">
            <p className="text-body-sm break-words text-cream">
              <LocaleProvider locale={comparison.locale}>{comparison.correct()}</LocaleProvider>
            </p>
          </div>
          <Link
            href={`/components/${comparison.name}`}
            className="group/link inline-flex items-center gap-1 text-caption text-smoke underline-offset-4 hover:text-cream hover:underline"
          >
            {comparison.name}
            <svg className="size-3 transition-transform group-hover/link:translate-x-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
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
          className="group w-fit rounded-md border border-hairline px-5 py-2.5 text-body-sm text-cream transition-all hover:bg-cream/10 hover:border-cream/30"
        >
          Show all {comparisons.length}
          <svg className="ml-1.5 inline-block size-4 transition-transform group-hover:translate-y-0.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
      )}
    </div>
  );
}
