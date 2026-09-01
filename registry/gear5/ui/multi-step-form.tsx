"use client";

import { useId, useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";

export interface Step {
  label: string;
  content: React.ReactNode;
}

export interface MultiStepFormProps {
  steps: Step[];
  onComplete: (data: Record<string, unknown>) => void;
  label: string;
  className?: string;
}

export function MultiStepForm({ steps, onComplete, label, className }: MultiStepFormProps) {
  const id = useId();
  const [current, setCurrent] = useState(0);
  const [data, setData] = useState<Record<string, unknown>>({});

  const setField = (key: string, value: unknown) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const next = () => {
    if (current < steps.length - 1) {
      setCurrent((c) => c + 1);
      announce(`Step ${current + 2} of ${steps.length}: ${steps[current + 1].label}`, "polite");
    } else {
      onComplete(data);
      announce("Form submitted", "polite");
    }
  };

  const prev = () => {
    if (current > 0) {
      setCurrent((c) => c - 1);
      announce(`Step ${current} of ${steps.length}: ${steps[current - 1].label}`, "polite");
    }
  };

  return (
    <div className={cn("flex flex-col gap-4 text-start", className)}>
      <span id={id} className="text-sm font-medium">{label}</span>

      {/* Progress */}
      <nav aria-labelledby={id}>
        <ol className="flex items-center gap-2">
          {steps.map((step, index) => {
            const status = index < current ? "complete" : index === current ? "current" : "upcoming";
            return (
              <li key={step.label} className="flex flex-1 items-center gap-2">
                <div className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      "flex size-6 shrink-0 items-center justify-center rounded-full text-xs font-medium",
                      status === "complete" && "bg-blue-600 text-white",
                      status === "current" && "border-2 border-blue-600 text-blue-600",
                      status === "upcoming" && "border-2 border-neutral-300 text-neutral-400 dark:border-neutral-700",
                    )}
                  >
                    {status === "complete" ? "✓" : index + 1}
                  </span>
                  <span className={cn("text-sm", status === "upcoming" ? "text-neutral-400 dark:text-neutral-600" : "")}>
                    {step.label}
                    <span className="sr-only"> (step {index + 1} of {steps.length}, {status})</span>
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <span aria-hidden="true" className={cn("h-px flex-1", status === "complete" ? "bg-blue-600" : "bg-neutral-200 dark:bg-neutral-800")} />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step content */}
      <div aria-current="step" className="min-h-32 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800">
        {steps[current].content}
      </div>

      {/* Navigation */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={prev}
          disabled={current === 0}
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm disabled:opacity-50 dark:border-neutral-700"
        >
          Previous
        </button>
        <button
          type="button"
          onClick={next}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
        >
          {current === steps.length - 1 ? "Submit" : "Next"}
        </button>
      </div>
    </div>
  );
}
