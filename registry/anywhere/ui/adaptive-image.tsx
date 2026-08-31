/* eslint-disable @next/next/no-img-element -- A plain <img> is the point. This
   component has to work in any React app, not only Next.js, and it already does
   next/image's job by hand: width and height are mandatory, loading and
   decoding are set explicitly, and the download is skipped outright on
   constrained connections. */
"use client";

import { useState } from "react";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";
import { useNetwork } from "../lib/use-network";

export interface AdaptiveImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "loading" | "src" | "alt"> {
  src: string;
  /**
   * Required, and not optional-with-a-default on purpose.
   *
   * Pass `""` for decorative images — that is a real, correct answer that
   * hides the image from screen readers. What is never correct is forgetting.
   */
  alt: string;
  /** Intrinsic width in px. Required: without it the page shifts on load. */
  width: number;
  /** Intrinsic height in px. Required: without it the page shifts on load. */
  height: number;
  /** Optional low-cost stand-in shown before/instead of the full image. */
  placeholderSrc?: string;
  /**
   * Skip the deferral and always download immediately. Use for the image that
   * is the page's LCP element; leave off for everything below the fold.
   */
  priority?: boolean;
  /** Label for the button that loads a deferred image. */
  loadLabel?: string;
}

/**
 * An `<img>` that respects what the connection can afford.
 *
 * On a Save-Data or 2G-class connection this renders a placeholder and a button
 * instead of silently spending the user's data — which, on a metered prepaid
 * plan, is spending their money. Everywhere else it behaves like a normal lazy
 * image.
 *
 * `width` and `height` are mandatory: the aspect ratio is reserved before the
 * bytes arrive, so nothing below the image moves when it lands.
 */
export function AdaptiveImage({
  src,
  alt,
  width,
  height,
  placeholderSrc,
  priority = false,
  loadLabel = "Load image",
  className,
  style,
  ...props
}: AdaptiveImageProps) {
  const { constrained } = useNetwork();
  const { direction } = useLocale();
  const [forced, setForced] = useState(false);

  const deferred = constrained && !priority && !forced;

  const box = {
    aspectRatio: `${width} / ${height}`,
    maxWidth: `${width}px`,
    ...style,
  } satisfies React.CSSProperties;

  if (deferred) {
    return (
      <div
        dir={direction}
        style={box}
        className={cn(
          "relative w-full overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900",
          className,
        )}
      >
        {placeholderSrc && (
          <img
            src={placeholderSrc}
            alt=""
            aria-hidden="true"
            width={width}
            height={height}
            className="absolute inset-0 size-full scale-105 object-cover blur-md"
          />
        )}

        <button
          type="button"
          onClick={() => setForced(true)}
          className="absolute inset-0 flex size-full items-center justify-center bg-black/40 text-sm font-medium text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
        >
          {/* The button's accessible name carries the image's own description,
              so a screen reader user knows what they would be downloading. */}
          <span>{loadLabel}</span>
          {alt && <span className="sr-only">: {alt}</span>}
        </button>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      dir={direction}
      style={box}
      className={cn("h-auto w-full rounded-md", className)}
    />
  );
}
