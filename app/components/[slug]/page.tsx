import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteNav, SiteFooter, PillLink } from "@/components/site/chrome";
import { registry, categoryColors } from "@/lib/registry";
import { Badge } from "@/components/ui/badge";
import { ToolPermission } from "@/components/ui/tool-permission";
import { StreamingText } from "@/components/ui/streaming-text";
import { RunControls } from "@/components/ui/run-controls";
import { NightStars } from "@/components/ui/night-stars";

const previews: Record<string, React.ReactNode> = {
  badge: (
    <div className="flex flex-wrap gap-2">
      <Badge>default</Badge>
      <Badge variant="accent">accent</Badge>
      <Badge variant="success">success</Badge>
      <Badge variant="warning">warning</Badge>
      <Badge variant="danger">danger</Badge>
    </div>
  ),
  "tool-permission": (
    <ToolPermission
      tool="read_file"
      args={{ path: "/etc/config.yaml", mode: "read-only" }}
    />
  ),
  "streaming-text": (
    <StreamingText text="Analyzing the request, then calling the search tool to find recent results..." />
  ),
  "run-controls": <RunControls />,
  "night-stars": <NightStars />,
};

export function generateStaticParams() {
  return registry.map((entry) => ({ slug: entry.slug }));
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = registry.find((item) => item.slug === slug);
  if (!entry) notFound();

  const index = registry.findIndex((item) => item.slug === slug);
  const next = registry[(index + 1) % registry.length];

  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <SiteNav />

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-6 pb-32 pt-16">
        <Link href="/components" className="text-[16px] text-muted hover:text-foreground">
          ← All components
        </Link>

        <p
          className="mt-10 text-[19px]"
          style={{ color: categoryColors[entry.category] }}
        >
          {entry.category}
        </p>
        <h1
          className="mt-3 font-semibold"
          style={{
            fontSize: "clamp(48px, 9vw, 101px)",
            lineHeight: 1,
            letterSpacing: "-0.011em",
          }}
        >
          {entry.name}
        </h1>
        <p className="mt-6 max-w-md text-[23px] leading-[1.38] tracking-[-0.23px]">
          {entry.description}
        </p>

        <div className="mt-16 h-px w-full bg-border" aria-hidden />

        <div className="flex min-h-80 items-center justify-center py-20">
          {previews[slug]}
        </div>

        <div className="h-px w-full bg-border" aria-hidden />

        <div className="flex flex-col gap-6 pt-20 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[16px] text-muted">Next</p>
            <p className="mt-2 text-[34px] font-semibold leading-[1.2] tracking-[-0.34px]">
              {next.name}
            </p>
          </div>
          <PillLink href={`/components/${next.slug}`}>
            Explore {next.name}
          </PillLink>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
