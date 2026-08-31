import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { components } from "@/lib/registry";
import { ThemeToggle } from "@/registry/anywhere/ui/theme-toggle";

const FOOTER_COLUMNS = [
  {
    heading: "Library",
    links: [
      { label: "All components", href: "/components" },
      { label: "Machine-readable index", href: "/r/index.json" },
      { label: "Agent index (llms.txt)", href: "/llms.txt" },
    ],
  },
  {
    heading: "Project",
    links: [
      { label: "Source on GitHub", href: siteConfig.repo },
      { label: "Contributing", href: `${siteConfig.repo}/blob/main/CONTRIBUTING.md` },
      { label: "Security policy", href: `${siteConfig.repo}/blob/main/SECURITY.md` },
    ],
  },
  {
    heading: "Standards",
    links: [
      { label: "Code of conduct", href: `${siteConfig.repo}/blob/main/CODE_OF_CONDUCT.md` },
      { label: "MIT licence", href: `${siteConfig.repo}/blob/main/LICENSE` },
    ],
  },
];

export function SiteHeader() {
  return (
    // Backdrop blur with a hairline base border, per the reference. The border
    // is always present rather than scroll-revealed: doing that properly needs
    // a scroll listener on every page, and a listener that exists only to fade
    // a 1px line is not worth the main-thread work on the devices this library
    // is built for.
    <header className="sticky top-0 z-40 border-b border-mist bg-parchment/80 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1200px] items-center gap-8 px-6 py-4 text-body"
      >
        <Link href="/" className="tracking-tight text-ink">
          {siteConfig.name}
        </Link>

        <Link href="/components" className="text-ink underline-offset-4 hover:underline">
          Components
        </Link>

        <span className="ms-auto hidden text-body-sm text-stone lg:inline">
          {components.length} components · 0 dependencies
        </span>

        <a
          href={siteConfig.repo}
          className="ms-auto text-ink underline-offset-4 hover:underline lg:ms-0"
        >
          GitHub
        </a>

        {/*
          The library's own ThemeToggle, running the site it documents.

          Not only dogfooding: ThemeToggle's job is to own `.dark` on the
          document, so the /components page — which previews all 87 components,
          this one among them — would otherwise have its theme set by a preview
          while every other page ignored it. Mounting the real toggle in the
          chrome makes the whole site follow one coherent theme, and makes the
          preview on that page genuinely the control that drives it.
        */}
        <ThemeToggle />
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    // Full-bleed wine ground. Fixed light text rather than theme-aware: this
    // band is the same deep colour in both themes, so its foreground is a
    // property of the band, not of the page.
    <footer className="mt-24 bg-wine text-paper-white dark:text-ink">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 py-16">
        <div className="grid gap-10 sm:grid-cols-3">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.heading} className="flex flex-col gap-3">
              <h2 className="text-body-sm font-bold">{column.heading}</h2>

              <ul className="flex flex-col gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-body-sm opacity-70 underline-offset-4 transition-opacity hover:opacity-100 hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 border-t border-current/15 pt-8 text-body-sm opacity-70">
          <p>{siteConfig.name} — MIT licensed.</p>
          <p>This site ships no web fonts, no analytics, and no third-party requests.</p>
        </div>
      </div>
    </footer>
  );
}
