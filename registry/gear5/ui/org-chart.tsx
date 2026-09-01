"use client";

import { useState } from "react";
import { cn } from "../lib/cn";

export interface OrgNode {
  id: string;
  name: string;
  title?: string;
  children?: OrgNode[];
}

export interface OrgChartProps {
  root: OrgNode;
  className?: string;
}

/**
 * Hierarchical org chart with expand/collapse. Each node uses `aria-expanded`
 * and `aria-level`. Collapsed children are removed from the accessibility tree.
 */
export function OrgChart({ root, className }: OrgChartProps) {
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set([root.id]));

  function toggle(id: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function renderNode(node: OrgNode, level: number) {
    const hasChildren = node.children && node.children.length > 0;
    const isOpen = expanded.has(node.id);

    return (
      <div key={node.id} className="flex flex-col items-center">
        <div
          role="treeitem"
          aria-expanded={hasChildren ? isOpen : undefined}
          aria-level={level}
          className={cn(
            "flex flex-col items-center rounded-lg border border-neutral-200 bg-white px-4 py-3 text-center shadow-sm dark:border-neutral-800 dark:bg-neutral-900",
          )}
        >
          <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
            {node.name}
          </span>
          {node.title && (
            <span className="text-xs text-neutral-500 dark:text-neutral-400">{node.title}</span>
          )}
          {hasChildren && (
            <button
              type="button"
              aria-label={`${isOpen ? "Collapse" : "Expand"} ${node.name}`}
              onClick={() => toggle(node.id)}
              className="mt-2 text-xs text-blue-600 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-blue-400"
            >
              {isOpen ? "▾ Collapse" : "▸ Expand"} ({node.children!.length})
            </button>
          )}
        </div>
        {hasChildren && isOpen && (
          <div className="relative mt-4">
            <span aria-hidden="true" className="absolute -top-4 start-1/2 h-4 w-px bg-neutral-300 dark:bg-neutral-700" />
            <div role="group" className="flex gap-4">
              {node.children!.map((child) => renderNode(child, level + 1))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div role="tree" aria-label="Organization chart" className={cn("overflow-x-auto", className)}>
      <div className="flex justify-center">{renderNode(root, 1)}</div>
    </div>
  );
}
