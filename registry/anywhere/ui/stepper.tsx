import { cn } from "../lib/cn";

export interface Step {
  label: string;
}

export interface StepperProps {
  steps: Step[];
  /** 0-indexed. */
  current: number;
  className?: string;
}

/**
 * A wizard's progress, read by a screen reader as an ordered list with each
 * step's status in its accessible name — "Step 2 of 4, Shipping, current
 * step" — rather than only conveyed by which circle happens to be filled in.
 */
export function Stepper({ steps, current, className }: StepperProps) {
  return (
    <ol className={cn("flex items-center gap-2", className)}>
      {steps.map((step, index) => {
        const status = index < current ? "complete" : index === current ? "current" : "upcoming";

        return (
          <li key={step.label} className="flex flex-1 items-center gap-2">
            <div className="flex items-center gap-2">
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                  status === "complete" && "bg-blue-600 text-on-accent",
                  status === "current" && "border-2 border-blue-600 text-blue-700 dark:text-blue-400",
                  status === "upcoming" && "border-2 border-neutral-300 text-neutral-400 dark:border-neutral-700",
                )}
              >
                {status === "complete" ? "✓" : index + 1}
              </span>
              <span
                className={cn(
                  "text-sm",
                  status === "upcoming" ? "text-neutral-400 dark:text-neutral-600" : "text-neutral-900 dark:text-neutral-100",
                )}
              >
                {step.label}
                <span className="sr-only">
                  {" "}
                  (step {index + 1} of {steps.length}, {status})
                </span>
              </span>
            </div>
            {index < steps.length - 1 && (
              <span aria-hidden="true" className={cn("h-px flex-1", status === "complete" ? "bg-blue-600" : "bg-neutral-200 dark:bg-neutral-800")} />
            )}
          </li>
        );
      })}
    </ol>
  );
}
