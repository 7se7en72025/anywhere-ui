import { cn } from "../lib/cn";

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        "rounded-xl border border-neutral-200 bg-white p-5 text-start dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("mb-3 flex flex-col gap-1", className)}>{children}</div>;
}

export function CardTitle({ children, className }: { children: React.ReactNode; className?: string }) {
  return <h3 className={cn("text-base font-semibold", className)}>{children}</h3>;
}

export function CardDescription({ children, className }: { children: React.ReactNode; className?: string }) {
  return <p className={cn("text-sm text-neutral-600 dark:text-neutral-400", className)}>{children}</p>;
}
