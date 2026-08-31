// @vitest-environment node
//
// Node, not jsdom: jsdom replaces TextEncoder with an implementation whose
// output fails esbuild's `instanceof Uint8Array` check, and nothing here needs
// a DOM anyway.
import { readFileSync } from "node:fs";
import { gzipSync } from "node:zlib";
import { join } from "node:path";
import { build } from "esbuild";
import { beforeAll, describe, expect, it } from "vitest";
import manifest from "@/registry.json";

const root = process.cwd();

/**
 * Gzipped size of each item after bundling, minifying, and tree-shaking, with
 * React external — i.e. what a user actually adds to their production bundle by
 * installing this component, including the primitives it pulls in with it.
 *
 * These are budgets, not measurements. They exist to fail loudly when a change
 * makes something meaningfully heavier, so the cost is raised deliberately and
 * with a reason instead of drifting upward release by release.
 */
const BUDGETS: Record<string, number> = {
  cn: 200,
  "use-network": 550,
  locale: 550,
  "use-locale": 750,
  announce: 600,
  format: 550,
  "draft-storage": 800,
  "async-boundary": 2600,
  "connection-status": 1800,
  "adaptive-image": 1800,
  field: 800,
  "resilient-form": 3300,
};

/**
 * Every component at once, in a single bundle, so the primitives they share are
 * counted once — the real cost to a project that adopts the whole library.
 */
const LIBRARY_BUDGET = 8 * 1024;

const sizes = new Map<string, number>();
let librarySize = 0;

async function measure(entry: string): Promise<number> {
  const result = await build({
    entryPoints: [join(root, entry)],
    bundle: true,
    minify: true,
    format: "esm",
    target: "es2020",
    jsx: "automatic",
    // React is already in every consumer's bundle; counting it here would
    // measure React, not us.
    external: ["react", "react-dom", "react/jsx-runtime"],
    write: false,
    logLevel: "silent",
  });

  return gzipSync(result.outputFiles[0].contents).length;
}

async function measureLibrary(): Promise<number> {
  const entries = manifest.items
    .map((item) => `export * from "./${item.files[0].path}";`)
    .join("\n");

  const result = await build({
    stdin: { contents: entries, resolveDir: root, loader: "ts" },
    bundle: true,
    minify: true,
    format: "esm",
    target: "es2020",
    jsx: "automatic",
    external: ["react", "react-dom", "react/jsx-runtime"],
    write: false,
    logLevel: "silent",
  });

  return gzipSync(result.outputFiles[0].contents).length;
}

beforeAll(async () => {
  await Promise.all(
    manifest.items.map(async (item) => {
      sizes.set(item.name, await measure(item.files[0].path));
    }),
  );

  librarySize = await measureLibrary();

  const report = manifest.items
    .map((item) => `  ${item.name.padEnd(20)} ${String(sizes.get(item.name)).padStart(5)} B`)
    .join("\n");
  console.log(
    `\ngzipped, bundled, React external:\n${report}\n  ${"— entire library".padEnd(20)} ${String(librarySize).padStart(5)} B\n`,
  );
}, 60_000);

describe("size budgets", () => {
  it.each(manifest.items.map((item) => item.name))("%s stays within budget", (name) => {
    const budget = BUDGETS[name];
    expect(budget, `no budget declared for "${name}"`).toBeDefined();

    const size = sizes.get(name)!;
    expect(size, `${name} is ${size} B gzipped, over its ${budget} B budget`).toBeLessThanOrEqual(
      budget,
    );
  });

  it("keeps every component under 3.5 KB gzipped on its own", () => {
    for (const [name, size] of sizes) {
      expect(size, `${name} is ${size} B gzipped`).toBeLessThan(3.5 * 1024);
    }
  });

  it(`keeps the whole library under ${LIBRARY_BUDGET / 1024} KB gzipped`, () => {
    expect(
      librarySize,
      `the entire library is ${librarySize} B gzipped`,
    ).toBeLessThanOrEqual(LIBRARY_BUDGET);
  });
});

describe("dependencies", () => {
  it("ships zero runtime dependencies", () => {
    // The reason a size budget is possible at all: a single transitive
    // dependency can quietly cost more than everything here put together.
    for (const item of manifest.items) {
      expect(
        (item as { dependencies?: string[] }).dependencies ?? [],
        `${item.name} declares runtime dependencies`,
      ).toEqual([]);
    }
  });

  it("imports nothing but react across the whole registry", () => {
    const allowed = new Set(["react"]);

    for (const item of manifest.items) {
      for (const file of item.files) {
        const source = readFileSync(join(root, file.path), "utf8");
        const specifiers = [...source.matchAll(/from\s+"([^"]+)"/g)].map((m) => m[1]);

        for (const specifier of specifiers) {
          if (specifier.startsWith(".")) continue;
          expect(allowed.has(specifier), `${file.path} imports "${specifier}"`).toBe(true);
        }
      }
    }
  });
});
