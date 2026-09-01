"use client";

import { useEffect, useRef } from "react";
import { useNetwork } from "../lib/use-network";
import { Spinner } from "./spinner";

export interface InfiniteScrollProps {
  onLoadMore: () => void;
  hasMore: boolean;
  loading: boolean;
  loadingLabel?: string;
}

/**
 * Loads more content as a sentinel element nears the viewport — and refuses
 * to fire on a constrained connection, where auto-loading page after page is
 * exactly the kind of unrequested data spend `AdaptiveImage` exists to avoid
 * for images. On Save-Data or 2G, the sentinel simply stops triggering;
 * pairing this with a manual "Load more" fallback button is the caller's
 * responsibility, since only they know what that button should say.
 */
export function InfiniteScroll({ onLoadMore, hasMore, loading, loadingLabel = "Loading more…" }: InfiniteScrollProps) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const { constrained } = useNetwork();

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore || loading || constrained) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) onLoadMore();
      },
      { rootMargin: "200px" },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore, loading, constrained, onLoadMore]);

  return (
    <div ref={sentinelRef} className="flex justify-center p-4">
      {loading && <Spinner label={loadingLabel} />}
    </div>
  );
}
