import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Copyable } from "@/components/site/copyable";
import { ComponentComparison } from "@/components/site/component-comparison";
import { Preview } from "@/components/site/preview";
import {
  TIER_BUDGETS,
  TIER_LABELS,
  components,
  dependentsOf,
  getItem,
  installCommand,
  resolveDependencies,
} from "@/lib/registry";
import { readSource } from "@/lib/source";

export function generateStaticParams() {
  return components.map((item) => ({ name: item.name }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>;
}): Promise<Metadata> {
  const { name } = await params;
  const item = getItem(name);

  if (!item) return {};

  return {
    title: item.title,
    description: item.description,
    openGraph: { title: item.title, description: item.description },
  };
}

const AXES = [
  { icon: "📦", label: "Bundled, minified and gzipped against its tier budget" },
  { icon: "♿", label: "Audited by axe in the state previewed above" },
  { icon: "🖥️", label: "Rendered through react-dom/server with no browser globals" },
  { icon: "🔒", label: "Scanned for network calls, dangerous sinks, and unguarded animation" },
];

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const item = getItem(name);

  if (!item || item.type !== "registry:ui") notFound();

  const source = await readSource(item);
  const dependencies = resolveDependencies(item.name);
  const dependents = dependentsOf(item.name).filter((d) => d.type === "registry:ui");
  const budget = item.tier ? TIER_BUDGETS[item.tier] : undefined;

  return (
    <main id="main" className="mx-auto flex max-w-5xl flex-col gap-10 px-5 py-12">
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
        <Link href="/components" className="transition-colors hover:text-neutral-700 dark:hover:text-neutral-200 underline-offset-4 hover:underline">
          Components
        </Link>
        <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-neutral-400 dark:text-neutral-500">{item.category}</span>
        <svg className="size-3 shrink-0" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        </svg>
        <span className="text-neutral-700 dark:text-neutral-200 font-medium">{item.title}</span>
      </nav>

      <header className="flex flex-col gap-4">
        <div className="flex flex-wrap items-start gap-3">
          <h1 className="font-mono text-heading-sm font-semibold">{item.title}</h1>
          {item.tier && budget && (
            <span className="mt-1 rounded-full bg-coral/10 px-2.5 py-0.5 text-xs font-medium text-coral border border-coral/20">
              {item.tier.toUpperCase()}, under {budget}B gzipped
            </span>
          )}
        </div>
        <p className="max-w-3xl text-body-lg text-neutral-600 dark:text-neutral-300">{item.description}</p>

        <dl className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400">Category</dt>
            <dd className="font-medium">{item.category}</dd>
          </div>

          {item.tier && budget && (
            <div className="flex gap-2">
              <dt className="text-neutral-500 dark:text-neutral-400">Budget</dt>
              <dd>
                <span className="font-mono">{item.tier}</span>, {TIER_LABELS[item.tier]}
              </dd>
            </div>
          )}

          <div className="flex gap-2">
            <dt className="text-neutral-500 dark:text-neutral-400">Runtime deps</dt>
            <dd className="font-medium text-green-600 dark:text-green-400">None</dd>
          </div>
        </dl>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Preview</h2>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
          <Preview name={item.name} showControls />
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          This is the exact fixture the conformance suite renders in CI. Switch the language to see
          the component mirror and reformat.
        </p>
      </section>

      <ComponentComparison name={item.name} />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Install</h2>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <Copyable value={installCommand(item.name)} label="Copy install command" />
        </div>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Copies the source into your project.
          {dependencies.length > 0 && (
            <>
              {" "}
              Pulls in {dependencies.length}{" "}
              {dependencies.length === 1 ? "primitive" : "primitives"}:{" "}
              <span className="font-mono">{dependencies.join(", ")}</span>.
            </>
          )}
        </p>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Source</h2>
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <Copyable value={source} label={`Copy ${item.title} source`} block />
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">What CI checks</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {AXES.map((axis) => (
            <li key={axis.label} className="flex items-start gap-3 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800">
              <span className="text-lg" aria-hidden="true">{axis.icon}</span>
              <span className="text-sm text-neutral-600 dark:text-neutral-300">{axis.label}</span>
            </li>
          ))}
        </ul>
      </section>

      {dependents.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Used by</h2>
          <div className="flex flex-wrap gap-2">
            {dependents.map((dependent) => (
              <Link
                key={dependent.name}
                href={`/components/${dependent.name}`}
                className="rounded-full border border-neutral-300 px-3 py-1 font-mono text-xs transition-colors hover:border-coral hover:text-coral dark:border-neutral-700 dark:hover:border-coral"
              >
                {dependent.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex items-center gap-4 border-t border-neutral-200 pt-8 dark:border-neutral-800">
        <Link
          href="/components"
          className="text-sm text-neutral-500 transition-colors hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
        >
          &larr; All components
        </Link>
      </div>
    </main>
  );
}
