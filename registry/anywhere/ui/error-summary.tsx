"use client";

import { useEffect, useId, useRef } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface FormError {
  /** The `name` of the field this refers to. */
  field: string;
  message: string;
}

export interface ErrorSummaryProps {
  errors: FormError[];
  /** Heading text. `{count}` is replaced with the number of errors. */
  title?: string;
  /** Called with a field name when its entry is activated. */
  onNavigate?: (field: string) => void;
  className?: string;
}

/**
 * The focusable list of what went wrong, at the top of a form.
 *
 * This is the pattern WCAG 3.3.1 is really asking for, and the one keyboard
 * and screen reader users navigate by: on a failed submit, focus moves here,
 * the errors are read as a list, and each entry jumps to the field it names.
 * Colouring the offending inputs red satisfies nobody who cannot see them, and
 * scattering messages down a long form makes a user hunt.
 *
 * Extracted from `ResilientForm` so it can be used with any form library —
 * react-hook-form, a server action's returned state, or plain state.
 */
export function ErrorSummary({
  errors,
  title = "There are {count} problems with this form",
  onNavigate,
  className,
}: ErrorSummaryProps) {
  const id = useId();
  const { direction } = useLocale();
  const container = useRef<HTMLDivElement>(null);

  // A stable identity for "which errors are showing", so focus moves when the
  // error set genuinely changes rather than on every re-render.
  const signature = errors.map((error) => error.field).join("|");

  useEffect(() => {
    if (signature) container.current?.focus();
  }, [signature]);

  if (errors.length === 0) return null;

  return (
    <div
      ref={container}
      tabIndex={-1}
      role="alert"
      aria-labelledby={id}
      dir={direction}
      className={cn(
        "rounded-lg border border-red-300 bg-red-50 p-4 text-start outline-none",
        "focus-visible:ring-2 focus-visible:ring-red-600",
        "dark:border-red-900 dark:bg-red-950/50",
        className,
      )}
    >
      <h2 id={id} className="text-sm font-semibold text-red-900 dark:text-red-100">
        {title.replace("{count}", String(errors.length))}
      </h2>

      <ul className="mt-2 flex list-disc flex-col gap-1 ps-5 text-sm">
        {errors.map((error) => (
          <li key={error.field}>
            <a
              href={`#${error.field}`}
              onClick={(event) => {
                if (!onNavigate) return;
                event.preventDefault();
                onNavigate(error.field);
              }}
              className="text-red-900 underline underline-offset-2 dark:text-red-100"
            >
              {error.message}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
