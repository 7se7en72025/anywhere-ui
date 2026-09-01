import { cn } from "../lib/cn";

export interface ContainerProps {
  children: React.ReactNode;
  /** Max width in Tailwind's scale. */
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const SIZES = { sm: "max-w-2xl", md: "max-w-4xl", lg: "max-w-6xl", xl: "max-w-7xl" } as const;

/**
 * A centred, max-width content column. Horizontal padding uses `px-`, which
 * Tailwind already resolves to logical `padding-inline` — no separate RTL
 * handling needed for a symmetric container.
 */
export function Container({ children, size = "lg", className }: ContainerProps) {
  return <div className={cn("mx-auto w-full px-5", SIZES[size], className)}>{children}</div>;
}
