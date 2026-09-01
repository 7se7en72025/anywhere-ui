"use client";

import Link from "next/link";
import { AdaptiveImage } from "@/registry/anywhere/ui/adaptive-image";
import { CompactNumber } from "@/registry/anywhere/ui/compact-number";
import { DateRangeText } from "@/registry/anywhere/ui/date-range-text";
import { LocaleProvider } from "@/registry/anywhere/lib/use-locale";

const SAMPLE_LOCALES = [
  { tag: "en-US", name: "English" },
  { tag: "hi-IN", name: "हिन्दी" },
  { tag: "ar-EG", name: "العربية" },
] as const;

const RANGE_START = new Date("2026-01-01T00:00:00Z");
const RANGE_END = new Date("2026-01-05T00:00:00Z");

/**
 * One row of the floating card: the same value, rendered by the same
 * component, in a different locale.
 */
function LocaleRow({ tag, name }: { tag: string; name: string }) {
  return (
    <LocaleProvider locale={tag}>
      <div className="flex items-baseline justify-between gap-4 border-t border-hairline py-2 first:border-t-0 first:pt-0">
        <span className="shrink-0 text-caption text-smoke" lang={tag}>
          {name}
        </span>
        <span className="text-end text-body-sm text-cream">
          <CompactNumber value={1234567} exactLabel={false} />
          <span className="mx-2 text-smoke/50" aria-hidden="true">
            ·
          </span>
          <DateRangeText start={RANGE_START} end={RANGE_END} options={{ dateStyle: "medium" }} />
        </span>
      </div>
    </LocaleProvider>
  );
}

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      {/* Full-bleed artwork. `priority` because this is the LCP element — the
          one image on the site that should never be deferred. */}
      <AdaptiveImage
        src="/demo/voyage.svg"
        alt=""
        width={1200}
        height={675}
        priority
        className="absolute inset-0 -z-10 size-full max-w-none rounded-none object-cover"
      />

      {/*
        The dusk wash — the one gradient in the system — laid over the artwork
        so the two read as a single atmospheric field rather than a picture
        with a filter on it. Multiply keeps the illustration's own light
        visible through it instead of flattening it to a colour.
      */}
      <div aria-hidden="true" className="dusk-wash absolute inset-0 -z-10 mix-blend-multiply" />

      {/*
        Two scrims rather than one flat wash. The headline sits on the start
        side, so that side is covered enough to guarantee contrast regardless
        of what the artwork is doing underneath; the end side stays clear so
        the illustration is actually visible. A short fade at the bottom hands
        off to the canvas so the section ends without a seam.
      */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-gradient-to-r from-canvas via-canvas/80 to-canvas/20"
      />
      <div
        aria-hidden="true"
        className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-b from-transparent to-canvas"
      />

      <div className="mx-auto flex max-w-[1200px] flex-col gap-12 px-6 pt-20 pb-24 lg:flex-row lg:items-center">
        <div className="flex max-w-2xl flex-col gap-6">
          <p className="text-caption tracking-[0.16em] text-smoke uppercase">
            Open source · MIT · zero dependencies
          </p>

          <h1 className="text-heading text-balance text-cream sm:text-heading-lg">
            React components that work{" "}
            <span className="font-editorial italic text-coral">anywhere</span>.
          </h1>

          <p className="max-w-xl text-body-lg text-pretty text-smoke">
            Any device. Any network. Any language. Any ability. Engineered for the conditions most
            component libraries are never tested against — and verified against all ten of them, in
            CI.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/components"
              className="rounded-md bg-coral px-5 py-2.5 text-body-sm font-medium text-on-accent transition-opacity hover:opacity-90"
            >
              Browse components
            </Link>

            <a
              href="https://github.com/7se7en72025/anywhere-ui"
              className="rounded-md border border-hairline px-5 py-2.5 text-body-sm text-cream transition-colors hover:bg-cream/10"
            >
              Source on GitHub
            </a>
          </div>
        </div>

        {/*
          The signature compositional move from the reference: a translucent
          product card floating over the artwork. Its content is not a mockup —
          these are the real CompactNumber and DateRangeText components, each
          rendering the identical value under a different locale. The card is
          the argument.
        */}
        <div className="lg:ms-auto lg:w-[26rem]">
          <div className="rounded-lg border border-hairline bg-anvil/80 p-4 shadow-xl backdrop-blur-md">
            <p className="mb-3 text-caption tracking-[0.16em] text-smoke uppercase">
              One value, three locales
            </p>

            <div className="flex flex-col">
              {SAMPLE_LOCALES.map((locale) => (
                <LocaleRow key={locale.tag} tag={locale.tag} name={locale.name} />
              ))}
            </div>

            <p className="mt-3 border-t border-hairline pt-3 text-caption text-smoke">
              Same components, same props. Grouping, digits, calendar, and direction all come from
              the locale.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
