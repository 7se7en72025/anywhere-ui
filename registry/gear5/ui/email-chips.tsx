"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface EmailChipsProps {
  value: string[];
  onChange: (emails: string[]) => void;
  label: string;
  className?: string;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function EmailChips({ value, onChange, label, className }: EmailChipsProps) {
  const id = useId();
  const [draft, setDraft] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addEmail = (raw: string) => {
    const email = raw.trim().toLowerCase();
    if (!email) return;

    if (!isValidEmail(email)) {
      setError(`"${email}" is not a valid email address`);
      return;
    }

    if (value.includes(email)) {
      setError("This email is already added");
      return;
    }

    onChange([...value, email]);
    setDraft("");
    setError(null);
  };

  const removeEmail = (email: string) => {
    onChange(value.filter((e) => e !== email));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addEmail(draft);
    } else if (e.key === "Backspace" && !draft && value.length > 0) {
      removeEmail(value[value.length - 1]);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-neutral-300 p-1.5 dark:border-neutral-700">
        {value.map((email) => (
          <span key={email} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {email}
            <button
              type="button"
              aria-label={`Remove ${email}`}
              onClick={() => removeEmail(email)}
              className="ms-0.5 rounded-full hover:bg-blue-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-blue-800/50"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          type="email"
          value={draft}
          onChange={(e) => {
            setDraft(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={() => { if (draft) addEmail(draft); }}
          placeholder={value.length === 0 ? "Add emails..." : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
          className="min-w-28 flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Press Enter or comma to add an email
      </p>
    </div>
  );
}
