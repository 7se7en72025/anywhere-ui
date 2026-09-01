"use client";

import Link from "next/link";
import { AdaptiveImage } from "@/registry/gear5/ui/adaptive-image";
import { CompactNumber } from "@/registry/gear5/ui/compact-number";
import { DateRangeText } from "@/registry/gear5/ui/date-range-text";
import { LocaleProvider } from "@/registry/gear5/lib/use-locale";

const SAMPLE_LOCALES = [
  { tag: "en-US", name: "English" },
  { tag: "hi-IN", name: "हिन्दी" },
  { tag: "ar-EG", name: "العربية" },
] as const;

const RANGE_START = new Date("2026-01-01T00:00:00Z");
const RANGE_END = new Date("2026-01-05T00:00:00Z");

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
      <AdaptiveImage
        src="/demo/voyage.svg"
        alt=""
        width={1200}
        height={675}
        priority
        className="absolute inset-0 -z-10 size-full max-w-none rounded-none object-cover animate-fade-in"
      />

      <div aria-hidden="true" className="dusk-wash absolute inset-0 -z-10 mix-blend-multiply" />

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
          <p className="animate-fade-in-up text-caption tracking-[0.16em] text-smoke uppercase">
            Open source · MIT · zero dependencies
          </p>

          <h1 className="animate-fade-in-up text-heading text-balance text-cream sm:text-heading-lg" style={{ animationDelay: "100ms" }}>
            React components that work{" "}
            <span className="font-editorial italic text-coral">anywhere</span>.
          </h1>

          <p className="animate-fade-in-up max-w-xl text-body-lg text-pretty text-smoke" style={{ animationDelay: "200ms" }}>
            Any device. Any network. Any language. Any ability. Built for the conditions most
            component libraries are never tested against, and verified against all ten of them, in
            CI.
          </p>

          <div className="animate-fade-in-up flex flex-wrap items-center gap-3" style={{ animationDelay: "300ms" }}>
            <Link
              href="/components"
              className="rounded-md bg-coral px-5 py-2.5 text-body-sm font-medium text-on-accent transition-all hover:opacity-90 hover:shadow-lg hover:shadow-coral/20"
            >
              Browse components
            </Link>

            <a
              href="https://github.com/7se7en72025/gear5-ui"
              className="rounded-md border border-hairline px-5 py-2.5 text-body-sm text-cream transition-all hover:bg-cream/10 hover:border-cream/30"
            >
              Source on GitHub
            </a>
          </div>

          <div className="animate-fade-in-up mt-4 flex items-center gap-4 text-caption text-smoke" style={{ animationDelay: "400ms" }}>
            <span className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-green-500" aria-hidden="true" />
              866 tests passing
            </span>
            <span aria-hidden="true" className="text-smoke/30">·</span>
            <span>87 components</span>
            <span aria-hidden="true" className="text-smoke/30">·</span>
            <span>Zero dependencies</span>
          </div>
        </div>

        <div className="animate-slide-in-right lg:ms-auto lg:w-[26rem]" style={{ animationDelay: "300ms" }}>
          <div className="rounded-lg border border-hairline bg-anvil/80 p-4 shadow-xl backdrop-blur-md animate-pulse-glow">
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
