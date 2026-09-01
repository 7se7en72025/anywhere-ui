import { cn } from "../lib/cn";

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar?: string;
  score: number;
}

export interface LeaderboardProps {
  entries: LeaderboardEntry[];
  title?: string;
  className?: string;
}

const POSITION_STYLES: Record<number, string> = {
  1: "bg-yellow-400 text-yellow-900",
  2: "bg-neutral-300 text-neutral-700 dark:bg-neutral-600 dark:text-neutral-200",
  3: "bg-orange-400 text-orange-900",
};

/**
 * Ranked leaderboard with avatars and scores. Each row uses `aria-label`
 * with the full rank, name, and score. The list is an `<ol>` for correct
 * semantics.
 */
export function Leaderboard({ entries, title = "Leaderboard", className }: LeaderboardProps) {
  const sorted = [...entries].sort((a, b) => b.score - a.score);

  return (
    <div
      role="region"
      aria-label={title}
      className={cn("flex flex-col gap-3", className)}
    >
      <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">{title}</h2>
      <ol className="flex flex-col gap-1" aria-label="Rankings">
        {sorted.map((entry, index) => {
          const position = index + 1;
          return (
            <li
              key={entry.id}
              aria-label={`Rank ${position}: ${entry.name}, ${entry.score} points`}
              className="flex items-center gap-3 rounded-lg border border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-950"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold",
                  POSITION_STYLES[position] ?? "bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400",
                )}
              >
                {position}
              </span>
              {entry.avatar ? (
                <img
                  src={entry.avatar}
                  alt=""
                  aria-hidden="true"
                  className="size-8 shrink-0 rounded-full"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="flex size-8 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-300"
                >
                  {entry.name.charAt(0).toUpperCase()}
                </span>
              )}
              <span className="flex-1 text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {entry.name}
              </span>
              <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                {entry.score.toLocaleString()}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
