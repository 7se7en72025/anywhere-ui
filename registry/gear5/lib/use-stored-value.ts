"use client";

import { useCallback, useSyncExternalStore } from "react";

/**
 * A `localStorage`-backed string, read via `useSyncExternalStore` rather than
 * `useEffect` + `setState`.
 *
 * The naive version of this — read `null` on first render, correct it to the
 * real value inside a `useEffect` — is exactly the "syncing external state
 * into React state" anti-pattern React's own docs warn against, and it costs
 * a discarded extra render on every mount. `useSyncExternalStore` is the
 * primitive built for precisely this: a real value on the client, a stable
 * server snapshot, and no render wasted correcting itself.
 */
export function useStoredValue(key: string, serverValue: string | null = null): [string | null, (value: string | null) => void] {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const event = `gear5-ui:storage:${key}`;
      window.addEventListener("storage", onChange);
      window.addEventListener(event, onChange);
      return () => {
        window.removeEventListener("storage", onChange);
        window.removeEventListener(event, onChange);
      };
    },
    [key],
  );

  const getSnapshot = useCallback(() => localStorage.getItem(key), [key]);
  const getServerSnapshot = useCallback(() => serverValue, [serverValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (next: string | null) => {
      if (next === null) localStorage.removeItem(key);
      else localStorage.setItem(key, next);
      // localStorage's own "storage" event never fires in the tab that made
      // the write, so this tab needs its own signal to re-read.
      window.dispatchEvent(new Event(`gear5-ui:storage:${key}`));
    },
    [key],
  );

  return [value, setValue];
}
