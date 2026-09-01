"use client";

import { useMemo } from "react";
import { useLocale } from "../lib/use-locale";

export interface TruncateTextProps {
  text: string;
  /** Maximum length, counted in user-perceived characters. */
  limit: number;
  /** Appended when the text is shortened. */
  ellipsis?: string;
}

/**
 * Truncation that counts what a reader counts.
 *
 * `text.slice(0, n)` counts UTF-16 code units, which is not what anyone means
 * by "characters". It splits an emoji into halves that render as tofu, cuts a
 * flag apart into two letters, and severs Devanagari and Thai text mid-cluster
 * so the remaining glyph is a different, wrong letter.
 *
 * `Intl.Segmenter` with granularity "grapheme" segments by user-perceived
 * character, which is the unit a limit should actually be expressed in. The
 * full text stays available to assistive technology via the title attribute,
 * so nothing is lost to a screen reader that was visible to anyone else.
 */
export function TruncateText({ text, limit, ellipsis = "…" }: TruncateTextProps) {
  const { locale } = useLocale();

  const truncated = useMemo(() => {
    if (typeof Intl.Segmenter !== "function") {
      // A runtime without Segmenter is old enough that [...text] — which at
      // least splits by code point rather than code unit — is the best
      // available approximation.
      const points = [...text];
      return points.length <= limit ? text : points.slice(0, limit).join("");
    }

    const segmenter = new Intl.Segmenter(locale, { granularity: "grapheme" });
    const graphemes = [...segmenter.segment(text)].map((entry) => entry.segment);

    return graphemes.length <= limit ? text : graphemes.slice(0, limit).join("");
  }, [text, limit, locale]);

  if (truncated === text) return <>{text}</>;

  return <span title={text}>{truncated + ellipsis}</span>;
}
