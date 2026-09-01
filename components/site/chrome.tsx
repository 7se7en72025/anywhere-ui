import Link from "next/link";
import { siteConfig } from "@/lib/site";
import { components } from "@/lib/registry";
import { ThemeToggle } from "@/registry/anywhere/ui/theme-toggle";
import { SiteCommandPalette } from "./site-command-palette";

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
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/80 backdrop-blur-xl">
      <nav
        aria-label="Main"
        className="mx-auto flex max-w-[1200px] items-center gap-8 px-6 py-4 text-body"
      >
        <Link href="/" className="tracking-[0.16em] text-cream uppercase">
          {siteConfig.name}
        </Link>

        <Link href="/components" className="text-cream underline-offset-4 hover:underline">
          Components
        </Link>

        <div className="ms-auto">
          <SiteCommandPalette
            items={components.map((item) => ({
              name: item.name,
              title: item.title,
              category: item.category ?? "Components",
            }))}
          />
        </div>

        <a
          href={siteConfig.repo}
          className="text-cream underline-offset-4 hover:underline"
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
        <ThemeToggle defaultTheme="dark" />
      </nav>
    </header>
  );
}

export function SiteFooter() {
  return (
    // Surfaces step by colour rather than by shadow, so the footer is the
    // elevated anvil tone above the canvas with a hairline to separate them.
    <footer className="mt-24 border-t border-hairline bg-anvil text-cream">
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
                      className="text-body-sm text-smoke underline-offset-4 transition-colors hover:text-cream hover:underline"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col gap-1 border-t border-hairline pt-8 text-body-sm text-smoke">
          <p>{siteConfig.name} — MIT licensed.</p>
          <p>This site ships no web fonts, no analytics, and no third-party requests.</p>
        </div>
      </div>
    </footer>
  );
}
