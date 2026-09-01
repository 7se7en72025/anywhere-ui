import Link from "next/link";
import { Playground } from "@/components/demo/playground";
import { Hero } from "@/components/site/hero";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { components, componentsByCategory, primitives } from "@/lib/registry";

const AXES = [
  {
    title: "Performance",
    body: "Every item is bundled, minified, and gzipped with React external, and fails against its declared tier budget.",
  },
  {
    title: "Accessibility",
    body: "axe runs over every component in every state, plus what axe cannot see: focus moving to new errors, live regions mounted before they are filled.",
  },
  {
    title: "Internationalisation",
    body: "Direction, calendar, numbering system, and week start come from the locale tag. Every string is a prop. RTL is a data change, not a rewrite.",
  },
  {
    title: "Privacy",
    body: "A source scan forbids fetch, XHR, sendBeacon, and fingerprinting-adjacent APIs across the whole registry. Nothing here phones home.",
  },
  {
    title: "Security",
    body: "dangerouslySetInnerHTML, eval, and innerHTML assignment are forbidden registry-wide; sanitizeHref strips executable URL schemes.",
  },
  {
    title: "Resilience",
    body: "ErrorBoundary contains a render crash to its own subtree with an announced, focusable, recoverable fallback.",
  },
  {
    title: "Offline",
    body: "A component that makes no network calls cannot be broken by a dropped connection. ResilientForm goes further and replays.",
  },
  {
    title: "SSR safety",
    body: "Every component renders through react-dom/server in CI — no reaching for window, document, or navigator during render.",
  },
  {
    title: "Sensory safety",
    body: "Any file that animates must also reference prefers-reduced-motion, checked by the same static scan.",
  },
  {
    title: "Supply chain",
    body: "Zero runtime dependencies. react is the only permitted import anywhere in the registry, enforced in CI.",
  },
];

const PROBLEMS = [
  {
    stat: "~2.6 billion",
    label: "are offline or intermittently connected",
    body: "Requests do not fail loudly on a bad connection — they hang. The spinner spins forever, the user taps again, and now there are two orders.",
  },
  {
    stat: "~1.3 billion",
    label: "live with a significant disability",
    body: "The live region is created in the same tick its text appears, so no screen reader ever announces it. The code looks accessible. It is silent.",
  },
  {
    stat: "~6.5 billion",
    label: "do not speak English as a first language",
    body: "Layouts assume left-to-right, dates assume the Gregorian calendar, numbers assume Latin digits, and address forms assume American ones.",
  },
];

export default function Home() {
  const siteUrl = getSiteUrl();
  const categories = componentsByCategory();

  return (
    <main id="main">
      <Hero />

      {/* Verification band — the trust strip, carrying claims rather than logos. */}
      <section className="border-y border-hairline bg-anvil">
        <div className="mx-auto max-w-[1200px] px-6 py-16">
          <div className="flex flex-col gap-3">
            <h2 className="text-heading-sm text-cream">Ten axes, every component</h2>
            <p className="max-w-3xl text-body text-smoke">
              Each one is a real assertion in the test suite, not a claim in this paragraph. The
              whole library is {components.length} components and {primitives.length} primitives,
              with nothing between them and your project.
            </p>
          </div>

          <ul className="mt-10 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-5">
            {AXES.map((axis) => (
              <li key={axis.title} className="flex flex-col gap-2">
                <h3 className="text-body font-medium text-cream">{axis.title}</h3>
                <p className="text-body-sm text-smoke">{axis.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Install. */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="flex flex-col gap-4">
          <h2 className="text-heading-sm text-cream">Install one, or all of them</h2>
          <p className="max-w-3xl text-body text-smoke">
            Components are copied into your repo by the shadcn CLI. No package to depend on, no
            version to upgrade, nothing to remove if you change your mind.
          </p>

          <code className="mt-2 w-fit max-w-full overflow-x-auto rounded-lg border border-hairline bg-anvil px-5 py-3 font-mono text-body-sm text-cream">
            npx shadcn@latest add {siteUrl}/r/async-boundary.json
          </code>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {categories.map((group) => (
            <li key={group.category}>
              <Link
                href="/components"
                className="flex h-full flex-col gap-1 rounded-lg border border-hairline bg-anvil p-5 transition-colors hover:border-coral/50"
              >
                <span className="text-body font-medium text-cream">{group.category}</span>
                <span className="text-body-sm text-smoke">
                  {group.items.length} components
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/*
        The one dark surface in the system, per the reference: a single
        full-bleed band that breaks the scroll's rhythm. It carries the
        argument for why the library exists, which is the part that should
        stop a reader.
      */}
      <section className="dusk-wash text-white">
        <div className="mx-auto max-w-[1200px] px-6 py-24">
          <h2 className="max-w-3xl text-heading-lg text-balance">
            Most component libraries are tested on the laptop they were written on.
          </h2>

          <div className="mt-14 grid gap-10 sm:grid-cols-3">
            {PROBLEMS.map((problem) => (
              <div key={problem.label} className="flex flex-col gap-3">
                <p className="text-heading-sm">{problem.stat}</p>
                <p className="text-body font-medium">{problem.label}</p>
                <p className="text-body-sm opacity-75">{problem.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-14 max-w-3xl text-body opacity-75">
            None of this is unknown. It is just never the default — so every team rebuilds the same
            handling badly, under deadline, and ships the version that worked where it was written.
          </p>
        </div>
      </section>

      {/* Live playground. */}
      <section className="mx-auto max-w-[1200px] px-6 py-20">
        <div className="flex flex-col gap-3">
          <h2 className="text-heading-sm text-cream">Try it</h2>
          <p className="max-w-3xl text-body text-smoke">
            Switch the network to <strong className="font-medium text-cream">Offline</strong> and submit the
            form — your answers are kept and sent when the connection returns. Switch the language
            to <span lang="ar">العربية</span> and the whole thing mirrors, including the calendar
            and the digits.
          </p>
        </div>

        <div className="mt-10">
          <Playground />
        </div>

        <div className="mt-12">
          <Link
            href="/components"
            className="inline-block rounded-md bg-coral px-5 py-2.5 text-body-sm font-medium text-on-accent transition-opacity hover:opacity-90"
          >
            Browse all {components.length} components
          </Link>
        </div>
      </section>

      <p className="sr-only">{siteConfig.description}</p>
    </main>
  );
}
