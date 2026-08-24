import Link from "next/link";
import { Nav } from "@/components/site/nav";
import { registry } from "@/lib/registry";

export default function ComponentsPage() {
  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <h1 className="text-3xl font-semibold tracking-tight">Components</h1>
        <p className="mt-2 text-muted">
          {registry.length} components for building agent interfaces.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {registry.map((entry) => (
            <Link
              key={entry.slug}
              href={`/components/${entry.slug}`}
              className="rounded-xl border border-border bg-card p-5 transition-colors hover:border-accent/40"
            >
              <h2 className="font-mono text-sm font-medium text-foreground">
                {entry.name}
              </h2>
              <p className="mt-1.5 text-sm text-muted">{entry.description}</p>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
