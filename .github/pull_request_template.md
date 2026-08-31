## What this changes

<!-- One or two sentences. If it fixes an issue, link it. -->

## The bar

Components are held to ten axes. Most are enforced automatically once a fixture
exists — tick what applies, and delete the rest.

- [ ] Added a fixture to `components/demos.tsx` (this buys the component its
      axe audit, SSR render, and docs preview in one entry)
- [ ] Declared a `tier` in `registry.json`
- [ ] Every user-facing string is a prop with an English default
- [ ] Layout uses logical properties (`ms-`/`me-`, `ps-`/`pe-`, `text-start`)
- [ ] Asserted the parts axe cannot check: focus moves to new errors, live
      regions are mounted before they are filled, required state is exposed to
      assistive tech

## Verification

<!-- Paste the result of `pnpm verify`, or say what you ran. -->
