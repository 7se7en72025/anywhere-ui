import Link from "next/link";
import { SiteNav, SiteFooter, Bracket } from "@/components/site/chrome";
import { registry, categoryColors } from "@/lib/registry";

export default function ComponentsPage() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <SiteNav />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 pb-32 pt-16">
        <Bracket>Gear5® Components</Bracket>

        <h1
          className="mt-6 font-semibold"
          style={{
            fontSize: "clamp(56px, 10vw, 101px)",
            lineHeight: 1,
            letterSpacing: "-0.011em",
          }}
        >
          Every piece
        </h1>
        <p className="mt-6 max-w-md text-[23px] leading-[1.38] tracking-[-0.23px]">
          {registry.length} components for building agent interfaces. Copy the
          source, drop it in, ship it.
        </p>

        <div className="mt-20 flex flex-col">
          {registry.map((entry, i) => (
            <div key={entry.slug}>
              {i > 0 && <div className="h-px w-full bg-border" aria-hidden />}
              <Link
                href={`/components/${entry.slug}`}
                className="group flex flex-col gap-3 py-10 transition-opacity hover:opacity-70 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <div>
                  <p
                    className="text-[19px]"
                    style={{ color: categoryColors[entry.category] }}
                  >
                    {entry.category}
                  </p>
                  <h2 className="mt-2 text-[34px] font-semibold leading-[1.2] tracking-[-0.34px] sm:text-[44px] sm:tracking-[-0.44px]">
                    {entry.name}
                  </h2>
                </div>
                <p className="max-w-sm text-[19px] leading-[1.15] text-muted">
                  {entry.description}
                </p>
              </Link>
            </div>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
