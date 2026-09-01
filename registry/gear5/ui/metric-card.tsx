import { cn } from "../lib/cn";

export type MetricTrend = "up" | "down" | "neutral";

export interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  trend?: MetricTrend;
  icon?: React.ReactNode;
  className?: string;
}

const TREND_COLORS: Record<MetricTrend, string> = {
  up: "text-green-700 dark:text-green-400",
  down: "text-red-700 dark:text-red-400",
  neutral: "text-neutral-500 dark:text-neutral-400",
};

const TREND_ARIA: Record<MetricTrend, string> = {
  up: "trending up",
  down: "trending down",
  neutral: "no change",
};

const TREND_ICONS: Record<MetricTrend, string> = {
  up: "↑",
  down: "↓",
  neutral: "→",
};

/**
 * Metric card with trend indicator. Uses `aria-label` to convey value and
 * trend direction, not relying on colour alone.
 */
export function MetricCard({ label, value, change, trend = "neutral", icon, className }: MetricCardProps) {
  return (
    <div
      role="group"
      aria-label={`${label}: ${value}${change ? `, ${change}` : ""}, ${TREND_ARIA[trend]}`}
      className={cn(
        "flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 text-start dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm text-neutral-600 dark:text-neutral-400">{label}</span>
        {icon && <span aria-hidden="true" className="text-neutral-400">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
          {value}
        </span>
        {change && (
          <span className={cn("inline-flex items-center gap-0.5 text-sm font-medium", TREND_COLORS[trend])}>
            <span aria-hidden="true">{TREND_ICONS[trend]}</span>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
