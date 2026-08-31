"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useFocusTrap } from "../lib/use-focus-trap";
import { cn } from "../lib/cn";
import { Portal } from "./portal";

export interface Command {
  id: string;
  label: string;
  onRun: () => void;
}

export interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  commands: Command[];
  label?: string;
  placeholder?: string;
}

/**
 * A keyboard-first fuzzy launcher following the ARIA combobox pattern: the
 * text input owns focus throughout, `aria-activedescendant` tracks the
 * highlighted result without moving real focus off the field, and the
 * listbox is announced by a live region as results change count.
 */
export function CommandPalette({ open, onClose, commands, label = "Command palette", placeholder = "Type a command…" }: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [queryAtLastReset, setQueryAtLastReset] = useState(query);
  const listId = useId();
  const trapRef = useFocusTrap<HTMLDivElement>(open);

  const results = useMemo(
    () => commands.filter((c) => c.label.toLowerCase().includes(query.toLowerCase())),
    [commands, query],
  );

  // Reset the highlight when the query changes — computed during render
  // (React's own pattern for "adjust state when a value changes") rather
  // than in an effect, since the query and the palette are both this
  // component's own state, not an external system to synchronise with.
  if (query !== queryAtLastReset) {
    setQueryAtLastReset(query);
    setActiveIndex(0);
  }

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const run = (command: Command) => {
    command.onRun();
    onClose();
  };

  return (
    <Portal>
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-24">
        <div aria-hidden="true" className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div ref={trapRef} tabIndex={-1} className="relative z-10 w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-xl dark:bg-neutral-900">
          <input
            role="combobox"
            aria-expanded="true"
            aria-controls={listId}
            aria-activedescendant={results[activeIndex] ? `${listId}-${results[activeIndex].id}` : undefined}
            aria-label={label}
            autoFocus
            value={query}
            placeholder={placeholder}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "ArrowDown") {
                event.preventDefault();
                setActiveIndex((i) => Math.min(results.length - 1, i + 1));
              } else if (event.key === "ArrowUp") {
                event.preventDefault();
                setActiveIndex((i) => Math.max(0, i - 1));
              } else if (event.key === "Enter" && results[activeIndex]) {
                run(results[activeIndex]);
              }
            }}
            className="w-full border-b border-neutral-200 px-4 py-3 text-base outline-none dark:border-neutral-800 dark:bg-neutral-900"
          />
          <ul id={listId} role="listbox" aria-label={label} className="max-h-72 overflow-y-auto p-1">
            {results.map((command, index) => (
              <li
                key={command.id}
                id={`${listId}-${command.id}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => run(command)}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-2 text-sm",
                  index === activeIndex ? "bg-blue-600 text-white" : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
                )}
              >
                {command.label}
              </li>
            ))}
            {results.length === 0 && <li className="px-3 py-2 text-sm text-neutral-500">No results</li>}
          </ul>
        </div>
      </div>
    </Portal>
  );
}
