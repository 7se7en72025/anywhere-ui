"use client";

import { useState } from "react";
import { cn } from "../lib/cn";

export interface AvatarProps {
  src?: string;
  /** Person's name. Used for the accessible label and the initials fallback. */
  name: string;
  size?: number;
  className?: string;
}

/**
 * `Intl.Segmenter` splits on grapheme clusters, not UTF-16 code units, so the
 * first "letter" of a name is correct for combining scripts (Devanagari,
 * Thai) and for names in scripts with no concept of upper/lower case (CJK,
 * Arabic) alike — a naive `name[0].toUpperCase()` mangles all three.
 */
function initials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return "";

  const words = trimmed.split(/\s+/).slice(0, 2);
  const segmenter = typeof Intl.Segmenter === "function" ? new Intl.Segmenter() : null;

  return words
    .map((word) => {
      if (!segmenter) return word[0] ?? "";
      const first = segmenter.segment(word)[Symbol.iterator]().next();
      return first.done ? "" : first.value.segment;
    })
    .join("")
    .toUpperCase();
}

/** A person's picture, or their initials when there is none or it fails to load. */
export function Avatar({ src, name, size = 40, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);
  const showImage = src && !failed;

  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        "inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-neutral-200 font-medium text-neutral-700 dark:bg-neutral-700 dark:text-neutral-200",
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.4 }}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element -- framework-agnostic by design; see adaptive-image.tsx for the fuller rationale.
        <img
          src={src}
          alt=""
          aria-hidden="true"
          width={size}
          height={size}
          className="size-full object-cover"
          onError={() => setFailed(true)}
        />
      ) : (
        <span aria-hidden="true">{initials(name)}</span>
      )}
    </span>
  );
}
