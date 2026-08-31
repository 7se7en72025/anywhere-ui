import Link from "next/link";
import { Playground } from "@/components/demo/playground";
import { getSiteUrl, siteConfig } from "@/lib/site";
import { components, componentsByCategory } from "@/lib/registry";

const PROBLEMS = [
  {
    stat: "~2.6 billion",
    label: "people are offline or intermittently connected",
    body: "Requests do not fail loudly on a bad connection — they hang. Most UIs show a spinner forever and let the user tap the button again.",
  },
  {
    stat: "~1.3 billion",
    label: "people live with a significant disability",
    body: "Focus never moves to the error. The live region is created at the same moment its text appears, so it is never read aloud.",
  },
  {
    stat: "~6.5 billion",
    label: "people do not speak English as a first language",
    body: "Layouts assume left-to-right, dates assume the Gregorian calendar, and numbers assume Latin digits.",
  },
];

const AXES = [
  {
    title: "Performance",
    body: "Every item is bundled, minified, and gzipped with React external in CI, and fails against a declared size budget.",
  },
  {
    title: "Accessibility",
    body: "axe runs over every component in every state, plus what axe cannot see: focus moving to new errors, live regions mounted before they are filled.",
  },
  {
    title: "Internationalisation",
    body: "Direction, calendar, numbering system, and week start are resolved from the locale tag. Every string is a prop. RTL is a data change, not a rewrite.",
  },
  {
    title: "Privacy",
    body: "A source scan forbids fetch, XHR, sendBeacon, and fingerprinting-adjacent APIs across the whole registry — nothing here phones home.",
  },
  {
    title: "Security",
    body: "dangerouslySetInnerHTML, eval, and innerHTML assignment are forbidden registry-wide; sanitizeHref strips javascript: and other executable schemes.",
  },
  {
    title: "Resilience",
    body: "ErrorBoundary contains a render crash to its own subtree with an announced, focusable, recoverable fallback — the page around it keeps working.",
  },
  {
    title: "Offline",
    body: "A component that makes zero network calls cannot be broken by a dropped connection. ResilientForm goes further: it queues and replays.",
  },
  {
    title: "SSR safety",
    body: "Every component renders through react-dom/server in a real Node environment in CI — no reaching for window, document, or navigator at render time.",
  },
  {
    title: "Sensory safety",
    body: "Any animation is required, by the same source scan, to carry a motion-reduce or prefers-reduced-motion guard in its own file.",
  },
  {
    title: "Supply chain",
    body: "Zero runtime dependencies. react (and its own react-dom) are the only imports allowed anywhere in the registry, enforced in CI.",
  },
];

export default function Home() {
  const categoryCount = componentsByCategory().length;
  const siteUrl = getSiteUrl();

  return (
    <main id="main" className="mx-auto flex max-w-5xl flex-col gap-20 px-5 py-16">
      <header className="flex flex-col gap-6">
        <p className="text-caption font-medium tracking-[0.05em] text-neutral-900 uppercase dark:text-neutral-100">
          Open source · MIT · {components.length} components
        </p>

        <h1 className="text-heading-lg font-semibold text-balance sm:text-display">
          React components that work <span className="text-blue-700 dark:text-blue-400">anywhere</span>.
        </h1>

        <p className="max-w-2xl text-body-lg text-pretty text-neutral-700 dark:text-neutral-300">
          Any device. Any network. Any language. Any ability. {siteConfig.name} is a set of{" "}
          {components.length} components engineered for the conditions most component libraries are
          never tested against — and verified against all ten, in CI.
        </p>

        <div className="flex flex-col gap-3">
          <code className="w-fit rounded-lg bg-neutral-100 px-4 py-2.5 font-mono text-sm dark:bg-neutral-900">
            npx shadcn@latest add {siteUrl}/r/async-boundary.json
          </code>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Components are copied into your repo. No package to depend on, no version to upgrade,
            nothing to remove if you change your mind.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-heading-sm font-semibold">The problem</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {PROBLEMS.map((problem) => (
            <div key={problem.label} className="flex flex-col gap-2">
              <p className="text-3xl font-semibold tracking-tight">{problem.stat}</p>
              <p className="text-sm font-medium">{problem.label}</p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{problem.body}</p>
            </div>
          ))}
        </div>
        <p className="max-w-3xl text-neutral-700 dark:text-neutral-300">
          None of this is unknown. It is just never the default — so every team rebuilds it badly,
          under deadline, and ships the version that works on the laptop it was written on.
        </p>
      </section>

      <section className="flex flex-col gap-6">
        <div>
          <h2 className="text-heading-sm font-semibold">Try it</h2>
          <p className="mt-2 max-w-3xl text-neutral-700 dark:text-neutral-300">
            Switch the network to <strong>Offline</strong> and submit the form — your answers are
            kept and sent when the connection returns. Switch the language to{" "}
            <span lang="ar">العربية</span> and the whole thing mirrors, including the calendar and
            the digits.
          </p>
        </div>
        <Playground />
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-heading-sm font-semibold">Ten axes, every component</h2>
        <p className="max-w-3xl text-neutral-700 dark:text-neutral-300">
          Each one is a real assertion in the test suite, not a claim in this paragraph — see{" "}
          <code className="rounded bg-neutral-100 px-1.5 py-0.5 text-sm dark:bg-neutral-900">
            tests/
          </code>{" "}
          in the repository.
        </p>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {AXES.map((axis) => (
            <div key={axis.title} className="flex flex-col gap-2">
              <h3 className="font-semibold">{axis.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{axis.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className="text-heading-sm font-semibold">Browse the library</h2>
        <p className="max-w-3xl text-neutral-700 dark:text-neutral-300">
          {components.length} components across {categoryCount} categories, each with a live
          preview that is the same fixture CI renders.
        </p>
        <Link
          href="/components"
          className="w-fit rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-neutral-100 dark:text-neutral-900"
        >
          View all components
        </Link>
      </section>

    </main>
  );
}
