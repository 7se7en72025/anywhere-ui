import { componentsByCategory, components, primitives } from "@/lib/registry";
import { getSiteUrl, siteConfig } from "@/lib/site";

export const dynamic = "force-static";

/**
 * llms.txt — a plain-text index for coding agents.
 *
 * Agents are a real and growing share of who installs components, and they do
 * it by reading a page and guessing a URL. Handing them the exact install
 * command per component removes the guess.
 */
export function GET(): Response {
  const siteUrl = getSiteUrl();

  const sections = componentsByCategory()
    .map(({ category, items }) => {
      const lines = items.map(
        (item) =>
          `- ${item.title} (${item.name}): ${item.description}\n  install: npx shadcn@latest add ${siteUrl}/r/${item.name}.json\n  docs: ${siteUrl}/components/${item.name}`,
      );

      return `## ${category}\n\n${lines.join("\n")}`;
    })
    .join("\n\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.description}

${components.length} copy-paste React components and ${primitives.length} shared primitives.
Zero runtime dependencies. MIT licensed. Source: ${siteConfig.repo}

Components are installed with the shadcn CLI, which copies the source into the
consuming project. There is no npm package to depend on.

Every component is verified in CI on ten axes: performance (a gzipped size
budget per tier), accessibility (axe over the documented fixture),
internationalisation (direction, calendar, numbering system resolved from the
locale tag), privacy (no fetch, XHR, sendBeacon, or fingerprinting APIs),
security (no dangerouslySetInnerHTML, eval, or innerHTML assignment),
resilience, offline behaviour, SSR safety (rendered through react-dom/server),
sensory safety (animation guarded by prefers-reduced-motion), and supply chain
(react is the only permitted import).

Conventions that apply to every component:
- Every user-facing string is a prop with an English default.
- Layout uses CSS logical properties, so RTL is a data change, not a rewrite.
- Wrap the app in LocaleProvider (from ${siteUrl}/r/use-locale.json) to make
  direction, calendar, and number formatting follow the user's locale.

${sections}

## Primitives

${primitives
  .map(
    (item) =>
      `- ${item.title} (${item.name}): ${item.description}\n  install: npx shadcn@latest add ${siteUrl}/r/${item.name}.json`,
  )
  .join("\n")}

## Machine-readable index

${siteUrl}/r/index.json lists every item as JSON.
`;

  return new Response(body, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  });
}
