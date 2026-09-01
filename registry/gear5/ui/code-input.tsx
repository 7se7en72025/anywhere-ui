"use client";

import { useId } from "react";
import { cn } from "../lib/cn";

export interface CodeInputProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  language?: string;
  placeholder?: string;
  className?: string;
}

const TOKEN_PATTERNS: [RegExp, string][] = [
  [/\b(const|let|var|function|return|if|else|for|while|class|import|export|from|default|new|this|async|await|try|catch|throw)\b/g, "keyword"],
  [/\b(true|false|null|undefined|NaN|Infinity)\b/g, "literal"],
  [/"[^"]*"|'[^']*'|`[^`]*`/g, "string"],
  [/\b\d+\.?\d*\b/g, "number"],
  [/\/\/.*$/gm, "comment"],
  [/\/\*[\s\S]*?\*\//g, "comment"],
];

function highlightCode(code: string): string {
  let result = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  for (const [pattern, className] of TOKEN_PATTERNS) {
    result = result.replace(pattern, `<span class="${className}">$&</span>`);
  }

  return result;
}

export function CodeInput({ value, onChange, label, language = "javascript", placeholder, className }: CodeInputProps) {
  const id = useId();
  const lines = value.split("\n");
  const lineCount = Math.max(lines.length, 8);

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
        {language && <span className="ms-2 text-xs text-neutral-500 dark:text-neutral-400">{language}</span>}
      </label>
      <div className="relative flex rounded-md border border-neutral-300 dark:border-neutral-700">
        <div className="flex flex-col items-end bg-neutral-100 px-2 py-2 text-xs text-neutral-500 select-none dark:bg-neutral-800 dark:text-neutral-400" aria-hidden="true">
          {Array.from({ length: lineCount }, (_, i) => (
            <span key={i} className="leading-5">{i + 1}</span>
          ))}
        </div>
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          aria-label={label}
          className="min-h-40 flex-1 resize-y bg-transparent p-2 font-mono text-sm leading-5 focus-visible:outline-none dark:bg-neutral-950"
          style={{ colorScheme: "dark" }}
        />
      </div>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">
        Enter your code below
      </p>
    </div>
  );
}
