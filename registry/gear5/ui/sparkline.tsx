import { useMemo } from "react";
import { cn } from "../lib/cn";

export interface SparklineProps {
  data: number[];
  width?: number;
  height?: number;
  color?: string;
  strokeWidth?: number;
  label: string;
  className?: string;
}

/**
 * Inline mini SVG sparkline chart. The `aria-label` includes the data values
 * for screen readers. The SVG itself is `aria-hidden="true"` since the label
 * carries all the information.
 */
export function Sparkline({
  data,
  width = 120,
  height = 32,
  color = "rgb(37, 99, 235)",
  strokeWidth = 2,
  label,
  className,
}: SparklineProps) {
  const pathD = useMemo(() => {
    if (data.length < 2) return "";
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const padding = strokeWidth;

    return data
      .map((value, index) => {
        const x = padding + (index / (data.length - 1)) * (width - padding * 2);
        const y = padding + (1 - (value - min) / range) * (height - padding * 2);
        return `${index === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }, [data, width, height, strokeWidth]);

  const ariaLabel = `${label}: ${data.join(", ")}`;

  return (
    <svg
      role="img"
      aria-label={ariaLabel}
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={cn("inline-block", className)}
    >
      <title>{ariaLabel}</title>
      <path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
