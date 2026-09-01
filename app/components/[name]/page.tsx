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
  "Bundled, minified and gzipped against its tier budget",
  "Audited by axe in the state previewed above",
  "Rendered through react-dom/server with no browser globals",
  "Scanned for network calls, dangerous sinks, and unguarded animation",
];

export default async function ComponentPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const item = getItem(name);

  if (!item || item.type !== "registry:ui") notFound();

  const source = await readSource(item);
  const dependencies = resolveDependencies(item.name);
  // Only UI dependents get listed: primitives have no page to link to.
  const dependents = dependentsOf(item.name).filter((d) => d.type === "registry:ui");
  const budget = item.tier ? TIER_BUDGETS[item.tier] : undefined;

  return (
    <main id="main" className="mx-auto flex max-w-4xl flex-col gap-10 px-5 py-12">
      <nav aria-label="Breadcrumb" className="text-sm text-neutral-600 dark:text-neutral-400">
        <Link href="/components" className="underline-offset-4 hover:underline">
          Components
        </Link>
        <span aria-hidden="true"> / </span>
        <span>{item.category}</span>
      </nav>

      <header className="flex flex-col gap-3">
        <h1 className="font-mono text-heading-sm font-semibold">{item.title}</h1>
        <p className="text-body-lg text-neutral-700 dark:text-neutral-300">{item.description}</p>

        <dl className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-neutral-600 dark:text-neutral-400">Category</dt>
            <dd>{item.category}</dd>
          </div>

          {item.tier && budget && (
            <div className="flex gap-2">
              <dt className="text-neutral-600 dark:text-neutral-400">Budget</dt>
              <dd>
                <span className="font-mono">{item.tier}</span> — under {budget} B gzipped
                <span className="text-neutral-600 dark:text-neutral-400">
                  {" "}
                  ({TIER_LABELS[item.tier]})
                </span>
              </dd>
            </div>
          )}

          <div className="flex gap-2">
            <dt className="text-neutral-600 dark:text-neutral-400">Runtime dependencies</dt>
            <dd>None</dd>
          </div>
        </dl>
      </header>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Preview</h2>
        <Preview name={item.name} showControls />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          This is the exact fixture the conformance suite renders in CI. Switch the language to see
          the component mirror and reformat.
        </p>
      </section>

      <ComponentComparison name={item.name} />

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">Install</h2>
        <Copyable value={installCommand(item.name)} label="Copy install command" />
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
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
        <Copyable value={source} label={`Copy ${item.title} source`} block />
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-lg font-semibold tracking-tight">What CI checks</h2>
        <ul className="flex list-disc flex-col gap-1.5 ps-5 text-sm text-neutral-700 dark:text-neutral-300">
          {AXES.map((axis) => (
            <li key={axis}>{axis}</li>
          ))}
        </ul>
      </section>

      {dependents.length > 0 && (
        <section className="flex flex-col gap-3">
          <h2 className="text-lg font-semibold tracking-tight">Used by</h2>
          <ul className="flex flex-wrap gap-2">
            {dependents.map((dependent) => (
              <li key={dependent.name}>
                <Link
                  href={`/components/${dependent.name}`}
                  className="rounded-md border border-neutral-300 px-3 py-1 font-mono text-xs underline-offset-4 hover:underline dark:border-neutral-700"
                >
                  {dependent.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
