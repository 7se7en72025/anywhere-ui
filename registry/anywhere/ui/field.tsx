"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface FieldProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "id"> {
  /** Visible label. Never a placeholder — placeholders vanish as users type. */
  label: string;
  name: string;
  /** Help text shown under the label and linked via `aria-describedby`. */
  description?: string;
  /** Validation message. Presence of this switches the field to invalid. */
  error?: string;
  /** Render as a multi-line field. */
  multiline?: boolean;
  rows?: number;
  className?: string;
}

/**
 * A text field wired the way assistive technology expects.
 *
 * A `<label>` bound by `htmlFor`, description and error both reachable through
 * `aria-describedby`, `aria-invalid` toggled by the error, and the required
 * state exposed as `aria-required` rather than only visually as an asterisk.
 *
 * The error is rendered inside the field's own describedby chain, so a screen
 * reader reads "Email, edit text, invalid entry, Enter a valid email address"
 * on focus — instead of leaving the user to find the red text themselves.
 */
export function Field({
  label,
  name,
  description,
  error,
  multiline = false,
  rows = 4,
  required,
  className,
  ...props
}: FieldProps) {
  const id = useId();
  const descriptionId = `${id}-description`;
  const errorId = `${id}-error`;

  const describedBy =
    cn(description && descriptionId, error && errorId) || undefined;

  const controlClass = cn(
    "w-full rounded-md border bg-white px-3 py-2 text-start text-base text-neutral-900",
    // 16px minimum: anything smaller makes iOS Safari zoom the whole viewport
    // on focus, which strands users on a horizontally scrolled page.
    "dark:bg-neutral-950 dark:text-neutral-100",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
    error
      ? "border-red-500 dark:border-red-500"
      : "border-neutral-300 dark:border-neutral-700",
  );

  const shared = {
    id,
    name,
    required,
    "aria-required": required || undefined,
    "aria-invalid": error ? (true as const) : undefined,
    "aria-describedby": describedBy,
    className: controlClass,
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
        {label}
        {required && (
          <span className="ms-1 text-red-600 dark:text-red-400" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {description && (
        <p id={descriptionId} className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}

      {multiline ? (
        <textarea
          {...(props as unknown as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          {...shared}
          rows={rows}
        />
      ) : (
        <input {...props} {...shared} />
      )}

      {error && (
        <p id={errorId} className="text-sm text-red-700 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
