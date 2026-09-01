"use client";

import { useRef, useState } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface TreeNode {
  id: string;
  label: string;
  href?: string;
  children?: TreeNode[];
}

export interface TreeNavProps {
  label: string;
  nodes: TreeNode[];
  defaultExpanded?: string[];
  className?: string;
}

function visibleIds(nodes: TreeNode[], expanded: Set<string>): string[] {
  return nodes.flatMap((node) =>
    node.children && expanded.has(node.id)
      ? [node.id, ...visibleIds(node.children, expanded)]
      : [node.id],
  );
}

function depthOf(nodes: TreeNode[], id: string, depth = 1): number {
  for (const node of nodes) {
    if (node.id === id) return depth;
    if (node.children) {
      const found = depthOf(node.children, id, depth + 1);
      if (found > 0) return found;
    }
  }
  return 0;
}

function sizeOf(nodes: TreeNode[]): number {
  return nodes.reduce((acc, node) => acc + 1 + sizeOf(node.children ?? []), 0);
}

/**
 * Nested collapsible navigation tree. Arrow keys move between visible nodes;
 * expand/collapse follows writing direction for RTL. `aria-expanded`,
 * `aria-level`, `aria-setsize`, and `aria-posinset` are all set.
 */
export function TreeNav({ label, nodes, defaultExpanded = [], className }: TreeNavProps) {
  const { direction } = useLocale();
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set(defaultExpanded));
  const [active, setActive] = useState<string>(() => nodes[0]?.id ?? "");
  const container = useRef<HTMLUListElement>(null);

  function toggle(id: string, open: boolean) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (open) next.add(id);
      else next.delete(id);
      return next;
    });
  }

  function focusId(id: string) {
    setActive(id);
    container.current?.querySelector<HTMLElement>(`[data-tree-nav="${id}"]`)?.focus();
  }

  function handleKeyDown(event: React.KeyboardEvent) {
    const order = visibleIds(nodes, expanded);
    const index = order.indexOf(active);
    const openKey = direction === "rtl" ? "ArrowLeft" : "ArrowRight";
    const closeKey = direction === "rtl" ? "ArrowRight" : "ArrowLeft";

    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusId(order[Math.min(index + 1, order.length - 1)]);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      focusId(order[Math.max(index - 1, 0)]);
    } else if (event.key === openKey) {
      event.preventDefault();
      toggle(active, true);
    } else if (event.key === closeKey) {
      event.preventDefault();
      toggle(active, false);
    } else if (event.key === "Home") {
      event.preventDefault();
      focusId(order[0]);
    } else if (event.key === "End") {
      event.preventDefault();
      focusId(order[order.length - 1]);
    }
  }

  function renderNode(node: TreeNode, level: number) {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = expanded.has(node.id);
    const isActive = node.id === active;
    const Wrapper = node.href ? "a" : "button";

    return (
      <li key={node.id} role="treeitem" aria-expanded={hasChildren ? isOpen : undefined} aria-level={level} aria-setsize={sizeOf([node])} aria-posinset={1}>
        <Wrapper
          {...(node.href ? { href: node.href } : { type: "button" as const })}
          data-tree-nav={node.id}
          tabIndex={isActive ? 0 : -1}
          onClick={() => {
            if (hasChildren) toggle(node.id, !isOpen);
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            "flex items-center gap-1 rounded px-2 py-1 text-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600",
            isActive
              ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400"
              : "text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800",
          )}
        >
          {hasChildren && (
            <span aria-hidden="true" className="text-xs">
              {isOpen ? "▾" : "▸"}
            </span>
          )}
          {node.label}
        </Wrapper>
        {hasChildren && isOpen && (
          <ul role="group" className="ps-4">
            {node.children!.map((child) => renderNode(child, level + 1))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <nav aria-label={label}>
      <ul ref={container} role="tree" aria-label={label} className="flex flex-col gap-0.5">
        {nodes.map((node) => renderNode(node, 1))}
      </ul>
    </nav>
  );
}
