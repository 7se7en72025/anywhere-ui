"use client";

import { useEffect, useId, useState } from "react";
import { cn } from "../lib/cn";

export interface ContextMenuAction {
  label: string;
  onSelect: () => void;
}

export interface ContextMenuProps {
  children: React.ReactNode;
  actions: ContextMenuAction[];
}

/**
 * A right-click menu that is also reachable without a mouse: the
 * `Menu`/`Shift+F10` keyboard-invoked context menu key opens it too, since a
 * feature reachable only by right-click does not exist for a keyboard-only
 * or switch-access user.
 */
export function ContextMenu({ children, actions }: ContextMenuProps) {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const id = useId();

  useEffect(() => {
    if (!position) return;
    const close = () => setPosition(null);
    document.addEventListener("click", close);
    document.addEventListener("keydown", (e) => e.key === "Escape" && close());
    return () => document.removeEventListener("click", close);
  }, [position]);

  const open = (x: number, y: number) => setPosition({ x, y });

  return (
    <div
      onContextMenu={(event) => {
        event.preventDefault();
        open(event.clientX, event.clientY);
      }}
      onKeyDown={(event) => {
        if (event.key === "ContextMenu" || (event.key === "F10" && event.shiftKey)) {
          event.preventDefault();
          const rect = event.currentTarget.getBoundingClientRect();
          open(rect.left, rect.bottom);
        }
      }}
    >
      {children}
      {position && (
        <ul
          id={id}
          role="menu"
          style={{ position: "fixed", top: position.y, insetInlineStart: position.x }}
          className="z-50 min-w-40 rounded-lg border border-neutral-200 bg-white p-1 text-start shadow-lg dark:border-neutral-800 dark:bg-neutral-900"
        >
          {actions.map((action) => (
            <li key={action.label}>
              <button
                type="button"
                role="menuitem"
                onClick={() => {
                  action.onSelect();
                  setPosition(null);
                }}
                className={cn("block w-full rounded-md px-3 py-1.5 text-start text-sm hover:bg-neutral-100 dark:hover:bg-neutral-800")}
              >
                {action.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
