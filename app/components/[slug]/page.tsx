import { notFound } from "next/navigation";
import { Nav } from "@/components/site/nav";
import { registry } from "@/lib/registry";
import { Badge } from "@/components/ui/badge";
import { ToolPermission } from "@/components/ui/tool-permission";
import { StreamingText } from "@/components/ui/streaming-text";
import { RunControls } from "@/components/ui/run-controls";

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

  return (
    <div className="flex flex-1 flex-col">
      <Nav />
      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-16">
        <h1 className="font-mono text-2xl font-semibold tracking-tight">
          {entry.name}
        </h1>
        <p className="mt-2 text-muted">{entry.description}</p>

        <div className="mt-10 flex min-h-64 items-center justify-center rounded-xl border border-border bg-card p-10">
          {previews[slug]}
        </div>
      </main>
    </div>
  );
}
