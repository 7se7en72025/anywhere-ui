import type { Metadata } from "next";
import { ComponentBrowser } from "@/components/site/component-browser";
import { components, componentsByCategory } from "@/lib/registry";

export const metadata: Metadata = {
  title: "Components",
  description: `All ${components.length} Anywhere UI components, with live previews. The same fixtures the conformance suite renders in CI.`,
};

export default function ComponentsPage() {
  const categories = componentsByCategory().map((group) => group.category);

  const items = components.map((item) => ({
    name: item.name,
    title: item.title,
    description: item.description,
    category: item.category ?? "Uncategorised",
    tier: item.tier,
  }));

  return (
    <main id="main" className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12">
      <header className="animate-fade-in-up flex flex-col gap-3">
        <h1 className="text-heading font-semibold">Components</h1>
        <p className="max-w-3xl text-neutral-600 dark:text-neutral-300">
          All {components.length} of them, with zero runtime dependencies between them and your
          project. Every preview below is the exact fixture the conformance suite renders in CI,
          the same render axe audits and the SSR pass exercises, so nothing here can drift from
          what is actually verified.
        </p>
      </header>

      <ComponentBrowser items={items} categories={categories} />
    </main>
  );
}
