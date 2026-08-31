import { cn } from "../lib/cn";

export interface SkeletonProps {
  className?: string;
  /** Fixed width/height so the real content's box is reserved exactly. */
  width?: string | number;
  height?: string | number;
}

/**
 * A placeholder shape for content that has not arrived yet. `aria-hidden`:
 * the shape itself carries no information, and the loading state should
 * already be announced once by whatever boundary is showing this (see
 * `AsyncBoundary`) — a screen reader does not need to hear "loading" once per
 * skeleton row.
 */
export function Skeleton({ className, width, height }: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      style={{ width, height }}
      className={cn(
        "animate-pulse rounded-md bg-neutral-200 motion-reduce:animate-none dark:bg-neutral-800",
        className,
      )}
    />
  );
}
