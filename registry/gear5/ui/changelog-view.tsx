import { cn } from "../lib/cn";

export interface ChangelogEntry {
  version: string;
  date: string;
  changes: { type: "added" | "fixed" | "changed" | "removed"; description: string }[];
}

export interface ChangelogViewProps {
  entries: ChangelogEntry[];
  className?: string;
}

const TYPE_STYLES: Record<string, string> = {
  added: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  fixed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  changed: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  removed: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
};

/**
 * Changelog timeline with version tags. Each entry is an `<article>` with
 * an `<h3>` for the version. Change type badges use `aria-label` to convey
 * meaning beyond colour.
 */
export function ChangelogView({ entries, className }: ChangelogViewProps) {
  return (
    <div className={cn("flex flex-col gap-6", className)} role="feed" aria-label="Changelog">
      {entries.map((entry) => (
        <article key={entry.version} aria-label={`Version ${entry.version}`} className="relative ps-6">
          <span
            aria-hidden="true"
            className="absolute start-0 top-1 size-3 rounded-full bg-blue-600"
          />
          <div className="flex flex-col gap-2">
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                v{entry.version}
              </h3>
              <time className="text-sm text-neutral-500 dark:text-neutral-400">{entry.date}</time>
            </div>
            <ul className="flex flex-col gap-1">
              {entry.changes.map((change, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <span
                    aria-label={change.type}
                    className={cn(
                      "inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                      TYPE_STYLES[change.type] ?? TYPE_STYLES.changed,
                    )}
                  >
                    {change.type}
                  </span>
                  <span className="text-neutral-700 dark:text-neutral-300">{change.description}</span>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  );
}
