// @vitest-environment node
//
// Node, not jsdom: the point is to catch a component reaching for `window`,
// `document`, or `navigator` during the render pass that actually happens on
// a server, where none of those exist.
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { fixtures } from "./fixtures";

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
