"use client";

import { useId, useEffect, useRef, useState } from "react";
import { cn } from "../lib/cn";

export interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  label: string;
  className?: string;
}

const TOOLBAR_BUTTONS = [
  { label: "Bold", prefix: "**", suffix: "**", icon: "B" },
  { label: "Italic", prefix: "_", suffix: "_", icon: "I" },
  { label: "Code", prefix: "`", suffix: "`", icon: "</>" },
  { label: "Link", prefix: "[", suffix: "](url)", icon: "🔗" },
] as const;

function PreviewContent({ value }: { value: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderMarkdown = () => {
    const container = containerRef.current;
    if (!container) return;

    while (container.firstChild) container.removeChild(container.firstChild);

    const lines = value.split("\n");
    for (let i = 0; i < lines.length; i++) {
      if (i > 0) container.appendChild(document.createElement("br"));

      const line = lines[i];
      const frag = document.createDocumentFragment();
      let pos = 0;

      while (pos < line.length) {
        let earliest = line.length;
        let matchType = "";
        let matchLen = 0;

        const boldIdx = line.indexOf("**", pos);
        if (boldIdx !== -1 && boldIdx < earliest) {
          const closeIdx = line.indexOf("**", boldIdx + 2);
          if (closeIdx !== -1) {
            earliest = boldIdx;
            matchType = "bold";
            matchLen = closeIdx + 2 - boldIdx;
          }
        }

        const codeIdx = line.indexOf("`", pos);
        if (codeIdx !== -1 && codeIdx < earliest) {
          const closeIdx = line.indexOf("`", codeIdx + 1);
          if (closeIdx !== -1) {
            earliest = codeIdx;
            matchType = "code";
            matchLen = closeIdx + 1 - codeIdx;
          }
        }

        const italicIdx = line.indexOf("_", pos);
        if (italicIdx !== -1 && italicIdx < earliest) {
          const closeIdx = line.indexOf("_", italicIdx + 1);
          if (closeIdx !== -1 && closeIdx > italicIdx + 1) {
            earliest = italicIdx;
            matchType = "italic";
            matchLen = closeIdx + 1 - italicIdx;
          }
        }

        if (earliest === line.length) {
          if (pos < line.length) frag.appendChild(document.createTextNode(line.substring(pos)));
          break;
        }

        if (earliest > pos) frag.appendChild(document.createTextNode(line.substring(pos, earliest)));

        const prefixLen = matchType === "bold" ? 2 : 1;
        const suffixLen = matchType === "bold" ? 2 : 1;
        const inner = line.substring(earliest + prefixLen, earliest + matchLen - suffixLen);

        let el: HTMLElement;
        if (matchType === "bold") el = document.createElement("strong");
        else if (matchType === "italic") el = document.createElement("em");
        else el = document.createElement("code");

        el.appendChild(document.createTextNode(inner));
        frag.appendChild(el);

        pos = earliest + matchLen;
      }

      container.appendChild(frag);
    }
  };

  useEffect(() => {
    renderMarkdown();
  });

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Markdown preview"
      className="min-h-48 rounded-b-md border border-t-0 border-neutral-300 bg-white p-3 text-sm dark:border-neutral-700 dark:bg-neutral-950"
    />
  );
}

export function MarkdownEditor({ value, onChange, label, className }: MarkdownEditorProps) {
  const id = useId();
  const [showPreview, setShowPreview] = useState(false);

  const wrap = (prefix: string, suffix: string) => {
    const textarea = document.getElementById(id) as HTMLTextAreaElement | null;
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = value.substring(start, end) || "text";
    const newVal = value.substring(0, start) + prefix + selected + suffix + value.substring(end);
    onChange(newVal);
  };

  return (
    <div className={cn("flex flex-col gap-1.5 text-start", className)}>
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>

      {/* Toolbar */}
      <div className="flex gap-1 rounded-t-md border border-neutral-300 bg-neutral-50 px-2 py-1 dark:border-neutral-700 dark:bg-neutral-900">
        {TOOLBAR_BUTTONS.map((btn) => (
          <button
            key={btn.label}
            type="button"
            aria-label={btn.label}
            onClick={() => wrap(btn.prefix, btn.suffix)}
            className="rounded px-2 py-0.5 text-sm hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-700"
          >
            {btn.icon}
          </button>
        ))}
        <span aria-hidden="true" className="mx-1 w-px bg-neutral-300 dark:bg-neutral-700" />
        <button
          type="button"
          aria-pressed={showPreview}
          onClick={() => setShowPreview(!showPreview)}
          className="rounded px-2 py-0.5 text-sm hover:bg-neutral-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:hover:bg-neutral-700"
        >
          {showPreview ? "Edit" : "Preview"}
        </button>
      </div>

      {showPreview ? (
        <PreviewContent value={value} />
      ) : (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-48 resize-y rounded-b-md border border-t-0 border-neutral-300 bg-white p-3 font-mono text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:border-neutral-700 dark:bg-neutral-950"
        />
      )}
    </div>
  );
}
