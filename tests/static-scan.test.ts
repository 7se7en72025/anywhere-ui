// @vitest-environment node
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import manifest from "@/registry.json";
import { sanitizeHref } from "@/registry/anywhere/lib/sanitize";

const root = process.cwd();

const items = manifest.items as Array<{ name: string; files: Array<{ path: string }> }>;

function sources(): Array<{ name: string; path: string; source: string }> {
  return items.flatMap((item) =>
    item.files.map((file) => ({
      name: item.name,
      path: file.path,
      source: readFileSync(join(root, file.path), "utf8"),
    })),
  );
}

describe("axis: privacy", () => {
  // A copy-paste UI library has no business making network requests on its
  // own — every byte a component sends anywhere is a byte the person who
  // installed it did not put there. `fetch`/XHR calls belong in the
  // consumer's own data layer, never inside a component's own source.
  const FORBIDDEN = [
    /\bfetch\s*\(/,
    /new\s+XMLHttpRequest/,
    /navigator\.sendBeacon/,
    /\bWebSocket\s*\(/,
    // Fingerprinting-adjacent surfaces: none of these are needed to render UI,
    // and every one of them exists to identify a device or its owner.
    /navigator\.hardwareConcurrency/,
    /navigator\.deviceMemory/,
    /getBattery\s*\(/,
    /navigator\.geolocation/,
  ];

  it.each(sources().map(({ name, path, source }) => [name, path, source] as const))(
    "%s (%s) makes no network calls and touches no fingerprinting APIs",
    (_name, path, source) => {
      for (const pattern of FORBIDDEN) {
        expect(pattern.test(source), `${path} matches ${pattern}`).toBe(false);
      }
    },
  );
});

describe("axis: security", () => {
  // These are the sinks: give any of them a string built from data the
  // component did not fully control, and the "component" becomes a
  // vulnerability. A copy-paste library cannot rely on a bundler or a linter
  // downstream to catch this — the check has to live here.
  const FORBIDDEN = [
    /dangerouslySetInnerHTML/,
    /\beval\s*\(/,
    /new\s+Function\s*\(/,
    /\.innerHTML\s*=/,
    /document\.write\s*\(/,
  ];

  it.each(sources().map(({ name, path, source }) => [name, path, source] as const))(
    "%s (%s) has no injection sinks",
    (_name, path, source) => {
      for (const pattern of FORBIDDEN) {
        expect(pattern.test(source), `${path} matches ${pattern}`).toBe(false);
      }
    },
  );

  it("sanitizeHref neutralises executable schemes", () => {
    expect(sanitizeHref("javascript:alert(1)")).toBe("#");
    expect(sanitizeHref("  javascript:alert(1)  ")).toBe("#");
    expect(sanitizeHref("JaVaScRiPt:alert(1)")).toBe("#");
    expect(sanitizeHref("data:text/html,<script>alert(1)</script>")).toBe("#");
    expect(sanitizeHref("vbscript:msgbox(1)")).toBe("#");
  });

  it("sanitizeHref passes safe schemes and relative paths through unchanged", () => {
    expect(sanitizeHref("https://example.com")).toBe("https://example.com");
    expect(sanitizeHref("mailto:hi@example.com")).toBe("mailto:hi@example.com");
    expect(sanitizeHref("tel:+15555550100")).toBe("tel:+15555550100");
    expect(sanitizeHref("/docs/intro")).toBe("/docs/intro");
    expect(sanitizeHref("#section")).toBe("#section");
  });

  it("sanitizeHref treats an empty or blank string as unsafe", () => {
    expect(sanitizeHref("")).toBe("#");
    expect(sanitizeHref("   ")).toBe("#");
  });
});

describe("axis: sensory safety", () => {
  // A component that animates must say, in its own source, how it behaves
  // when the user has asked for less motion — either a Tailwind
  // `motion-reduce:` variant or a `prefers-reduced-motion` media query. This
  // does not prove correctness, but it makes "we forgot" structurally visible
  // in a diff instead of only visible to someone testing with the OS setting
  // flipped.
  const ANIMATES = /\b(animate-|transition-|@keyframes|animation:)/;
  const RESPECTS_MOTION = /(motion-reduce:|prefers-reduced-motion)/;

  it.each(sources().map(({ name, path, source }) => [name, path, source] as const))(
    "%s (%s) guards any animation with a reduced-motion fallback",
    (_name, path, source) => {
      if (!ANIMATES.test(source)) return;
      expect(RESPECTS_MOTION.test(source), `${path} animates without a motion-reduce guard`).toBe(
        true,
      );
    },
  );
});
