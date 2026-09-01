# Contributing

Thanks for considering it. This project has a narrow thesis, and the fastest way to get a change merged is to know what it is.

## The thesis

A component belongs here if it is something teams keep rebuilding badly for users on **cheap devices, bad networks, other languages, or assistive technology**. A prettier button does not qualify. A button that stays usable when the request behind it hangs for forty seconds might.

## The bar

Every component is held to ten axes (performance, accessibility, internationalisation, privacy, security, resilience, offline behaviour, SSR safety, sensory safety, supply chain — see the README for what each means). Seven of them are enforced automatically the moment your component has a fixture; three need something from you.

**1. A fixture in `components/demos.tsx`.** One minimal, representative render of your component, added to the `fixtures` map under its registry name. This single entry is what makes every generic check below run against your component *and* what the docs site renders as its preview — no fixture, no coverage and no docs page.

**2. A tier in `registry.json`.** Add `"tier": "xs" | "sm" | "md" | "lg"` to your item. `tests/budget.test.ts` bundles, minifies, and gzips your component with React external and fails if it exceeds its tier's budget. Guess a tier by comparing your component to existing ones of similar complexity; the test will tell you if you guessed wrong, with the measured size in the failure message.

**3. The parts axe cannot check.** Your fixture gets automatic axe coverage, an automatic SSR render, and automatic privacy/security/sensory-safety scans — but axe alone catches perhaps a third of real accessibility problems. Assert the rest by hand, in a test file of your own if the behaviour is non-generic:

- Does focus move somewhere useful when an error appears?
- Is the live region mounted *before* its text changes? (A region created and filled in the same tick is silent in most screen readers — this is the single most common way "accessible" announcements fail.)
- Is required state exposed to assistive tech, not only as a red asterisk?
- Is the accessible name right, and does it survive translation?

**Internationalisation by construction**, checked by review rather than a test: every user-facing string is a prop with an English default — never a hardcoded literal in JSX. Layout uses logical properties (`ms-`/`me-`, `ps-`/`pe-`, `text-start`) so RTL is a data change. Dates go through the locale's calendar, numbers through `Intl.NumberFormat`.

## Zero runtime dependencies

This is not negotiable, and `tests/budget.test.ts` enforces it by scanning every import in the registry. Only `react` and `react-dom` (React's own DOM runtime, not an added dependency) are allowed. A single transitive dependency can cost more than everything currently in this library. If you need a utility, write the twenty lines.

## No network calls, no dangerous sinks

`tests/static-scan.test.ts` enforces both automatically once your fixture exists: no `fetch`/`XHR`/`sendBeacon`/fingerprinting API anywhere (the privacy axis), and no `dangerouslySetInnerHTML`/`eval`/`innerHTML =`/`document.write` (the security axis). If your component renders a URL from caller-supplied data, pass it through `sanitizeHref` first.

## Getting set up

```bash
pnpm install
pnpm dev       # docs site and playground
pnpm verify    # typecheck, lint, tests — everything CI runs
```

Components live in `registry/anywhere/ui/`, shared primitives in `registry/anywhere/lib/`. Import between them by relative path; the registry build rewrites those to `@/` aliases for consumers.

## Adding a component to the registry

1. Write it in `registry/anywhere/ui/<name>.tsx`.
2. Add an entry to `registry.json` with a `tier` and `registryDependencies` listed by name.
3. Add a fixture for it to `components/demos.tsx`. If it is an overlay that covers the page when open, also add a trigger-based preview to `components/site/overlay-previews.tsx`.
4. Add it to the playground in `components/demo/playground.tsx` if it's a flagship worth demonstrating live — not required for every component.
5. Run `pnpm verify` and fix whatever the generic suite flags.

## Finding issues to work on

Look for issues labeled **`good first issue`** — these are tasks that are well-scoped, documented, and suitable for new contributors. They typically involve:

- Adding a new component that follows existing patterns
- Improving documentation or examples
- Adding test coverage for edge cases
- Fixing accessibility issues

If you are unsure where to start, open an issue describing what you want to work on and ask for guidance. We are happy to help you find the right scope.

## Review process

1. Open a PR with a clear description of what changed and why.
2. CI must pass (typecheck, lint, tests).
3. A maintainer will review within 48 hours. If it takes longer, ping the PR.
4. We may request changes. This is normal and not a rejection.
5. Once approved, a maintainer will merge the PR.

## Reporting a bug

The most useful bug reports for this project name the **condition**, not just the symptom: which locale, which connection, which assistive technology, which device class. "Broken on mobile" is hard to act on. "The error summary is not announced by TalkBack on Android 11 in `ar-EG`" is a fix.

## Code of conduct

By participating you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).
