import Link from "next/link";

export function Bracket({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[16px] leading-[1.15] text-foreground">
      {"{ "}
      {children}
      {" }"}
    </p>
  );
}

export function PillLink({
  href,
  children,
  gradient = false,
}: {
  href: string;
  children: React.ReactNode;
  gradient?: boolean;
}) {
  if (gradient) {
    return (
      <Link
        href={href}
        className="inline-block rounded-full p-[1.5px] transition-opacity hover:opacity-80"
        style={{
          background: "linear-gradient(114.41deg, #0ae448 20.74%, #abff84 65.5%)",
        }}
      >
        <span className="block rounded-full bg-background px-6 py-[15px] text-[18px] font-semibold leading-[1.05] text-foreground">
          {children}
        </span>
      </Link>
    );
  }
  return (
    <Link
      href={href}
      className="inline-block rounded-full border border-foreground px-6 py-[15px] text-[18px] font-semibold leading-[1.05] text-foreground transition-opacity hover:opacity-80"
    >
      {children}
    </Link>
  );
}

export function SiteNav() {
  return (
    <>
      <div className="w-full py-2 text-center text-[14px] leading-[1.4] text-muted">
        Gear5 UI is free and open source.{" "}
        <a href="https://github.com" className="text-accent">
          Star it on GitHub
        </a>
      </div>
      <header className="mx-auto flex w-full max-w-[1280px] items-center justify-between px-6 py-4">
        <Link href="/" className="text-[19px] font-semibold text-accent">
          Gear5
        </Link>
        <nav className="flex items-center gap-4 text-[16px] text-muted">
          <Link href="/components" className="hover:text-foreground">
            Components
          </Link>
          <a href="https://github.com" className="hover:text-foreground">
            GitHub
          </a>
        </nav>
      </header>
    </>
  );
}

export function SiteFooter() {
  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 px-6 py-20 sm:flex-row sm:items-center sm:justify-between">
        <Bracket>Built for agent interfaces</Bracket>
        <nav className="flex gap-6 text-[16px] text-muted">
          <Link href="/components" className="hover:text-foreground">
            Components
          </Link>
          <a href="https://github.com" className="hover:text-foreground">
            GitHub
          </a>
        </nav>
      </div>
    </footer>
  );
}
