"use client";

import { useState } from "react";
import { cn } from "../lib/cn";

export interface AppShellProps {
  sidebar: React.ReactNode;
  header: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/**
 * App shell layout with a collapsible sidebar, header, and main content area.
 * The sidebar toggle uses `aria-expanded` and the sidebar has
 * `aria-label="Sidebar"` for screen readers.
 */
export function AppShell({ sidebar, header, children, className }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className={cn("flex h-screen overflow-hidden bg-white dark:bg-neutral-950", className)}>
      {/* Sidebar */}
      <aside
        aria-label="Sidebar"
        className={cn(
          "flex flex-col border-e border-neutral-200 bg-neutral-50 transition-[width] motion-reduce:transition-none dark:border-neutral-800 dark:bg-neutral-900",
          sidebarOpen ? "w-64" : "w-0 overflow-hidden",
        )}
      >
        <div className="flex-1 overflow-y-auto p-4">{sidebar}</div>
      </aside>

      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-neutral-200 px-4 py-3 dark:border-neutral-800">
          <button
            type="button"
            aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen((prev) => !prev)}
            className="rounded-md p-1.5 text-neutral-600 hover:bg-neutral-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <span aria-hidden="true" className="text-lg">
              {sidebarOpen ? "◂" : "☰"}
            </span>
          </button>
          <div className="flex-1">{header}</div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
