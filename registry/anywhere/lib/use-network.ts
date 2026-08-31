"use client";

import { useSyncExternalStore } from "react";

export type EffectiveType = "slow-2g" | "2g" | "3g" | "4g" | "unknown";

export interface NetworkState {
  /** `navigator.onLine`. Optimistic by nature — a `true` here is not a promise. */
  online: boolean;
  /** User has explicitly asked the OS/browser to reduce data usage. */
  saveData: boolean;
  /** Round-trip-time bucket reported by the Network Information API. */
  effectiveType: EffectiveType;
  /** Estimated downlink in Mbps, or `null` when unknown. */
  downlink: number | null;
  /**
   * True when we should assume the connection cannot comfortably carry
   * non-essential bytes: an explicit Save-Data request, a 2G-class connection,
   * or a downlink below 0.5 Mbps.
   */
  constrained: boolean;
}

interface NavigatorConnection extends EventTarget {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
}

function getConnection(): NavigatorConnection | undefined {
  if (typeof navigator === "undefined") return undefined;

  const nav = navigator as Navigator & {
    connection?: NavigatorConnection;
    mozConnection?: NavigatorConnection;
    webkitConnection?: NavigatorConnection;
  };

  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

/**
 * Rendered on the server and on the very first client paint, before any
 * measurement exists. We deliberately assume a *good* connection here so the
 * markup matches what the server produced and hydration stays quiet; the real
 * measurement lands one tick later.
 */
const SERVER_SNAPSHOT: NetworkState = {
  online: true,
  saveData: false,
  effectiveType: "unknown",
  downlink: null,
  constrained: false,
};

let cached: NetworkState = SERVER_SNAPSHOT;

function readNetwork(): NetworkState {
  const connection = getConnection();

  const online = typeof navigator === "undefined" ? true : navigator.onLine;
  const saveData = connection?.saveData === true;
  const rawType = connection?.effectiveType;
  const effectiveType: EffectiveType =
    rawType === "slow-2g" ||
    rawType === "2g" ||
    rawType === "3g" ||
    rawType === "4g"
      ? rawType
      : "unknown";
  const downlink = typeof connection?.downlink === "number" ? connection.downlink : null;

  const constrained =
    saveData ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    (downlink !== null && downlink > 0 && downlink < 0.5);

  // useSyncExternalStore compares snapshots by identity, so an unchanged
  // network must return the exact same object or React re-renders forever.
  if (
    cached.online === online &&
    cached.saveData === saveData &&
    cached.effectiveType === effectiveType &&
    cached.downlink === downlink &&
    cached.constrained === constrained
  ) {
    return cached;
  }

  cached = { online, saveData, effectiveType, downlink, constrained };
  return cached;
}

function subscribe(onChange: () => void): () => void {
  const connection = getConnection();

  window.addEventListener("online", onChange);
  window.addEventListener("offline", onChange);
  connection?.addEventListener("change", onChange);

  return () => {
    window.removeEventListener("online", onChange);
    window.removeEventListener("offline", onChange);
    connection?.removeEventListener("change", onChange);
  };
}

/**
 * Observe the user's connection. Safe in Server Components' client children:
 * it renders a good-connection snapshot on the server and corrects on mount.
 */
export function useNetwork(): NetworkState {
  return useSyncExternalStore(subscribe, readNetwork, () => SERVER_SNAPSHOT);
}
