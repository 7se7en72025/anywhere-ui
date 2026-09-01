/**
 * Compile registry.json into the flat `public/r/<name>.json` files that
 * `npx shadcn add <url>` consumes.
 *
 * Source files import each other by relative path so that the repo typechecks
 * and tests run against real modules. Consumers get them at different paths, so
 * those imports are rewritten to `@/` aliases on the way out.
 */

import { mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "public", "r");

/**
 * Mirrors lib/site.ts's getSiteUrl(). Duplicated rather than imported: this
 * script runs as plain Node before Next's compiler exists to resolve a `.ts`
 * import, and the alternative — deploying a registry whose own install
 * commands point at a domain nobody is serving — is worse than one small
 * function kept in sync by hand.
 */
function resolveSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
  if (vercel) return `https://${vercel}`;

  return "http://localhost:3000";
}

const HOMEPAGE = resolveSiteUrl();

/** Where each registry type lands in a consumer's project. */
const TARGETS = {
  "registry:ui": "components/gear5",
  "registry:lib": "lib/gear5",
  "registry:hook": "hooks/gear5",
};

/**
 * Map a source module path to the alias a consumer will import it by.
 * `registry/gear5/lib/cn.ts` -> `@/lib/gear5/cn`
 */
function aliasFor(sourcePath, typeByBasename) {
  const basename = sourcePath.split("/").pop().replace(/\.tsx?$/, "");
  const type = typeByBasename.get(basename) ?? "registry:lib";
  return `@/${TARGETS[type]}/${basename}`;
}

function rewriteImports(content, typeByBasename) {
  // Only relative specifiers pointing inside registry/gear5 are rewritten;
  // anything else (react, next, …) is left exactly as the author wrote it.
  return content.replace(
    /from\s+"(\.\.?\/[^"]+)"/g,
    (match, specifier) => `from "${aliasFor(specifier, typeByBasename)}"`,
  );
}

async function main() {
  const manifest = JSON.parse(await readFile(join(root, "registry.json"), "utf8"));

  // Basename -> registry type, so an import can be routed to the right target
  // directory without resolving the filesystem.
  const typeByBasename = new Map();
  for (const item of manifest.items) {
    for (const file of item.files) {
      const basename = file.path.split("/").pop().replace(/\.tsx?$/, "");
      typeByBasename.set(basename, file.type);
    }
  }

  await rm(outDir, { recursive: true, force: true });
  await mkdir(outDir, { recursive: true });

  const index = [];

  for (const item of manifest.items) {
    const files = [];

    for (const file of item.files) {
      const raw = await readFile(join(root, file.path), "utf8");
      const basename = file.path.split("/").pop();

      files.push({
        path: `${TARGETS[file.type]}/${basename}`,
        content: rewriteImports(raw, typeByBasename),
        type: file.type,
        target: `${TARGETS[file.type]}/${basename}`,
      });
    }

    const built = {
      $schema: "https://ui.shadcn.com/schema/registry-item.json",
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      dependencies: item.dependencies ?? [],
      registryDependencies: (item.registryDependencies ?? []).map(
        (dependency) => `${HOMEPAGE}/r/${dependency}.json`,
      ),
      files,
    };

    await writeFile(join(outDir, `${item.name}.json`), JSON.stringify(built, null, 2));

    index.push({
      name: item.name,
      type: item.type,
      title: item.title,
      description: item.description,
      url: `${HOMEPAGE}/r/${item.name}.json`,
    });
  }

  await writeFile(
    join(outDir, "index.json"),
    JSON.stringify({ name: manifest.name, homepage: HOMEPAGE, items: index }, null, 2),
  );

  const written = await readdir(outDir);
  console.log(`registry: wrote ${written.length} files to public/r`);
}

await main();
