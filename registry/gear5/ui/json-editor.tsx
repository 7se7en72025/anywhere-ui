"use client";

import { useId, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

export function JsonEditor({ value, onChange, label, className }: JsonEditorProps) {
  const id = useId();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [error, setError] = useState<string | null>(null);

  const lines = value.split("\n");
  const lineCount = lines.length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    onChange(val);

    if (val.trim()) {
      try {
        JSON.parse(val);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Invalid JSON");
      }
    } else {
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const textarea = textareaRef.current;
      if (!textarea) return;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newVal = value.substring(0, start) + "  " + value.substring(end);
      onChange(newVal);
      requestAnimationFrame(() => {
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      });
    }
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="relative flex rounded-md border border-neutral-300 dark:border-neutral-700">
        <div className="flex flex-col items-end bg-neutral-100 px-2 py-2 text-xs text-neutral-500 select-none dark:bg-neutral-800 dark:text-neutral-400" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i}>{i + 1}</span>
          ))}
        </div>
        <textarea
          ref={textareaRef}
          id={id}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-describedby={error ? `${id}-error` : undefined}
          aria-invalid={error ? true : undefined}
          spellCheck={false}
          className="min-h-48 flex-1 resize-y bg-transparent p-2 font-mono text-sm focus-visible:outline-none dark:bg-neutral-950"
        />
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="text-xs text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
