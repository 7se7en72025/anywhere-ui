import { Playground } from "@/components/demo/playground";
import { siteConfig } from "@/lib/site";
import registry from "@/registry.json";

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
    title: "Any device, any network",
    body: "Zero runtime dependencies. Save-Data and connection quality are respected rather than ignored. Every state reserves its height, so content landing does not shove the page around.",
  },
  {
    title: "Any ability",
    body: "Every component is asserted against axe in each of its states, plus the things axe cannot see: focus moves to new errors, live regions are mounted before they are filled, and required is exposed to assistive tech and not only as a red asterisk.",
  },
  {
    title: "Any language",
    body: "Direction, calendar, numbering system, and first day of week are resolved from the locale tag. Every string is a prop. Layout uses logical properties, so RTL is a data change, not a rewrite.",
  },
];

export default function Home() {
  const components = registry.items.filter((item) => item.type === "registry:ui");
  const primitives = registry.items.filter((item) => item.type !== "registry:ui");

  return (
    <main id="main" className="mx-auto flex max-w-5xl flex-col gap-20 px-5 py-16">
      <header className="flex flex-col gap-6">
        <p className="text-sm font-medium tracking-wide text-blue-700 uppercase dark:text-blue-400">
          Open source · MIT
        </p>

        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          React components that work <span className="text-blue-700 dark:text-blue-400">anywhere</span>.
        </h1>

        <p className="max-w-2xl text-lg text-pretty text-neutral-700 dark:text-neutral-300">
          Any device. Any network. Any language. Any ability. {siteConfig.name} is a small set of
          components engineered for the conditions most component libraries are never tested
          against — and verified against all three, in CI.
        </p>

        <div className="flex flex-col gap-3">
          <code className="w-fit rounded-lg bg-neutral-100 px-4 py-2.5 font-mono text-sm dark:bg-neutral-900">
            npx shadcn@latest add https://anywhere-ui.dev/r/async-boundary.json
          </code>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Components are copied into your repo. No package to depend on, no version to upgrade,
            nothing to remove if you change your mind.
          </p>
        </div>
      </header>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold tracking-tight">The problem</h2>
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
          <h2 className="text-2xl font-semibold tracking-tight">Try it</h2>
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
        <h2 className="text-2xl font-semibold tracking-tight">Three axes, every component</h2>
        <div className="grid gap-6 sm:grid-cols-3">
          {AXES.map((axis) => (
            <div key={axis.title} className="flex flex-col gap-2">
              <h3 className="font-semibold">{axis.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{axis.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold tracking-tight">Components</h2>

        <ul className="grid gap-4 sm:grid-cols-2">
          {components.map((item) => (
            <li
              key={item.name}
              className="flex flex-col gap-1 rounded-xl border border-neutral-200 p-4 dark:border-neutral-800"
            >
              <h3 className="font-mono text-sm font-semibold">{item.title}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{item.description}</p>
              <code className="mt-2 overflow-x-auto rounded-md bg-neutral-100 px-2 py-1 font-mono text-xs dark:bg-neutral-900">
                npx shadcn@latest add https://anywhere-ui.dev/r/{item.name}.json
              </code>
            </li>
          ))}
        </ul>

        <h3 className="mt-4 text-lg font-semibold">Primitives they build on</h3>
        <ul className="flex flex-wrap gap-2">
          {primitives.map((item) => (
            <li
              key={item.name}
              className="rounded-full border border-neutral-300 px-3 py-1 font-mono text-xs dark:border-neutral-700"
            >
              {item.name}
            </li>
          ))}
        </ul>
      </section>

      <footer className="flex flex-col gap-2 border-t border-neutral-200 pt-8 text-sm text-neutral-600 dark:border-neutral-800 dark:text-neutral-400">
        <p>
          {siteConfig.name} — MIT licensed.{" "}
          <a className="underline underline-offset-2" href={siteConfig.repo}>
            Source and contribution guide on GitHub
          </a>
          .
        </p>
        <p>This page ships no web fonts and no analytics.</p>
      </footer>
    </main>
  );
}
