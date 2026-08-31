# Contributing

Thanks for considering it. This project has a narrow thesis, and the fastest way to get a change merged is to know what it is.

## The thesis

A component belongs here if it is something teams keep rebuilding badly for users on **cheap devices, bad networks, other languages, or assistive technology**. A prettier button does not qualify. A button that stays usable when the request behind it hangs for forty seconds might.

## The bar

Every component ships with all four of these. A PR without them will get a friendly request rather than a merge.

**1. A size budget.** Add an entry to `BUDGETS` in `tests/budget.test.ts`. The test bundles, minifies, and gzips your component with React external and fails if it exceeds the number. Set it at roughly your measured size plus ten percent — the point is to catch drift, not to leave room for it.

**2. Axe assertions in every state.** Not just the happy path. If the component has a loading state, an error state, and an empty state, axe runs over all three.

**3. The parts axe cannot check.** Automated tools catch perhaps a third of real accessibility problems. Assert the rest by hand:

- Does focus move somewhere useful when an error appears?
- Is the live region mounted *before* its text changes? (A region created and filled in the same tick is silent in most screen readers — this is the single most common way "accessible" announcements fail.)
- Is required state exposed to assistive tech, not only as a red asterisk?
- Is the accessible name right, and does it survive translation?

**4. Internationalisation by construction.** Every user-facing string is a prop with an English default — never a hardcoded literal in JSX. Layout uses logical properties (`ms-`/`me-`, `ps-`/`pe-`, `text-start`) so RTL is a data change. Dates go through the locale's calendar, numbers through `Intl.NumberFormat`.

## Zero runtime dependencies

This is not negotiable, and `tests/budget.test.ts` enforces it. A single transitive dependency can cost more than everything currently in this library. If you need a utility, write the twenty lines.

## Getting set up

```bash
pnpm install
pnpm dev       # docs site and playground
pnpm verify    # typecheck, lint, tests — everything CI runs
```

Components live in `registry/anywhere/ui/`, shared primitives in `registry/anywhere/lib/`. Import between them by relative path; the registry build rewrites those to `@/` aliases for consumers.

## Adding a component to the registry

1. Write it in `registry/anywhere/ui/<name>.tsx`.
2. Add an entry to `registry.json`, listing its `registryDependencies` by name.
3. Add it to the playground in `components/demo/playground.tsx` so it is visible on the docs site.
4. Run `pnpm registry:build` and confirm `public/r/<name>.json` looks right.

## Reporting a bug

The most useful bug reports for this project name the **condition**, not just the symptom: which locale, which connection, which assistive technology, which device class. "Broken on mobile" is hard to act on. "The error summary is not announced by TalkBack on Android 11 in `ar-EG`" is a fix.

## Code of conduct

By participating you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).
