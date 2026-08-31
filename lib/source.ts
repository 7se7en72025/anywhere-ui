import "server-only";

import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { RegistryItem } from "./registry";

/**
 * A component's own source, read from disk at build time.
 *
 * Kept out of lib/registry.ts deliberately: that module is imported by client
 * components for its data, and pulling `node:fs` into their import graph makes
 * the bundler trace filesystem access into the browser bundle. `server-only`
 * turns any future client import of this file into a build error rather than a
 * confusing runtime one.
 */
export async function readSource(item: RegistryItem): Promise<string> {
  // The path is built from registry.json, not from a request, and every caller
  // runs at build time behind generateStaticParams. turbopackIgnore silences
  // the bundler's dynamic-read warning, which exists for user-controlled paths
  // reaching the filesystem at runtime — neither of which applies here.
  return readFile(join(/* turbopackIgnore: true */ process.cwd(), item.files[0].path), "utf8");
}
