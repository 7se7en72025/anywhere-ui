import { cn } from "../lib/cn";

export interface ActivityEntry {
  id: string;
  user: {
    name: string;
    avatar?: string;
  };
  action: string;
  target?: string;
  timestamp: string;
}

export interface ActivityFeedProps {
  entries: ActivityEntry[];
  className?: string;
}

/**
 * Recent actions list with avatars and timestamps. Uses `role="feed"` with
 * `aria-label`. Each entry is an `<article>` with `aria-labelledby` pointing
 * to the entry's heading.
 */
export function ActivityFeed({ entries, className }: ActivityFeedProps) {
  return (
    <div
      role="feed"
      aria-label="Recent activity"
      className={cn("flex flex-col gap-1", className)}
    >
      {entries.map((entry, index) => {
        const headingId = `activity-${entry.id}`;
        return (
          <article
            key={entry.id}
            aria-labelledby={headingId}
            aria-posinset={index + 1}
            aria-setsize={entries.length}
            className="flex items-start gap-3 rounded-md px-3 py-2 hover:bg-neutral-50 dark:hover:bg-neutral-900"
          >
            {entry.user.avatar ? (
              <img
                src={entry.user.avatar}
                alt=""
                aria-hidden="true"
                className="size-8 shrink-0 rounded-full"
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
              >
                {entry.user.name.charAt(0).toUpperCase()}
              </span>
            )}
            <div className="flex flex-1 flex-col gap-0.5">
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <span id={headingId} className="font-medium text-neutral-900 dark:text-neutral-100">
                  {entry.user.name}
                </span>{" "}
                {entry.action}
                {entry.target && (
                  <>
                    {" "}
                    <span className="font-medium text-neutral-900 dark:text-neutral-100">
                      {entry.target}
                    </span>
                  </>
                )}
              </p>
              <time className="text-xs text-neutral-400 dark:text-neutral-500">
                {entry.timestamp}
              </time>
            </div>
          </article>
        );
      })}
    </div>
  );
}
