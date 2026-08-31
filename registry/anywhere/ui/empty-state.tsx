import { cn } from "../lib/cn";

export interface EmptyStateProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

/** A placeholder for a list, table, or panel with nothing in it yet. */
export function EmptyState({ title, description, action, icon, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-2 rounded-lg border border-dashed border-neutral-300 p-10 text-center dark:border-neutral-700",
        className,
      )}
    >
      {icon && (
        <div aria-hidden="true" className="mb-1 text-neutral-400 dark:text-neutral-600">
          {icon}
        </div>
      )}
      <p className="font-medium">{title}</p>
      {description && <p className="max-w-sm text-sm text-neutral-600 dark:text-neutral-400">{description}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
