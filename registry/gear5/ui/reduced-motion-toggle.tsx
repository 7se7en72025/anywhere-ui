"use client";

import { useEffect } from "react";
import { useStoredValue } from "../lib/use-stored-value";
import { Switch } from "./switch";

const STORAGE_KEY = "gear5-ui:reduce-motion";

/**
 * Lets someone opt into reduced motion from inside the page, for the many
 * people who have never touched their OS accessibility settings but still
 * find animation distracting or nausea-inducing. Setting this data attribute
 * is a contract: consuming CSS should treat `[data-reduce-motion="true"]` the
 * same as `prefers-reduced-motion: reduce`.
 */
export function ReducedMotionToggle({ label = "Reduce motion" }: { label?: string }) {
  const [stored, setStored] = useStoredValue(STORAGE_KEY, "false");
  const reduced = stored === "true";

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = String(reduced);
  }, [reduced]);

  return <Switch checked={reduced} onCheckedChange={(v) => setStored(String(v))} label={label} />;
}
