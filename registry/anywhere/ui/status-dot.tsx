import { cn } from "../lib/cn";

export type StatusTone = "neutral" | "success" | "warning" | "danger" | "info";

const TONES: Record<StatusTone, string> = {
  neutral: "bg-neutral-400",
  success: "bg-green-500",
  warning: "bg-amber-500",
  danger: "bg-red-500",
  info: "bg-blue-500",
};

export interface StatusDotProps {
  tone?: StatusTone;
  /** Required: a dot with no label is a shape, not information. */
  label: string;
  pulse?: boolean;
  className?: string;
}

/**
 * A coloured status indicator with a label that is always present — visually
 * for sighted users who read colour, and via `sr-only` text for everyone
 * else, since colour alone never survives translation to a screen reader or a
 * black-and-white printout.
 */
export function StatusDot({ tone = "neutral", label, pulse = false, className }: StatusDotProps) {
  return (
    <span className={cn("inline-flex items-center gap-1.5", className)}>
      <span className="relative flex size-2">
        {pulse && (
          <span
            className={cn(
              "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 motion-reduce:animate-none",
              TONES[tone],
            )}
          />
        )}
        <span className={cn("relative inline-flex size-2 rounded-full", TONES[tone])} />
      </span>
      <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
    </span>
  );
}
