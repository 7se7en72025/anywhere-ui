import { SiteNav, SiteFooter, Bracket, PillLink } from "@/components/site/chrome";
import { categoryColors } from "@/lib/registry";
import { ToolPermission } from "@/components/ui/tool-permission";
import { StreamingText } from "@/components/ui/streaming-text";
import { RunControls } from "@/components/ui/run-controls";
import { NightStars } from "@/components/ui/night-stars";

const tools = [
  {
    label: "Approvals" as const,
    heading: "Gate every tool call",
    body: "Show the arguments, then let a human approve or deny before the agent touches anything real.",
    slug: "tool-permission",
    preview: <ToolPermission tool="send_email" args={{ to: "team@acme.com" }} />,
  },
  {
    label: "Streaming" as const,
    heading: "Output as it arrives",
    body: "Render tokens the moment they land, with a cursor that tells the user the model is still thinking.",
    slug: "streaming-text",
    preview: <StreamingText text="Calling the search tool..." speedMs={45} />,
  },
  {
    label: "Controls" as const,
    heading: "Stop a run mid-flight",
    body: "Run, pause, and stop states with the status always visible, so nobody wonders what the agent is doing.",
    slug: "run-controls",
    preview: <RunControls />,
  },
  {
    label: "Ambient" as const,
    heading: "Backgrounds with motion",
    body: "A canvas night sky where a trail of stars follows the cursor. Decorative, and entirely self-contained.",
    slug: "night-stars",
    preview: <NightStars className="h-44!" dotCount={18} />,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans text-foreground">
      <SiteNav />

      <section className="mx-auto w-full max-w-[1280px] px-6 pb-24 pt-16">
        <h1
          className="font-semibold"
          style={{
            fontSize: "clamp(64px, 14vw, 224px)",
            lineHeight: 0.9,
            letterSpacing: "-0.02em",
          }}
        >
          Animate
          <br />
          the agent
        </h1>

        <div className="mt-12 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <p className="max-w-md text-[23px] leading-[1.38] tracking-[-0.23px]">
            Components for tool approvals, streaming output, and run control —
            the surfaces every agent product ends up building twice.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <PillLink href="/components" gradient>
              Get Gear5
            </PillLink>
            <PillLink href="/components">Explore All</PillLink>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1280px] px-6 pb-32">
        <Bracket>Gear5® Tools</Bracket>

        <div className="mt-16 flex flex-col">
          {tools.map((tool, i) => (
            <div key={tool.slug}>
              {i > 0 && <div className="h-px w-full bg-border" aria-hidden />}
              <div className="grid grid-cols-1 items-center gap-10 py-20 md:grid-cols-2">
                <div className="flex items-center justify-center">
                  {tool.preview}
                </div>
                <div>
                  <p
                    className="text-[19px]"
                    style={{ color: categoryColors[tool.label] }}
                  >
                    {tool.label}
                  </p>
                  <h2 className="mt-3 text-[34px] font-semibold leading-[1.2] tracking-[-0.34px] sm:text-[44px] sm:tracking-[-0.44px]">
                    {tool.heading}
                  </h2>
                  <p className="mt-4 max-w-md text-[23px] leading-[1.38] tracking-[-0.23px]">
                    {tool.body}
                  </p>
                  <div className="mt-8">
                    <PillLink href={`/components/${tool.slug}`}>
                      Explore {tool.label}
                    </PillLink>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
