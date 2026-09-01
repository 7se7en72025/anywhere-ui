"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Keeps Tab/Shift+Tab cycling inside a container while `active` is true, and
 * restores focus to whatever had it beforehand on the way out.
 *
 * This is the piece that makes a modal actually modal for a keyboard user —
 * without it, Tab quietly walks focus into content behind the dialog that is
 * still there, present in the DOM, `inert` or not.
 */
export function useFocusTrap<T extends HTMLElement>(active: boolean) {
  const ref = useRef<T>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!active || !ref.current) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    const container = ref.current;
    const focusables = () => Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));

    (focusables()[0] ?? container).focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Tab") return;

      const nodes = focusables();
      if (nodes.length === 0) return;

      const first = nodes[0];
      const last = nodes[nodes.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    container.addEventListener("keydown", onKeyDown);
    return () => {
      container.removeEventListener("keydown", onKeyDown);
      previouslyFocused.current?.focus();
    };
  }, [active]);

  return ref;
}
