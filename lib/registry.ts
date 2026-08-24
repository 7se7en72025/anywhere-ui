export type RegistryEntry = {
  slug: string;
  name: string;
  description: string;
};

export const registry: RegistryEntry[] = [
  {
    slug: "tool-permission",
    name: "ToolPermission",
    description: "Approve or deny a tool call before an agent runs it.",
  },
  {
    slug: "streaming-text",
    name: "StreamingText",
    description: "Renders text as it streams in, character by character.",
  },
  {
    slug: "run-controls",
    name: "RunControls",
    description: "Run, pause, and stop controls for an active agent run.",
  },
  {
    slug: "badge",
    name: "Badge",
    description: "A small status label with semantic color variants.",
  },
];
