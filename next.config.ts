import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import type { NextConfig } from "next";

const root = fileURLToPath(new URL(".", import.meta.url));

// Regenerate public/r/*.json here, at config-load time, rather than relying
// on `pnpm registry:build && next build` in package.json's own "build"
// script. next.config.ts is evaluated on every `next build` and `next dev`
// regardless of what command actually invoked them — a hosting platform
// with its own build-command override, a monorepo task runner, or a cached
// CI step can all skip a package.json script silently, and the result is a
// deployed site whose own install commands 404. This can't be skipped the
// same way.
if (!process.env.SKIP_REGISTRY_BUILD) {
  execFileSync(process.execPath, [`${root}scripts/build-registry.mjs`], {
    stdio: "inherit",
    cwd: root,
  });
}

if (!existsSync(`${root}public/r/index.json`)) {
  throw new Error("public/r/index.json is missing after running scripts/build-registry.mjs — the registry build did not produce output.");
}

const nextConfig: NextConfig = {
  // Pin the workspace root: a stray lockfile in a parent directory otherwise
  // makes Turbopack infer the wrong root and warn on every build.
  turbopack: {
    root,
  },
  outputFileTracingIncludes: {
    "/": ["./public/r/**"],
  },
};

export default nextConfig;
