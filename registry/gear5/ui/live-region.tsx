"use client";

import { useEffect, useState } from "react";
import { VisuallyHidden } from "./visually-hidden";

export interface LiveRegionProps {
  message: string;
  politeness?: "polite" | "assertive";
}

/**
 * A declarative live region for a component that already tracks its own
 * message as state, as an alternative to calling the imperative `announce()`
 * function.
 *
 * Renders empty on mount and only starts reflecting `message` one commit
 * later — the same mount-before-fill requirement `announce()` documents:
 * a screen reader must see this node exist before its text first changes, or
 * most implementations never announce it at all.
 */
export function LiveRegion({ message, politeness = "polite" }: LiveRegionProps) {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Deliberately not "just render `message` directly" — the whole point of
    // this component is the one-commit delay between mount and first fill
    // that makes screen readers actually announce the change.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setContent(message);
  }, [message]);

  return (
    <VisuallyHidden as="div">
      <div role={politeness === "assertive" ? "alert" : "status"} aria-live={politeness} aria-atomic="true">
        {content}
      </div>
    </VisuallyHidden>
  );
}
