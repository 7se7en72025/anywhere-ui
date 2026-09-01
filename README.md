# Anywhere UI

[![CI](https://github.com/7se7en72025/gear5-ui/actions/workflows/ci.yml/badge.svg)](https://github.com/7se7en72025/gear5-ui/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![866 Tests Passing](https://img.shields.io/badge/tests-866%20passing-brightgreen)](https://github.com/7se7en72025/gear5-ui)
[![Zero Dependencies](https://img.shields.io/badge/dependencies-zero-brightgreen)](https://github.com/7se7en72025/gear5-ui)
[![Live Demo](https://img.shields.io/badge/demo-live-blue)](https://gear5-ui.dev)

**React components that work anywhere.** Any device. Any network. Any language. Any ability.

110 components built for the conditions most component libraries never get tested against, and checked against ten different axes in CI rather than just claimed here.

[**Try the live demo**](https://gear5-ui.dev) | [**Browse all components**](https://gear5-ui.dev/components) | [**View on GitHub**](https://github.com/7se7en72025/gear5-ui)

![A recording of the docs site: the wrong/right showcase, the command palette, the locale switcher, and a form surviving going offline](docs/demo.gif)

---

## Quick Start

```bash
npx shadcn@latest add https://gear5-ui.dev/r/async-boundary.json
```

The components get copied into your repo. There is no package to depend on, no version to upgrade, and nothing to uninstall if you change your mind.

```tsx
import { AsyncBoundary, statusOf } from "@/components/gear5/async-boundary";

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

---

## Table of Contents

- [The problem](#the-problem)
- [The bugs you cannot see](#the-bugs-you-cannot-see)
- [Components](#components)
- [Usage](#usage)
- [The ten axes](#the-ten-axes)
- [Verification](#verification)
- [Development](#development)
- [Contributing](#contributing)
- [License](#license)

---

## The problem

Three facts about the people who use software:

| | |
|---|---|
| ~2.6 billion | are offline or on a connection that keeps dropping |
| ~1.3 billion | live with a significant disability |
| ~6.5 billion | do not speak English as a first language |

None of this is news. It is just never the default. So every team rebuilds the same handling badly, under deadline, and ships the version that worked on the laptop it was written on:

- Requests do not fail loudly on a bad connection. They hang. The spinner spins forever, the user taps the button again, and now there are two orders.
- The live region gets created in the same tick its text appears, so no screen reader ever announces it. The code looks accessible. It is silent.
- Focus never moves to the error, so a keyboard user has to go hunting for what went wrong.
- Layout assumes left to right, dates assume the Gregorian calendar, numbers assume Latin digits.
- A form loses twenty minutes of typing because the tab got backgrounded and the OS reclaimed it.

Anywhere UI is what those fixes look like when someone has the time to do them properly, written once, in the open.

## The bugs you cannot see

These are the ones worth looking at first. Each is a real thing people ship, next to what this library does instead. All of it is computed live on the docs site, so you can check it in devtools:

| | What most apps ship | Anywhere UI |
|---|---|---|
| `CompactNumber` | `1.2M` | `12.3 लाख` |
| `BidiText` | `42 - إيان replies` | `إيان - 42 replies` |
| `OrdinalText` | `11st · 12nd · 13rd` | `11th · 12th · 13th` |
| `CurrencyField` | `€1.23` | `1.234,56 €` |
| `PluralText` | `3 файлы` | `3 файла` |
| `SortableTable` | `Zebra · apple · Ångström` | `Ångström · apple · Zebra` |
| `CharacterCounter` | `31 of 40` | `21 of 40` |
| `BytesText` | `5.4 MB` | `5,4 Mo` |

Every one of those has the same shape. The naive version is fine in English on a fast laptop and quietly wrong for a large chunk of the world. `parseFloat("1.234,56")` returns `1.234`, so a German customer typing twelve hundred euros gets charged one euro twenty three. An Arabic name next to a number pulls the number to the wrong side of it, so the sentence reads backwards, and only for users whose names trigger it.

## Components

110 components across eight categories. The docs site gives each one its own page with a live preview, the install command, the full source, and the size budget it is held to. There is search and category filtering at `/components`, and Ctrl+K opens a palette that searches all of them.

A few of the flagships:

| Component | What it solves |
|---|---|
| `AsyncBoundary` | The four states every fetch really has: loading, error, empty, offline. Announced, focus managed, and height reserved so nothing jumps. |
| `ResilientForm` | Drafts saved as the user types, offline submits queued and retried, errors given a focusable summary, double submits blocked. |
| `ErrorBoundary` | Keeps a render crash inside its own subtree, with a fallback that is announced, focusable, and recoverable. The rest of the page keeps working. |
| `AdaptiveImage` | Will not spend a user's data on Save-Data and 2G connections until they ask for it. `width` and `height` are mandatory, so nothing shifts. |
| `Calendar` | A month grid in the reader's own calendar system (`islamic-umalqura`, `buddhist`, `persian`) and their own week start. |
| `AddressFields` | Field order and required fields follow the country being addressed. Japan asks for the postal code first, largest to smallest. 43 countries covered. |
| `SegmentedControl` | A real radiogroup with roving tabindex, so it is one tab stop and the arrow keys move within it. Arrows follow writing direction. |
| `Heading` | Headings that take their level from context, so a reusable card never breaks the page outline that screen reader users navigate by. |
| `VirtualList` | Renders only the visible rows plus overscan, so long lists stay smooth on cheap phones. |
| `CommandPalette` | A keyboard first launcher following the ARIA combobox pattern. |
| `Field` | A text field with its label, description, and error actually wired to assistive technology. |

They are built on 11 shared primitives you can also take on their own: `useNetwork`, `LocaleProvider` and `useLocale`, `announce`, `getDirection` and `getCalendar`, memoised `Intl` formatters, `sanitizeHref`, `useFocusTrap`, `useHydrated`, `useStoredValue`, and draft storage that refuses to write passwords to disk.

## Usage

```tsx
import { AsyncBoundary, statusOf } from "@/components/gear5/async-boundary";

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

Wrap your app once to make everything below it locale aware:

```tsx
import { LocaleProvider } from "@/hooks/gear5/use-locale";

<LocaleProvider locale={await resolveLocale()}>{children}</LocaleProvider>;
```

Resolve the locale on the server. Reading `navigator.language` during render causes a hydration mismatch and a visible flash of the wrong direction.

## The ten axes

**Performance.** No runtime dependencies. Every item gets bundled, minified, and gzipped with React external, then checked against the budget for its declared tier (`xs`, `sm`, `md`, `lg`). A tier is something a reviewer can sanity check by reading the component once, which a hundred hand picked byte counts is not.

**Accessibility.** Every component gets run through axe in each of its states, plus the parts axe cannot check: focus moves to new errors, live regions are mounted before they are filled, required state is exposed to assistive tech and not only as a red asterisk, and focus outlines are never removed.

**Internationalisation.** Anything going through `Intl` (numbers, dates, ranges, collation, plurals, units) works for every locale the runtime knows, which is hundreds. The docs let you check 20 of them by hand. Where the behaviour is cultural convention that no API exposes, it is a hand maintained table instead: address field order covers 43 countries, name order covers the languages that put the family name first. Every user facing string is a prop with an English default. Layout uses CSS logical properties, so right to left is a data change rather than a rewrite.

**Privacy.** A static scan across every source file forbids `fetch`, `XMLHttpRequest`, `sendBeacon`, `WebSocket`, and fingerprinting adjacent APIs like `navigator.geolocation` and `getBattery`. A copy paste UI library has no business talking to a network on its own.

**Security.** The same scan forbids `dangerouslySetInnerHTML`, `eval`, `Function(...)`, `.innerHTML =`, and `document.write`. `sanitizeHref` strips `javascript:` and other executable URL schemes out of anything rendered from caller supplied data.

**Resilience.** `ErrorBoundary` keeps a render crash inside its own subtree instead of taking the page down, with a fallback that is announced, focusable, and recoverable.

**Offline.** A component that makes no network calls cannot be broken by a dropped connection, which mostly falls out of the privacy rule. `ResilientForm` and `AsyncBoundary` go further, with real offline queueing and messaging that tells "offline" apart from "broken".

**SSR safety.** Every component gets rendered through `react-dom/server` in a real Node environment in CI, which catches anything reaching for `window`, `document`, or `navigator` during the render that actually happens on a server.

**Sensory safety.** Any file that animates has to also reference `motion-reduce:` or `prefers-reduced-motion`, checked by the same static scan. That makes "we forgot" visible in a diff instead of only visible with the OS setting flipped.

**Supply chain.** No runtime dependencies, checked by scanning every import in the registry. Only `react` and `react-dom` are allowed anywhere in it.

## Verification

The claims above are assertions in the test suite, not aspirations.

```bash
pnpm verify   # typecheck, lint, and the full suite (866 tests)
```

- `tests/budget.test.ts` covers performance and supply chain. It bundles and gzips every item with React external against its tier budget, and scans imports.
- `tests/conformance.test.tsx` covers accessibility, running axe over every component's fixture.
- `tests/ssr.test.tsx` covers SSR safety, putting every fixture through `react-dom/server`.
- `tests/static-scan.test.ts` covers privacy, security, and sensory safety, plus `sanitizeHref` unit tests.
- `tests/resilience.test.tsx` covers `ErrorBoundary` containment, announcement, and recovery.
- `tests/locale.test.ts` covers internationalisation: direction, calendar, week start, and a formatting smoke test across all 20 locales the docs offer, spanning RTL scripts, non-Gregorian calendars, non-Latin digits, and lakh and ten thousand grouping.
- `tests/locale-forms.test.tsx` covers the components whose correctness lives in a hand maintained table rather than in `Intl`: `AddressFields` across 43 countries, `NameFields` for name order, and `ErrorSummary` for pluralisation.
- `tests/components.test.tsx` and `tests/draft-storage.test.ts` cover component behaviour and offline handling, including the rule that passwords, payment fields, and one time codes never get written to disk.

`components/demos.tsx` is what makes this scale. One minimal render per component feeds every generic check above, so adding a component costs one fixture entry rather than a bespoke test file per axis.

That same file is what the docs site renders as its previews. A component whose documented example differs from the one CI verifies is a documentation bug waiting to happen, and sharing the file makes that drift impossible. The one deliberate exception is overlays. Dialog, Drawer, CommandPalette and friends get audited *open*, because that is where the focus trap and `aria-modal` live, but the docs put them behind the trigger a real app would use. Six modals opening on page load is not a preview.

## Development

The registry URLs baked into `public/r/*.json` and shown on the docs site come from `NEXT_PUBLIC_SITE_URL` if it is set, then Vercel's own `VERCEL_PROJECT_PRODUCTION_URL` or `VERCEL_URL`, then `localhost:3000`. Most deployments need no configuration at all.

```bash
pnpm install
pnpm dev              # docs site, component browser, and playground at localhost:3000
pnpm verify           # everything CI runs
pnpm registry:build   # compile registry.json into public/r/*.json
```

`next.config.ts` also runs the registry build itself at config load time, so `next dev` and `next build` regenerate `public/r/` even when something upstream skips the `pnpm registry:build` step. A hosting platform's build command override or a cached CI step will both do that, and the failure is silent: a deployed site whose own install commands 404.

Components live in `registry/gear5/`. They import each other by relative path so the repo typechecks against real modules, and `scripts/build-registry.mjs` rewrites those to `@/` aliases when it compiles the distributable registry.

## Also in this repository

`gear5/` holds Gear5 UI, the agent-ops component library this repository started as. It builds and ships independently, with its own toolchain and its own CI job. Anywhere UI grew out of that work and is what the repository is about now.

## Contributing

New components are welcome, held to the same bar: a tier in `registry.json`, a fixture in `components/demos.tsx`, every string a prop, and logical properties throughout. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
