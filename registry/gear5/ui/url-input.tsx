"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface UrlInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  description?: string;
  className?: string;
}

function detectProtocol(url: string): string | null {
  if (/^https?:\/\//i.test(url)) return null;
  if (/^ftp:\/\//i.test(url)) return null;
  if (/^www\./i.test(url)) return "https://";
  if (/\.[a-z]{2,}$/i.test(url)) return "https://";
  return null;
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export function UrlInput({ value, onChange, label, description, className }: UrlInputProps) {
  const id = useId();
  const descId = `${id}-desc`;
  const hintId = `${id}-hint`;
  const [touched, setTouched] = useState(false);

  const protocol = detectProtocol(value);
  const displayValue = protocol ? value.replace(protocol, "") : value;
  const fullUrl = protocol ? `${protocol}${value}` : value;
  const valid = !value || isValidUrl(fullUrl);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    if (protocol && raw.startsWith(protocol)) {
      onChange(raw);
    } else if (protocol) {
      onChange(`${protocol}${raw}`);
    } else {
      onChange(raw);
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      {description && (
        <p id={descId} className="text-sm text-neutral-600 dark:text-neutral-400">
          {description}
        </p>
      )}
      <div className="relative">
        {protocol && (
          <span className="absolute start-3 top-1/2 -translate-y-1/2 text-sm text-neutral-500 dark:text-neutral-400" aria-hidden="true">
            {protocol}
          </span>
        )}
        <input
          id={id}
          type="url"
          inputMode="url"
          autoComplete="url"
          value={displayValue}
          onChange={handleChange}
          onBlur={() => setTouched(true)}
          aria-describedby={cn(description && descId, hintId) || undefined}
          aria-invalid={touched && !valid ? true : undefined}
          placeholder="example.com"
          className={cn(
            "w-full rounded-md border bg-white px-3 py-2 text-base focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:bg-neutral-950",
            protocol ? "ps-20" : "",
            touched && !valid ? "border-red-500" : "border-neutral-300 dark:border-neutral-700",
          )}
        />
      </div>
      <p id={hintId} className={cn("text-xs", touched && !valid ? "text-red-600 dark:text-red-400" : "text-neutral-500 dark:text-neutral-400")}>
        {touched && !valid ? "Please enter a valid URL" : "Enter a website URL"}
      </p>
    </div>
  );
}
