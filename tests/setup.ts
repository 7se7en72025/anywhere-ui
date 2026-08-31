import { afterEach, expect } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";

expect.extend(matchers);

afterEach(() => {
  // Suites that opt into the node environment (the size budgets) share this
  // setup file but have no DOM to tear down.
  if (typeof document === "undefined") return;

  cleanup();
  localStorage.clear();
});
