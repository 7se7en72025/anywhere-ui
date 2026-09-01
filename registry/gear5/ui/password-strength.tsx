"use client";

import { useId, useMemo } from "react";
import { cn } from "../lib/cn";

export interface PasswordStrengthProps {
  value: string;
  label: string;
  className?: string;
}

const LEVELS = [
  { label: "Weak", color: "bg-red-500" },
  { label: "Fair", color: "bg-orange-500" },
  { label: "Strong", color: "bg-lime-500" },
  { label: "Very strong", color: "bg-green-600" },
];

function getStrengthLevel(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 16) score++;
  return Math.min(Math.floor(score / 1.5), 3);
}

export function PasswordStrength({ value, label, className }: PasswordStrengthProps) {
  const id = useId();
  const level = useMemo(() => (value ? getStrengthLevel(value) : -1), [value]);

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <span id={id} className="text-sm font-medium">
        {label}
      </span>
      <div className="flex gap-1" role="meter" aria-labelledby={id} aria-valuemin={0} aria-valuemax={3} aria-valuenow={level >= 0 ? level : undefined}>
        {LEVELS.map((l, i) => (
          <span
            key={i}
            aria-hidden="true"
            className={cn("h-2 flex-1 rounded-full transition-colors motion-reduce:transition-none", level >= 0 && i <= level ? l.color : "bg-neutral-200 dark:bg-neutral-800")}
          />
        ))}
      </div>
      <div aria-live="polite" className="text-xs text-neutral-600 dark:text-neutral-400">
        {level >= 0 && <span>Strength: {LEVELS[level].label}</span>}
      </div>
    </div>
  );
}
