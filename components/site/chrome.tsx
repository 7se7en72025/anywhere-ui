import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { components } from "@/lib/registry";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/85 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/85">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3 text-sm"
      >
        <Link href="/" className="font-semibold tracking-tight">
          {siteConfig.name}
        </Link>

        <Link
          href="/components"
          className="text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-400"
        >
          Components
        </Link>

        <span className="ms-auto hidden text-neutral-500 sm:inline dark:text-neutral-500">
          {components.length} components · 0 dependencies
        </span>

        <a
          href={siteConfig.repo}
          className="text-neutral-600 underline-offset-4 hover:underline dark:text-neutral-400"
        >
          GitHub
        </a>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-neutral-200 dark:border-neutral-800">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-10 text-sm text-neutral-600 dark:text-neutral-400">
        <p>
          {siteConfig.name} — MIT licensed.{" "}
          <a className="underline underline-offset-2" href={siteConfig.repo}>
            Source and contribution guide on GitHub
          </a>
          .
        </p>
        <p>This site ships no web fonts, no analytics, and no third-party requests.</p>
      </div>
    </footer>
  );
}
