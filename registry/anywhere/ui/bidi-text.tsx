"use client";

export interface BidiTextProps {
  /** Text of unknown or user-controlled direction. */
  children: React.ReactNode;
  /**
   * "auto" lets the browser infer direction from the first strong character —
   * the right default for user-generated content whose language you do not
   * know at render time.
   */
  dir?: "auto" | "ltr" | "rtl";
}

/**
 * Isolates text whose direction you do not control.
 *
 * When an Arabic or Hebrew name is interpolated into an English sentence, the
 * Unicode bidirectional algorithm reorders the *surrounding* punctuation too:
 * "محمد (3 replies)" can render with the parenthesis and count on the wrong
 * side, and the sentence reads as scrambled to everyone. The bug is invisible
 * in development in an English locale, and reported constantly by users whose
 * names trigger it.
 *
 * `<bdi>` — bidirectional isolate — scopes the reordering to the untrusted run
 * so neighbouring text is unaffected. It is one element, has no styling, and
 * is the entire fix.
 *
 * Wrap any interpolated value you did not author: names, titles, filenames,
 * search terms, message bodies.
 */
export function BidiText({ children, dir = "auto" }: BidiTextProps) {
  return <bdi dir={dir}>{children}</bdi>;
}
