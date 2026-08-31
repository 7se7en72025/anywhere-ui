"use client";

import { useRef, useState } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface TreeNode {
  id: string;
  label: string;
  children?: TreeNode[];
}

export interface TreeViewProps {
  label: string;
  nodes: TreeNode[];
  /** Ids expanded on first render. */
  defaultExpanded?: string[];
  onSelect?: (id: string) => void;
  className?: string;
}

/** Depth-first list of ids that are currently reachable, for arrow movement. */
function visibleIds(nodes: TreeNode[], expanded: Set<string>): string[] {
  return nodes.flatMap((node) =>
    node.children && expanded.has(node.id)
      ? [node.id, ...visibleIds(node.children, expanded)]
      : [node.id],
  );
}

/**
 * A disclosure tree following the ARIA tree pattern.
 *
 * The whole tree is one tab stop; arrows move between visible nodes, and
 * expand/collapse follows the writing direction — under RTL, ArrowLeft opens a
 * node, because that is the direction its children indent. `aria-expanded`,
 * `aria-level`, `aria-setsize`, and `aria-posinset` are all present, which is
 * what lets a screen reader say "3 of 7, level 2" instead of leaving the
 * listener to count.
 */
export function TreeView({ label, nodes, defaultExpanded = [], onSelect, className }: TreeViewProps) {
  const { direction } = useLocale();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded));
  const [active, setActive] = useState<string>(() => nodes[0]?.id ?? "");
  const container = useRef<HTMLUListElement>(null);

  function toggle(id: string, open: boolean) {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function focusId(id: string) {
    setActive(id);
    container.current?.querySelector<HTMLElement>(`[data-node="${id}"]`)?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const order = visibleIds(nodes, expanded);
    const index = order.indexOf(active);
    const open = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const close = direction === "rtl" ? "ArrowRight" : "ArrowLeft";

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusId(order[Math.min(index + 1, order.length - 1)]);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusId(order[Math.max(index - 1, 0)]);
    } else if (event.key === open) {
      event.preventDefault();
      toggle(active, true);
    } else if (event.key === close) {
      event.preventDefault();
      toggle(active, false);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusId(order[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      focusId(order[order.length - 1]);
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onSelect?.(active);
    }
  }

  function renderNodes(list: TreeNode[], level: number) {
    return list.map((node, position) => {
      const hasChildren = Boolean(node.children?.length);
      const isOpen = expanded.has(node.id);

      return (
        <li
          key={node.id}
          role="treeitem"
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-level={level}
          aria-setsize={list.length}
          aria-posinset={position + 1}
          aria-selected={active === node.id}
        >
          <button
            type="button"
            data-node={node.id}
            tabIndex={active === node.id ? 0 : -1}
            onClick={() => {
              setActive(node.id);
              if (hasChildren) toggle(node.id, !isOpen);
              else onSelect?.(node.id);
            }}
            className={cn(
              "flex w-full items-center gap-1.5 rounded px-2 py-1 text-start text-sm",
              "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
              active === node.id
                ? "bg-neutral-100 dark:bg-neutral-800"
                : "hover:bg-neutral-100 dark:hover:bg-neutral-800",
            )}
          >
            <span aria-hidden="true" className="w-3 text-neutral-500">
              {hasChildren ? (isOpen ? "▾" : "▸") : ""}
            </span>
            {node.label}
          </button>

          {hasChildren && isOpen && (
            <ul role="group" className="ps-4">
              {renderNodes(node.children!, level + 1)}
            </ul>
          )}
        </li>
      );
    });
  }

  return (
    <ul
      ref={container}
      role="tree"
      aria-label={label}
      dir={direction}
      onKeyDown={handleKeyDown}
      className={cn("flex flex-col text-start", className)}
    >
      {renderNodes(nodes, 1)}
    </ul>
  );
}
