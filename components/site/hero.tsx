import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export function Hero() {
  return (
    <section className="mx-auto flex max-w-5xl flex-col items-center gap-6 px-6 py-32 text-center">
      <Badge variant="accent">Built for agent interfaces</Badge>
      <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-balance sm:text-6xl">
        UI components for the agent era
      </h1>
      <p className="max-w-xl text-lg text-muted">
        Tool permissions, run controls, streaming output — the pieces every
        agent dashboard needs, copy-paste ready.
      </p>
      <div className="flex flex-col gap-4 pt-4 text-base font-medium sm:flex-row">
        <Link
          href="/components"
          className="flex h-12 items-center justify-center rounded-full bg-accent px-6 text-accent-foreground transition-opacity hover:opacity-90"
        >
          Browse Components
        </Link>
        <a
          href="https://github.com"
          className="flex h-12 items-center justify-center rounded-full border border-border px-6 text-foreground transition-colors hover:bg-card"
        >
          View on GitHub
        </a>
      </div>
    </section>
  );
}
