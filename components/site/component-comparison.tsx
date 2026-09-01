"use client";

import { ComparisonCard } from "./comparison";
import { COMPARISONS } from "./comparisons";

/**
 * The wrong/right pair for a single component, if one exists.
 *
 * Only eleven components have one — the ones where the naive implementation is
 * both common and demonstrably wrong. The rest render nothing rather than
 * inventing a strawman to fill the space.
 */
export function ComponentComparison({ name }: { name: string }) {
  const comparison = COMPARISONS.find((entry) => entry.name === name);
  if (!comparison) return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="text-lg font-semibold tracking-tight">Why this exists</h2>
      <ComparisonCard comparison={comparison} />
    </section>
  );
}
