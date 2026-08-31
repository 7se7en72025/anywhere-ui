"use client";

import { useEffect, useRef, useState } from "react";
import { useNetwork } from "../lib/use-network";

export interface LazyMountProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  /** Mount immediately regardless of visibility or connection. */
  eager?: boolean;
}

/**
 * Defers mounting expensive children (a video embed, a map, a chart library)
 * until they scroll into view — and, on a constrained connection, until the
 * user has already shown intent to be on this part of the page, rather than
 * paying for it the moment it exists in the DOM.
 */
export function LazyMount({ children, fallback = null, eager = false }: LazyMountProps) {
  const [visible, setVisible] = useState(eager);
  const ref = useRef<HTMLDivElement>(null);
  const { constrained } = useNetwork();

  useEffect(() => {
    if (eager || visible || !ref.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setVisible(true);
      },
      { rootMargin: constrained ? "0px" : "200px" },
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [eager, visible, constrained]);

  return <div ref={ref}>{visible ? children : fallback}</div>;
}
