import { cn } from "../lib/cn";

export interface CommandBarAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export interface CommandBarProps {
  actions: CommandBarAction[];
  className?: string;
}

/**
 * Bottom action bar optimised for mobile, holding 3-5 quick actions. Each
 * button has `aria-label` and the bar itself is labelled with
 * `role="toolbar"` and `aria-label="Quick actions"`.
 */
export function CommandBar({ actions, className }: CommandBarProps) {
  return (
    <div
      role="toolbar"
      aria-label="Quick actions"
      className={cn(
        "fixed inset-x-0 bottom-0 flex items-stretch border-t border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950",
        className,
      )}
    >
      {actions.map((action) => (
        <button
          key={action.id}
          type="button"
          aria-label={action.label}
          onClick={action.onClick}
          className="flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium text-neutral-600 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-neutral-400 dark:hover:bg-neutral-900"
        >
          <span aria-hidden="true" className="text-lg">
            {action.icon}
          </span>
          <span>{action.label}</span>
        </button>
      ))}
    </div>
  );
}
