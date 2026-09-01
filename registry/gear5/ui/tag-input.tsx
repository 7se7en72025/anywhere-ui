"use client";

import { useId, useState } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";
import { Chip } from "./chip";

export interface TagInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  label: string;
  className?: string;
}

/**
 * A free-text tag list. Adding and removing both announce the change —
 * "Added: urgent. 3 tags." — since the visual list changing shape is the only
 * feedback a sighted user needs but a screen reader user gets nothing from at
 * all without it.
 */
export function TagInput({ value, onChange, label, className }: TagInputProps) {
  const [draft, setDraft] = useState("");
  const id = useId();

  const add = () => {
    const tag = draft.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
    announce(`Added: ${tag}. ${value.length + 1} tags.`, "polite");
    setDraft("");
  };

  const remove = (tag: string) => {
    onChange(value.filter((t) => t !== tag));
    announce(`Removed: ${tag}. ${value.length - 1} tags.`, "polite");
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-neutral-300 p-1.5 dark:border-neutral-700">
        {value.map((tag) => (
          <Chip key={tag} onRemove={() => remove(tag)}>
            {tag}
          </Chip>
        ))}
        <input
          id={id}
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              add();
            } else if (event.key === "Backspace" && !draft && value.length > 0) {
              remove(value[value.length - 1]);
            }
          }}
          className="min-w-24 flex-1 border-0 bg-transparent px-1 py-1 text-sm outline-none"
        />
      </div>
    </div>
  );
}
