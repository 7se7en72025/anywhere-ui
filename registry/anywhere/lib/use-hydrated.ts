"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * `true` once the client has taken over from the server-rendered markup,
 * `false` during that first render — the sanctioned replacement for the
 * `useState(false) + useEffect(() => setState(true))` "mounted" idiom, which
 * spends an extra render doing the same thing `useSyncExternalStore`'s own
 * server/client snapshot split does for free.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(subscribe, () => true, () => false);
}
