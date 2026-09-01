// @vitest-environment node
//
// Node, not jsdom: the point is to catch a component reaching for `window`,
// `document`, or `navigator` during the render pass that actually happens on
// a server, where none of those exist.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { fixtures } from "@/components/demos";

/**
 * Axis: SSR safety.
 *
 * Every component must render on the server without throwing. This is what
 * `useNetwork`'s good-connection snapshot and `useLocale`'s `en-US` fallback
 * exist for — a component that reaches for a browser global during the
 * server render pass takes the whole page down with it, not just itself.
 */
describe("conformance: SSR safety", () => {
  it.each(Object.keys(fixtures))("%s renders to static markup without throwing", (name) => {
    expect(() => renderToStaticMarkup(fixtures[name]())).not.toThrow();
  });
});

/**
 * Components that render `Intl` output must host it on an element carrying
 * `suppressHydrationWarning`.
 *
 * Node's ICU and the browser's are not byte-identical: the same
 * `formatRange` call produces thin spaces (U+2009) around the dash on Node and
 * ordinary spaces (U+0020) in Chrome. Visually identical, different bytes — so
 * without this, every server-rendered use throws a hydration error in a
 * consumer's app through no fault of theirs.
 */
describe("Intl output is hydration-safe", () => {
  const INTL_COMPONENTS = [
    "date-range-text",
    "currency-text",
    "unit-text",
    "bytes-text",
    "compact-number",
    "read-time",
    "list-text",
    "ordinal-text",
    "plural-text",
    "relative-time",
  ];

  it.each(INTL_COMPONENTS)("%s suppresses hydration warnings on its text", (name) => {
    const source = readFileSync(
      join(process.cwd(), "registry/gear5/ui", `${name}.tsx`),
      "utf8",
    );

    expect(
      source.includes("suppressHydrationWarning"),
      `${name} renders Intl output but does not mark it hydration-safe`,
    ).toBe(true);
  });
});
