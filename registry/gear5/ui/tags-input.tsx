"use client";

import { useId, useState } from "react";
import { cn } from "../lib/cn";

export interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label: string;
  placeholder?: string;
  className?: string;
}

export function TagsInput({ value, onChange, label, placeholder, className }: TagsInputProps) {
  const id = useId();
  const [draft, setDraft] = useState("");

  const add = (tag: string) => {
    const trimmed = tag.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  };

  const remove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-neutral-300 p-1.5 dark:border-neutral-700">
        {value.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-2.5 py-0.5 text-sm text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => remove(tag)}
              className="ms-0.5 rounded-full hover:bg-blue-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-blue-800/50"
            >
              ×
            </button>
          </span>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add(draft);
            } else if (e.key === "Backspace" && !draft && value.length > 0) {
              remove(value[value.length - 1]);
            }
          }}
          onBlur={() => { if (draft) add(draft); }}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="min-w-24 flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Press Enter or comma to add a tag
      </p>
    </div>
  );
}
