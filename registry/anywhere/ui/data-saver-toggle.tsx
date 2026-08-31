"use client";

import { useStoredValue } from "../lib/use-stored-value";
import { Switch } from "./switch";

const STORAGE_KEY = "anywhere-ui:force-data-saver";

/**
 * Lets someone opt into the library's constrained-connection behaviour
 * manually — useful on an unmetered fast connection where the person still
 * wants to save data by choice, which `useNetwork`'s automatic detection has
 * no way to know about. Setting this overrides `useNetwork().constrained`
 * to `true` regardless of the measured connection; see its docs for wiring.
 */
export function DataSaverToggle({ label = "Data saver" }: { label?: string }) {
  const [stored, setStored] = useStoredValue(STORAGE_KEY, "false");
  const forced = stored === "true";

  return <Switch checked={forced} onCheckedChange={(v) => setStored(String(v))} label={label} />;
}
