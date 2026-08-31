import { cn } from "../lib/cn";

export interface NavLink {
  label: string;
  href: string;
  current?: boolean;
}

export interface NavbarProps {
  brand: React.ReactNode;
  links: NavLink[];
  className?: string;
}

/**
 * `<nav aria-label="Main">` with the current page marked `aria-current`, so
 * both landmark navigation and "where am I" are answered without visual
 * cues — a plain row of styled links leaves both to guesswork.
 */
export function Navbar({ brand, links, className }: NavbarProps) {
  return (
    <header className={cn("border-b border-neutral-200 dark:border-neutral-800", className)}>
      <nav aria-label="Main" className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3">
        <div className="font-semibold">{brand}</div>
        <ul className="flex gap-5 text-sm">
          {links.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                aria-current={link.current ? "page" : undefined}
                className={cn(
                  link.current ? "font-medium text-neutral-900 dark:text-neutral-100" : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100",
                )}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
