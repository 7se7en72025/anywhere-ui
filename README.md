# Anywhere UI

**React components that work anywhere.** Any device. Any network. Any language. Any ability.

A small set of components engineered for the conditions most component libraries are never tested against — and verified against all three of them in CI.

- **5.4 KB gzipped** for the entire library, React external. Zero runtime dependencies.
- **Every component asserted against axe** in every one of its states, plus the things axe cannot see.
- **Direction, calendar, numbering system, and week start** resolved from the locale tag, not hardcoded.

```bash
npx shadcn@latest add https://anywhere-ui.dev/r/async-boundary.json
```

Components are copied into your repo. There is no package to depend on, no version to upgrade, and nothing to uninstall if you change your mind.

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

| Component | What it solves |
|---|---|
| `AsyncBoundary` | The four states every fetch really has — loading, error, empty, offline — announced, focus-managed, and height-reserved so nothing jumps. |
| `ResilientForm` | Drafts persisted as the user types, offline submits queued and retried, errors given a focusable summary, double submits blocked. |
| `AdaptiveImage` | Refuses to spend a user's data on Save-Data and 2G-class connections until they ask. `width`/`height` mandatory, so nothing shifts. |
| `ConnectionStatus` | A live banner for offline, restored, and constrained connections, in the page's own language and direction. |
| `Field` | A text field with label, description, and error actually wired to assistive technology. |

Built on primitives you can take on their own: `useNetwork`, `LocaleProvider`/`useLocale`, `announce`, `getDirection`/`getCalendar`, memoised `Intl` formatters, and draft storage that refuses to write passwords to disk.

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

## The three axes

**Any device, any network.** Zero runtime dependencies. Save-Data and connection quality are respected rather than ignored. Every non-ready state can reserve its height, so content arriving does not shove the page around.

**Any ability.** Every component is asserted against axe in each of its states, plus what axe cannot check: focus moves to new errors, live regions are mounted before they are filled, required state is exposed to assistive tech and not only as a red asterisk, and focus outlines are never removed.

**Any language.** Every user-facing string is a prop with an English default. Layout uses CSS logical properties, so right-to-left is a data change rather than a rewrite. Dates go through the locale's own calendar — `buddhist` for `th-TH`, `islamic-umalqura` for `ar-SA`, `persian` for `fa-IR`.

## Verification

Claims in this README are assertions in the test suite, not aspirations.

```bash
pnpm verify   # typecheck, lint, and the full test suite
```

- `tests/budget.test.ts` bundles and minifies each component with React external, gzips it, and fails if it exceeds its declared budget. Sizes are printed on every run.
- `tests/components.test.tsx` runs axe over every component in every state, and asserts the behaviours axe cannot see.
- `tests/locale.test.ts` checks direction, calendar, and formatting across Arabic, Hebrew, Persian, Urdu, Kurdish, Dhivehi, Hindi, Japanese, Thai, and more.
- `tests/draft-storage.test.ts` asserts that passwords, payment fields, and one-time codes are never written to disk.

Current measured sizes, gzipped, React external:

```
cn                     145 B      async-boundary        2360 B
use-network            470 B      connection-status     1575 B
locale                 483 B      adaptive-image        1594 B
use-locale             650 B      field                  685 B
announce               509 B      resilient-form        3042 B
format                 465 B
draft-storage          695 B      — entire library      5469 B
```

## Development

The registry URLs above are generated from `NEXT_PUBLIC_SITE_URL`. Set it to the
deployment's own origin so the `shadcn add` commands on the docs site resolve.

```bash
pnpm install
pnpm dev              # docs site and live playground at localhost:3000
pnpm verify           # everything CI runs
pnpm registry:build   # compile registry.json into public/r/*.json
```

Components live in `registry/anywhere/`. They import each other by relative path so the repo typechecks against real modules; `scripts/build-registry.mjs` rewrites those to `@/` aliases when compiling the distributable registry.

## Also in this repository

`gear5/` holds Gear5 UI, the agent-ops component library this repository
started as. It builds and ships independently, with its own toolchain and its
own CI job. Anywhere UI grew out of that work and is what the repository is
about now.

## Contributing

New components are welcome, and are held to the same bar: a budget in `tests/budget.test.ts`, axe assertions in every state, every string a prop, and logical properties throughout. See [CONTRIBUTING.md](CONTRIBUTING.md).

## License

MIT
