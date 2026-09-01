"use client";

import { useId, useMemo, useState } from "react";
import { cn } from "../lib/cn";

export interface PasswordFieldProps {
  value: string;
  onChange: (value: string) => void;
  name: string;
  label: string;
  showLabel?: string;
  hideLabel?: string;
  className?: string;
}

function strength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return Math.min(score, 4);
}

const LEVEL_LABEL = ["Very weak", "Weak", "Fair", "Good", "Strong"];
const LEVEL_COLOR = ["bg-red-500", "bg-orange-500", "bg-amber-500", "bg-lime-500", "bg-green-600"];

/**
 * A password field with a visibility toggle (`aria-pressed`, not a
 * `title`-only icon) and a strength meter announced as text, never as colour
 * alone. `autoComplete="new-password"` matches the `draft-storage` exclusion
 * list, so this field's value is never persisted to disk even if it lives
 * inside a `ResilientForm`.
 */
export function PasswordField({ value, onChange, name, label, showLabel = "Show password", hideLabel = "Hide password", className }: PasswordFieldProps) {
  const [visible, setVisible] = useState(false);
  const id = useId();
  const meterId = useId();
  const level = useMemo(() => strength(value), [value]);

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete="new-password"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-describedby={value ? meterId : undefined}
          className="w-full rounded-md border border-neutral-300 bg-white px-3 py-2 pe-16 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />
        <button
          type="button"
          aria-pressed={visible}
          onClick={() => setVisible((v) => !v)}
          className="absolute end-2 top-1/2 -translate-y-1/2 rounded px-1.5 py-0.5 text-xs text-neutral-600 hover:text-neutral-900 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-neutral-400 dark:hover:text-neutral-100"
        >
          {visible ? hideLabel : showLabel}
        </button>
      </div>
      {value && (
        <div id={meterId} className="flex flex-col gap-1">
          <div className="flex gap-1">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} className={cn("h-1 flex-1 rounded-full", i < level ? LEVEL_COLOR[level] : "bg-neutral-200 dark:bg-neutral-800")} />
            ))}
          </div>
          <span className="text-xs text-neutral-600 dark:text-neutral-400">{LEVEL_LABEL[level]}</span>
        </div>
      )}
    </div>
  );
}
