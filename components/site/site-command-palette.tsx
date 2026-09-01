"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { CommandPalette } from "@/registry/anywhere/ui/command-palette";
import { Kbd } from "@/registry/anywhere/ui/kbd";

export interface PaletteItem {
  name: string;
  title: string;
  category: string;
}

/**
 * The library's own CommandPalette, driving the site that documents it.
 *
 * With 110 components, a search field on one page is not navigation — this is.
 * It is also the honest test of the component: if a keyboard-first launcher
 * cannot survive being the primary way around its own documentation, it is not
 * finished.
 */
export function SiteCommandPalette({ items }: { items: PaletteItem[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "k" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();
        setOpen((previous) => !previous);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const commands = useMemo(
    () =>
      items.map((item) => ({
        id: item.name,
        // Category in the label so it is searchable too — typing "overlay"
        // should find Dialog even though the word is not in its name.
        label: `${item.title} — ${item.category}`,
        onRun: () => {
          setOpen(false);
          router.push(`/components/${item.name}`);
        },
      })),
    [items, router],
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="hidden items-center gap-2 rounded-md border border-hairline px-3 py-1.5 text-body-sm text-smoke transition-colors hover:text-cream md:inline-flex"
      >
        Search components
        <Kbd>Ctrl</Kbd>
        <Kbd>K</Kbd>
      </button>

      <CommandPalette
        open={open}
        onClose={() => setOpen(false)}
        commands={commands}
        label="Search components"
        placeholder="Search 110 components…"
      />
    </>
  );
}
