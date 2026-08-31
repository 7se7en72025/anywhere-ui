export type Category = "Approvals" | "Streaming" | "Controls" | "Ambient";

export const categoryColors: Record<Category, string> = {
  Approvals: "#ff8709",
  Streaming: "#fec5fb",
  Controls: "#00bae2",
  Ambient: "#9d95ff",
};

export type RegistryEntry = {
  slug: string;
  name: string;
  description: string;
  category: Category;
};

export const registry: RegistryEntry[] = [
  {
    slug: "tool-permission",
    name: "ToolPermission",
    description: "Approve or deny a tool call before an agent runs it.",
    category: "Approvals",
  },
  {
    slug: "streaming-text",
    name: "StreamingText",
    description: "Renders text as it streams in, character by character.",
    category: "Streaming",
  },
  {
    slug: "run-controls",
    name: "RunControls",
    description: "Run, pause, and stop controls for an active agent run.",
    category: "Controls",
  },
  {
    slug: "badge",
    name: "Badge",
    description: "A small status label with semantic color variants.",
    category: "Approvals",
  },
  {
    slug: "night-stars",
    name: "NightStars",
    description: "A night-sky canvas where a trail of stars chases your cursor.",
    category: "Ambient",
  },
];
