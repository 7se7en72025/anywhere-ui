"use client";

import { useEffect } from "react";
import { cn } from "../lib/cn";
import { useStoredValue } from "../lib/use-stored-value";

export type Theme = "light" | "dark" | "system";

const STORAGE_KEY = "anywhere-ui:theme";

function apply(theme: Theme) {
  const root = document.documentElement;
  const dark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  root.classList.toggle("dark", dark);
  // Set here, not in CSS: a `color-scheme` declaration on both `:root` and
  // `.dark` gets rewritten by some CSS build tools into a `light-dark()`
  // function that follows the OS preference regardless of this class. An
  // inline style bypasses that rewrite and still gets native form controls,
  // scrollbars, and text-selection colours right for the active theme.
  root.style.colorScheme = dark ? "dark" : "light";
}

/**
 * A light/dark/system toggle. Its stored choice is read via
 * `useSyncExternalStore` (see `useStoredValue`), so the server and the
 * client's first render agree — this is why the library ships no inline
 * `<script>` snippet of its own for FOUC prevention; consumers who need
 * zero-flash dark mode add the one-line inline script Next.js's own docs
 * describe, reading the same `anywhere-ui:theme` key.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const [stored, setStored] = useStoredValue(STORAGE_KEY, "system");
  const theme = (stored as Theme | null) ?? "system";

  // Applying the theme to the document is a real side effect on an external
  // system (the DOM outside this component) — the case useEffect exists for,
  // distinct from mirroring a value into this component's own state.
  useEffect(() => apply(theme), [theme]);

  const options: Array<{ value: Theme; label: string }> = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "system", label: "System" },
  ];

  return (
    <div role="radiogroup" aria-label="Theme" className={cn("inline-flex rounded-md border border-neutral-300 p-0.5 dark:border-neutral-700", className)}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={theme === option.value}
          onClick={() => setStored(option.value)}
          className={cn(
            "rounded px-2.5 py-1 text-xs font-medium focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
            theme === option.value ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900" : "text-neutral-600 dark:text-neutral-400",
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
