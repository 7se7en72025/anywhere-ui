"use client";

import { useState } from "react";
import { fixtures } from "@/components/demos";
import { overlayPreviews } from "./overlay-previews";
import { LocaleProvider } from "@/registry/anywhere/lib/use-locale";

const LOCALES = [
  { tag: "en-US", name: "English" },
  { tag: "ar-EG", name: "العربية" },
  { tag: "hi-IN", name: "हिन्दी" },
] as const;

export interface PreviewProps {
  name: string;
  /** Show the locale switcher. Off in dense grids, on for a single component. */
  showControls?: boolean;
}

/**
 * Renders a component's demo — the same fixture the conformance suite renders
 * in CI, so what a reader sees here is exactly what axe and the SSR pass
 * verified.
 */
export function Preview({ name, showControls = false }: PreviewProps) {
  const [locale, setLocale] = useState<string>("en-US");
  const fixture = overlayPreviews[name] ?? fixtures[name];

  if (!fixture) {
    return (
      <p className="text-sm text-neutral-600 dark:text-neutral-400">
        No preview available for this item.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {showControls && (
        <fieldset className="flex flex-wrap items-center gap-2">
          <legend className="sr-only">Preview language</legend>
          {LOCALES.map(({ tag, name: label }) => (
            <button
              key={tag}
              type="button"
              lang={tag}
              onClick={() => setLocale(tag)}
              aria-pressed={locale === tag}
              className={
                locale === tag
                  ? "rounded-md bg-neutral-900 px-2.5 py-1 text-xs text-white dark:bg-neutral-100 dark:text-neutral-900"
                  : "rounded-md border border-neutral-300 px-2.5 py-1 text-xs dark:border-neutral-700"
              }
            >
              {label}
            </button>
          ))}
        </fieldset>
      )}

      {/* `transform` makes this box the containing block for any
          `position: fixed` descendant, so components that pin themselves to
          the viewport — ScrollProgress, BackToTop, SkipLink — stay inside
          their own preview instead of floating over the page. Components that
          portal to <body> escape this by design; those are the ones handled by
          overlayPreviews above. */}
      <div className="flex min-h-32 items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-neutral-50 p-6 transform-gpu dark:border-neutral-800 dark:bg-neutral-950">
        <LocaleProvider locale={locale}>
          <div className="w-full max-w-md">{fixture()}</div>
        </LocaleProvider>
      </div>
    </div>
  );
}
