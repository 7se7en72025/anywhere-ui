import { cn } from "../lib/cn";

export interface StepIndicatorStep {
  id: string;
  label: string;
}

export interface StepIndicatorProps {
  steps: StepIndicatorStep[];
  currentId: string;
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/**
 * Progress indicator for multi-step flows. Each step communicates its status
 * via `aria-current="step"` and an accessible name that includes the step
 * number and state (complete, current, upcoming).
 */
export function StepIndicator({
  steps,
  currentId,
  orientation = "horizontal",
  className,
}: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentId);

  return (
    <nav aria-label="Progress" className={cn(orientation === "horizontal" ? "flex items-center" : "flex flex-col", className)}>
      <ol
        className={cn(
          "flex",
          orientation === "horizontal" ? "items-center gap-2" : "flex-col gap-4",
        )}
        role="list"
      >
        {steps.map((step, index) => {
          const isComplete = index < currentIndex;
          const isCurrent = step.id === currentId;
          const isUpcoming = index > currentIndex;

          return (
            <li key={step.id} className={cn("flex", orientation === "horizontal" ? "items-center gap-2" : "items-start gap-3")}>
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold",
                  isComplete && "bg-blue-600 text-white",
                  isCurrent && "border-2 border-blue-600 text-blue-700 dark:text-blue-400",
                  isUpcoming && "border-2 border-neutral-300 text-neutral-400 dark:border-neutral-700",
                )}
              >
                {isComplete ? "✓" : index + 1}
              </span>
              <span className="flex flex-col">
                <span
                  aria-current={isCurrent ? "step" : undefined}
                  className={cn(
                    "text-sm font-medium",
                    isUpcoming ? "text-neutral-400 dark:text-neutral-600" : "text-neutral-900 dark:text-neutral-100",
                  )}
                >
                  {step.label}
                </span>
                <span className="sr-only">
                  {isComplete ? "Complete" : isCurrent ? "Current step" : "Upcoming"}
                </span>
              </span>
              {orientation === "horizontal" && index < steps.length - 1 && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "h-px w-8",
                    isComplete ? "bg-blue-600" : "bg-neutral-200 dark:bg-neutral-800",
                  )}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
