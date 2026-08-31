"use client";

import { useEffect } from "react";
import { useStoredValue } from "../lib/use-stored-value";
import { Popover } from "./popover";
import { Switch } from "./switch";

const FONT_KEY = "anywhere-ui:font-scale";
const CONTRAST_KEY = "anywhere-ui:high-contrast";

/**
 * One panel for the display adjustments people actually reach for on a page
 * that does not offer its own: larger text and higher contrast. Both persist
 * across visits and apply via `documentElement` so the whole page responds,
 * not just this panel's own subtree.
 */
export function AccessibilityMenu({ label = "Accessibility" }: { label?: string }) {
  const [storedFont, setStoredFont] = useStoredValue(FONT_KEY, "false");
  const [storedContrast, setStoredContrast] = useStoredValue(CONTRAST_KEY, "false");
  const largeText = storedFont === "true";
  const highContrast = storedContrast === "true";

  useEffect(() => {
    document.documentElement.style.fontSize = largeText ? "112.5%" : "";
  }, [largeText]);

  useEffect(() => {
    document.documentElement.dataset.highContrast = String(highContrast);
  }, [highContrast]);

  return (
    <Popover trigger={(props) => <button type="button" {...props}>{label}</button>}>
      <div className="flex flex-col gap-3">
        <Switch checked={largeText} onCheckedChange={(v) => setStoredFont(String(v))} label="Larger text" />
        <Switch checked={highContrast} onCheckedChange={(v) => setStoredContrast(String(v))} label="High contrast" />
      </div>
    </Popover>
  );
}
