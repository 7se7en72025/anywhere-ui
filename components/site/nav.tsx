import Link from "next/link";

export function Nav() {
  return (
    <header className="w-full border-b border-border">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2 text-lg font-semibold tracking-tight">
          <span className="h-2 w-2 rounded-full bg-accent shadow-[0_0_12px] shadow-accent" />
          Gear5 UI
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/components" className="hover:text-foreground">
            Components
          </Link>
          <a
            href="https://github.com"
            className="hover:text-foreground"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
}
