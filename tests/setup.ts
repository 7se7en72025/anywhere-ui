import { afterEach, expect, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "vitest-axe/matchers";
import "vitest-axe/extend-expect";

expect.extend(matchers);

// jsdom implements neither API. Both exist in every real browser this
// library targets — these are test-environment shims, not feature
// detection the components themselves should need.
if (typeof window !== "undefined" && !window.matchMedia) {
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
}

class MockIntersectionObserver implements IntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords = () => [];
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
}

afterEach(() => {
  // Suites that opt into the node environment (the size budgets) share this
  // setup file but have no DOM to tear down.
  if (typeof document === "undefined") return;

  cleanup();
  localStorage.clear();
});
