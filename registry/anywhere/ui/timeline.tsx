import { cn } from "../lib/cn";

export interface TimelineEntry {
  title: string;
  description?: string;
  time?: React.ReactNode;
}

export interface TimelineProps {
  entries: TimelineEntry[];
  className?: string;
}

/**
 * A vertical sequence of events, marked up as an ordered list — a screen
 * reader announces "item 2 of 5" for free, information a stack of styled
 * `<div>`s never carries. The connecting line uses `start-` positioning, so
 * it stays on the correct side of the text under RTL without a separate rule.
 */
export function Timeline({ entries, className }: TimelineProps) {
  return (
    <ol className={cn("relative flex flex-col gap-6 ps-6", className)}>
      <span aria-hidden="true" className="absolute inset-y-0 start-[5px] w-px bg-neutral-200 dark:bg-neutral-800" />
      {entries.map((entry, index) => (
        <li key={index} className="relative">
          <span aria-hidden="true" className="absolute -start-6 top-1 size-2.5 rounded-full bg-blue-600" />
          <div className="flex flex-col gap-0.5">
            {entry.time && <span className="text-xs text-neutral-500 dark:text-neutral-400">{entry.time}</span>}
            <span className="text-sm font-medium">{entry.title}</span>
            {entry.description && <span className="text-sm text-neutral-600 dark:text-neutral-400">{entry.description}</span>}
          </div>
        </li>
      ))}
    </ol>
  );
}
