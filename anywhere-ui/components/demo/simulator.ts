"use client";

/**
 * Demo-only: fake the browser APIs `useNetwork` reads, so the playground can
 * show real components reacting to conditions this machine is not in.
 *
 * This file is not part of the registry and never ships to consumers — it
 * exists so a reviewer on office fibre can see what the library does on a 2G
 * connection in Lagos without throttling their own devtools.
 */

export type SimulatedNetwork = "fast" | "slow" | "offline";

interface FakeConnection extends EventTarget {
  saveData: boolean;
  effectiveType: string;
  downlink: number;
}

let connection: FakeConnection | null = null;

function ensureConnection(): FakeConnection {
  if (connection) return connection;

  const target = new EventTarget() as FakeConnection;
  target.saveData = false;
  target.effectiveType = "4g";
  target.downlink = 10;

  Object.defineProperty(navigator, "connection", {
    configurable: true,
    get: () => target,
  });

  connection = target;
  return target;
}

let onLinePatched = false;
let onLineValue = true;

function ensureOnLinePatch(): void {
  if (onLinePatched) return;

  Object.defineProperty(navigator, "onLine", {
    configurable: true,
    get: () => onLineValue,
  });

  onLinePatched = true;
}

/** Put the page into a simulated network condition. */
export function simulateNetwork(mode: SimulatedNetwork): void {
  const target = ensureConnection();
  ensureOnLinePatch();

  const wasOnline = onLineValue;
  onLineValue = mode !== "offline";

  if (mode === "slow") {
    target.saveData = true;
    target.effectiveType = "2g";
    target.downlink = 0.25;
  } else {
    target.saveData = false;
    target.effectiveType = "4g";
    target.downlink = 10;
  }

  target.dispatchEvent(new Event("change"));

  if (wasOnline !== onLineValue) {
    window.dispatchEvent(new Event(onLineValue ? "online" : "offline"));
  }
}
