"use client";

import { createPortal } from "react-dom";
import { useHydrated } from "../lib/use-hydrated";

/**
 * Renders `children` into `document.body` instead of the current DOM
 * position — what a dialog or toast needs so it is not visually clipped or
 * z-index-trapped by an ancestor with `overflow: hidden`.
 *
 * Deferred to a client-only mount: `document` does not exist during server
 * rendering, and portaling during the very first client render (before
 * hydration settles) can detach the node React expects to reconcile against.
 */
export function Portal({ children }: { children: React.ReactNode }) {
  const hydrated = useHydrated();

  if (!hydrated) return null;
  return createPortal(children, document.body);
}
