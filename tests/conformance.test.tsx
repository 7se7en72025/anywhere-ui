import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "vitest-axe";
import manifest from "@/registry.json";
import { fixtures } from "./fixtures";

/**
 * Axis: accessibility.
 *
 * Every `registry:ui` item with a fixture is rendered and asserted against
 * axe-core. This is the accessibility floor every component in the library
 * clears automatically — it catches missing labels, bad contrast, invalid
 * ARIA, and the like. It does not catch focus management or live-region
 * timing; those are asserted per-component where the behaviour is
 * non-generic (see the component's own describe block, if any).
 */
const uiItems = manifest.items.filter((item) => item.type === "registry:ui");

describe("conformance: accessibility (axe)", () => {
  it("every registry:ui item has a fixture", () => {
    const missing = uiItems.map((item) => item.name).filter((name) => !fixtures[name]);
    expect(missing, `no fixture in tests/fixtures.tsx for: ${missing.join(", ")}`).toEqual([]);
  });

  it.each(Object.keys(fixtures))("%s has no axe violations", async (name) => {
    const { container } = render(fixtures[name]());
    expect(await axe(container)).toHaveNoViolations();
  });
});
