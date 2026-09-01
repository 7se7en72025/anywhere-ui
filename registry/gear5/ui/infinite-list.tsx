"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

export interface InfiniteListProps<T> {
  items: T[];
  loadMore: () => Promise<void>;
  hasMore: boolean;
  loading?: boolean;
  renderItem: (item: T, index: number) => React.ReactNode;
  loadingIndicator?: React.ReactNode;
  endMessage?: React.ReactNode;
  className?: string;
  listClassName?: string;
  ariaLabel?: string;
}

export function InfiniteList<T>({
  items,
  loadMore,
  hasMore,
  loading = false,
  renderItem,
  loadingIndicator,
  endMessage,
  className = "",
  listClassName = "",
  ariaLabel,
}: InfiniteListProps<T>) {
  const sentinelRef = useRef<HTMLDivElement>(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleLoadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    setLoadingMore(true);
    try {
      await loadMore();
    } finally {
      setLoadingMore(false);
    }
  }, [loadMore, loading, loadingMore, hasMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          handleLoadMore();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore]);

  const isLoading = loading || loadingMore;

  return (
    <div className={className} aria-label={ariaLabel}>
      <ul
        className={listClassName}
        role="list"
        style={{ listStyle: "none", padding: 0, margin: 0 }}
      >
        {items.map((item, index) => (
          <li key={index}>{renderItem(item, index)}</li>
        ))}
      </ul>

      <div
        ref={sentinelRef}
        aria-hidden="true"
        style={{ height: 1 }}
      />

      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          style={{
            display: "flex",
            justifyContent: "center",
            paddingBlock: "1.5rem",
          }}
        >
          {loadingIndicator ?? (
            <span style={{ color: "var(--color-muted, #6b7280)" }}>
              Loading more…
            </span>
          )}
        </div>
      )}

      {!hasMore && !isLoading && endMessage != null && (
        <div
          role="status"
          style={{
            textAlign: "center",
            paddingBlock: "1.5rem",
            color: "var(--color-muted, #6b7280)",
          }}
        >
          {endMessage}
        </div>
      )}
    </div>
  );
}
