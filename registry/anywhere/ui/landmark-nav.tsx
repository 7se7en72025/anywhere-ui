"use client";

import { useEffect, useState } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface Landmark {
  id: string;
  label: string;
}

export interface LandmarkNavProps {
  /** Pass landmarks explicitly, or leave empty to discover them on mount. */
  landmarks?: Landmark[];
  label?: string;
  className?: string;
}

const ROLE_SELECTOR = [
  "main",
  "nav",
  "header",
  "footer",
  "aside",
  "[role='main']",
  "[role='navigation']",
  "[role='search']",
  "[role='banner']",
  "[role='contentinfo']",
].join(",");

/** Best available accessible name for a landmark element. */
function nameFor(element: Element, fallback: string): string {
  const label = element.getAttribute("aria-label");
  if (label) return label;

  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const target = document.getElementById(labelledBy);
    if (target?.textContent) return target.textContent.trim();
  }

  return fallback;
}

/**
 * A skip-navigation menu covering every landmark on the page, not just main.
 *
 * A single "Skip to content" link is the bare minimum; a keyboard user who
 * wants the site navigation, or the search field, still tabs there one stop at
 * a time. Screen reader users get a landmark rotor for free — this gives the
 * same affordance to sighted keyboard users, who have no equivalent.
 *
 * Visually hidden until focused, so it costs no layout and appears exactly
 * when it is useful.
 */
export function LandmarkNav({ landmarks, label = "Skip to", className }: LandmarkNavProps) {
  const { direction } = useLocale();
  const [discovered, setDiscovered] = useState<Landmark[]>([]);

  useEffect(() => {
    if (landmarks) return;

    // Deferred to after paint rather than run in the effect body: the page's
    // landmarks are only all present once it has actually rendered, and a
    // synchronous setState here would additionally cascade a second render
    // before the browser has drawn the first.
    const frame = requestAnimationFrame(() => {
      const found: Landmark[] = [];

      // Only elements that already carry an id — assigning ids here would
      // mutate a page this component does not own.
      for (const element of document.querySelectorAll(ROLE_SELECTOR)) {
        if (!element.id) continue;
        found.push({ id: element.id, label: nameFor(element, element.tagName.toLowerCase()) });
      }

      setDiscovered(found);
    });

    return () => cancelAnimationFrame(frame);
  }, [landmarks]);

  const items = landmarks ?? discovered;
  if (items.length === 0) return null;

  return (
    <nav
      aria-label={label}
      dir={direction}
      className={cn(
        "sr-only focus-within:not-sr-only focus-within:absolute focus-within:start-4 focus-within:top-4 focus-within:z-50",
        "focus-within:rounded-lg focus-within:border focus-within:border-neutral-300 focus-within:bg-white focus-within:p-3",
        "dark:focus-within:border-neutral-700 dark:focus-within:bg-neutral-950",
        className,
      )}
    >
      <ul className="flex flex-col gap-1">
        {items.map((landmark) => (
          <li key={landmark.id}>
            <a
              href={`#${landmark.id}`}
              className="rounded px-2 py-1 text-sm underline underline-offset-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
            >
              {landmark.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
