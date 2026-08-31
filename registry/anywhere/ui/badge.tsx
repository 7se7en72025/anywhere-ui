import { cn } from "../lib/cn";

export type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";

const TONES: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200",
  success: "bg-green-100 text-green-900 dark:bg-green-950 dark:text-green-200",
  warning: "bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200",
  danger: "bg-red-100 text-red-900 dark:bg-red-950 dark:text-red-200",
  info: "bg-blue-100 text-blue-900 dark:bg-blue-950 dark:text-blue-200",
};

export interface BadgeProps {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}

/**
 * A small status label. Colour never carries the meaning alone — the text
 * content is the actual signal, so this reads fine to a screen reader and to
 * someone with colour-vision deficiency without any extra markup.
 */
export function Badge({ children, tone = "neutral", className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
