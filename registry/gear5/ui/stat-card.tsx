import { cn } from "../lib/cn";

export interface StatCardProps {
  label: string;
  value: string;
  /** e.g. "+12% vs last week" — plain text, since colour alone cannot carry direction. */
  change?: string;
  changeTone?: "positive" | "negative" | "neutral";
  className?: string;
}

const TONES = {
  positive: "text-green-700 dark:text-green-400",
  negative: "text-red-700 dark:text-red-400",
  neutral: "text-neutral-500 dark:text-neutral-400",
} as const;

/** A single KPI figure with an optional trend line. */
export function StatCard({ label, value, change, changeTone = "neutral", className }: StatCardProps) {
  return (
    <div className={cn("flex flex-col gap-1 rounded-xl border border-neutral-200 p-4 text-start dark:border-neutral-800", className)}>
      <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
      <span className="text-2xl font-semibold tracking-tight">{value}</span>
      {change && <span className={cn("text-sm", TONES[changeTone])}>{change}</span>}
    </div>
  );
}
