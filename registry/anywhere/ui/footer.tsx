import { cn } from "../lib/cn";

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterProps {
  links: FooterLink[];
  copyright: string;
  className?: string;
}

export function Footer({ links, copyright, className }: FooterProps) {
  return (
    <footer className={cn("border-t border-neutral-200 dark:border-neutral-800", className)}>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 py-6 text-sm text-neutral-600 sm:flex-row sm:justify-between dark:text-neutral-400">
        <p>{copyright}</p>
        <ul className="flex gap-4">
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className="hover:text-neutral-900 dark:hover:text-neutral-100">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
