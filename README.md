# Anywhere UI

**React components that work anywhere.** Any device. Any network. Any language. Any ability.

98 components and 11 shared primitives engineered for the conditions most component libraries are never tested against — and verified against **ten axes**, in CI, not just claimed in this README.

- **Zero runtime dependencies.** `react` (and its own `react-dom`) are the only imports allowed anywhere in the registry — enforced by a test, not a promise.
- **Every component asserted against axe** in every one of its states, plus the things axe cannot see.
- **A source scan forbids** `fetch`, telemetry, `dangerouslySetInnerHTML`, and `eval` across the whole registry — nothing here phones home or renders unsanitised input.
- **Every component renders through `react-dom/server`** in CI — no reaching for `window` during render.

```bash
npx shadcn@latest add https://your-deployment.example.com/r/async-boundary.json
```

Components are copied into your repo. There is no package to depend on, no version to upgrade, and nothing to uninstall if you change your mind. (The real URL is whatever this project is deployed at — see [Development](#development).)

---

## Why

Three facts about the people who use software:

| | |
|---|---|
| ~2.6 billion | are offline or intermittently connected |
| ~1.3 billion | live with a significant disability |
| ~6.5 billion | do not speak English as a first language |

None of this is news. It is just never the default. So every team rebuilds the same handling badly, under deadline, and ships the version that worked on the laptop it was written on:

- Requests do not fail loudly on a bad connection — they hang. The spinner spins forever and the user taps the button again, and now there are two orders.
- The live region is created in the same tick its text appears, so no screen reader ever announces it. The code looks accessible. It is silent.
- Focus never moves to the error, so a keyboard user has to go hunting for what went wrong.
- Layout assumes left-to-right, dates assume the Gregorian calendar, numbers assume Latin digits.
- A form loses twenty minutes of typing because the tab was backgrounded and the OS reclaimed it.

Anywhere UI is what those fixes look like when someone has time to do them properly, written once, in the open.

## Components

98 components across eight categories. The docs site has a page for every one of them — a live preview, the install command, the full source, and the budget it is held to — plus search and category filters at `/components`. A few of the flagships:

| Component | What it solves |
|---|---|
| `AsyncBoundary` | The four states every fetch really has — loading, error, empty, offline — announced, focus-managed, and height-reserved so nothing jumps. |
| `ResilientForm` | Drafts persisted as the user types, offline submits queued and retried, errors given a focusable summary, double submits blocked. |
| `ErrorBoundary` | Contains a render crash to its own subtree, with an announced, focusable, recoverable fallback — the rest of the page keeps working. |
| `AdaptiveImage` | Refuses to spend a user's data on Save-Data and 2G-class connections until they ask. `width`/`height` mandatory, so nothing shifts. |
| `Calendar` | A month grid in the reader's own calendar system — `islamic-umalqura`, `buddhist`, `persian` — and their own week start. |
| `AddressFields` | An address form whose field order and required fields follow the country being addressed — Japan asks postal-code-first, largest to smallest. |
| `CompactNumber` | 1.2M in English, 12.3 लाख in Hindi, ١٫٢ مليون in Arabic. A hardcoded K/M/B ladder is wrong for most of the world. |
| `SegmentedControl` | A real radiogroup with roving tabindex, so it is one tab stop and arrow keys move within it — and arrows follow writing direction. |
| `VirtualList` | Renders only visible rows plus overscan, for smooth scrolling on low-end devices. |
| `CommandPalette` | A keyboard-first fuzzy launcher following the ARIA combobox pattern. |
| `Field` | A text field with label, description, and error actually wired to assistive technology. |

Built on 11 shared primitives you can also take on their own: `useNetwork`, `LocaleProvider`/`useLocale`, `announce`, `getDirection`/`getCalendar`, memoised `Intl` formatters, `sanitizeHref`, `useFocusTrap`, `useHydrated`, `useStoredValue`, and draft storage that refuses to write passwords to disk.

## Usage

```tsx
import { AsyncBoundary, statusOf } from "@/components/anywhere/async-boundary";

function Orders() {
  const { data, error, isLoading } = useOrders();

  return (
    <AsyncBoundary
      status={statusOf({ data, error, isLoading })}
      onRetry={refetch}
      minHeight="12rem"
      labels={{ empty: t("orders.empty"), retry: t("common.retry") }}
    >
      <OrderList orders={data} />
    </AsyncBoundary>
  );
}
```

Wrap your app once to make everything below it locale-aware:

```tsx
import { LocaleProvider } from "@/hooks/anywhere/use-locale";

<LocaleProvider locale={await resolveLocale()}>{children}</LocaleProvider>;
```

Resolve the locale on the server. Reading `navigator.language` during render causes a hydration mismatch and a visible flash of the wrong direction.

## The ten axes

**Performance.** Zero runtime dependencies. Every item is bundled, minified, and gzipped with React external, and fails against a size budget for its declared tier (`xs`/`sm`/`md`/`lg`) — a tier a reviewer can sanity-check by reading the component once, rather than a hundred hand-picked byte counts nobody reviews.

**Accessibility.** Every component is asserted against axe in each of its states, plus what axe cannot check: focus moves to new errors, live regions are mounted before they are filled, required state is exposed to assistive tech and not only as a red asterisk, and focus outlines are never removed.

**Internationalisation.** Every user-facing string is a prop with an English default. Layout uses CSS logical properties, so right-to-left is a data change rather than a rewrite. Dates go through the locale's own calendar — `buddhist` for `th-TH`, `islamic-umalqura` for `ar-SA`, `persian` for `fa-IR`.

**Privacy.** A static scan across every source file forbids `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, and fingerprinting-adjacent APIs (`navigator.geolocation`, `getBattery`, `hardwareConcurrency`). A copy-paste UI library has no legitimate reason to talk to a network on its own.

**Security.** The same scan forbids `dangerouslySetInnerHTML`, `eval`, `Function(...)`, `.innerHTML =`, and `document.write`. `sanitizeHref` strips `javascript:` and other executable URL schemes from every `href`/`src` rendered from caller-supplied data.

**Resilience.** `ErrorBoundary` contains a render crash to its own subtree instead of the whole page, with an announced, focusable, recoverable fallback.

**Offline.** A component that makes zero network calls cannot be broken by a dropped connection — this falls out of the privacy axis for most components. `ResilientForm` and `AsyncBoundary` go further, with explicit offline-queueing and offline-vs-broken messaging.

**SSR safety.** Every component renders through `react-dom/server` in a real Node environment in CI, asserting it never reaches for `window`, `document`, or `navigator` during the render pass that actually happens on a server.

**Sensory safety.** Any file that animates is required, by the same static scan, to also reference `motion-reduce:` or `prefers-reduced-motion` — making "we forgot" visible in a diff instead of only visible with the OS setting flipped.

**Supply chain.** Zero runtime dependencies, checked by scanning every import in the registry: only `react` and `react-dom` are allowed, registry-wide.

## Verification

Claims in this README are assertions in the test suite, not aspirations.

```bash
pnpm verify   # typecheck, lint, and the full test suite (633 tests)
```

- `tests/budget.test.ts` — performance and supply chain: bundles and gzips every item with React external against its tier budget, and scans imports.
- `tests/conformance.test.tsx` — accessibility: axe over every component's fixture.
- `tests/ssr.test.tsx` — SSR safety: every fixture through `react-dom/server`.
- `tests/static-scan.test.ts` — privacy, security, and sensory safety: source-level scans plus `sanitizeHref` unit tests.
- `tests/resilience.test.tsx` — resilience: `ErrorBoundary` containment, announcement, and recovery.
- `tests/locale.test.ts`, `tests/components.test.tsx`, `tests/draft-storage.test.ts` — internationalisation and offline behaviour, including that passwords, payment fields, and one-time codes are never written to disk.

`components/demos.tsx` is what makes this scale: one minimal render per component feeds every generic check above, so adding a component costs one fixture entry, not a bespoke test file per axis.

That same file is what the docs site renders as its previews. A component whose documented example differs from the example CI verifies is a documentation bug waiting to happen; sharing the file makes that drift structurally impossible. The one deliberate exception is overlays — Dialog, Drawer, CommandPalette and friends are audited *open*, because that is where the focus trap and `aria-modal` live, but the docs put them behind the trigger a real app would use, since six modals opening on page load is not a preview.

## Development

The registry URLs baked into `public/r/*.json` and shown on the docs site come from `NEXT_PUBLIC_SITE_URL` if set, falling back to Vercel's own `VERCEL_PROJECT_PRODUCTION_URL`/`VERCEL_URL` env vars, then to `localhost:3000`. Most deployments need no manual configuration at all.

```bash
pnpm install
pnpm dev              # docs site, component browser, and playground at localhost:3000
pnpm verify           # everything CI runs
pnpm registry:build   # compile registry.json into public/r/*.json
```

`next.config.ts` also runs the registry build itself at config-load time — so `next dev` and `next build` regenerate `public/r/` even if something upstream (a hosting platform's own build-command override, a cached CI step) skips the `pnpm registry:build` step in `package.json`.

Components live in `registry/anywhere/`. They import each other by relative path so the repo typechecks against real modules; `scripts/build-registry.mjs` rewrites those to `@/` aliases when compiling the distributable registry.

## Also in this repository

`gear5/` holds Gear5 UI, the agent-ops component library this repository started as. It builds and ships independently, with its own toolchain and its own CI job. Anywhere UI grew out of that work and is what the repository is about now.

## Contributing

New components are welcome, and are held to the same bar: a tier in `registry.json`, a fixture in `components/demos.tsx`, every string a prop, and logical properties throughout. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
