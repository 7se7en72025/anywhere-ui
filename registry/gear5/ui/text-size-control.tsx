"use client";

import { useEffect } from "react";
import { announce } from "../lib/announce";
import { cn } from "../lib/cn";
import { useStoredValue } from "../lib/use-stored-value";
import { SegmentedControl } from "./segmented-control";

const STORAGE_KEY = "gear5-ui:text-size";

export interface TextSizeControlLabels {
  legend: string;
  small: string;
  normal: string;
  large: string;
  larger: string;
  /** `{size}` is replaced with the chosen label. */
  announcement: string;
}

const DEFAULT_LABELS: TextSizeControlLabels = {
  legend: "Text size",
  small: "Small",
  normal: "Normal",
  large: "Large",
  larger: "Larger",
  announcement: "Text size: {size}",
};

const SCALES: Record<string, string> = {
  small: "87.5%",
  normal: "100%",
  large: "112.5%",
  larger: "125%",
};

export interface TextSizeControlProps {
  labels?: Partial<TextSizeControlLabels>;
  className?: string;
}

/**
 * An in-page text size control.
 *
 * Browser zoom scales everything including layout; this scales only type, by
 * setting the root font size — which is why every length in a component
 * library should be in `rem`. Readers with low vision, and anyone on a cheap
 * phone with a dense screen, adjust this far more often than analytics
 * suggest, because most sites do not offer it and they gave up asking.
 *
 * The choice persists, and is announced on change so it is confirmable
 * without seeing the result.
 */
export function TextSizeControl({ labels: labelOverrides, className }: TextSizeControlProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const [stored, setStored] = useStoredValue(STORAGE_KEY, "normal");
  const size = stored ?? "normal";

  // A real side effect on an external system — the document element outside
  // this component — which is what useEffect is for.
  useEffect(() => {
    document.documentElement.style.fontSize = SCALES[size] ?? SCALES.normal;
  }, [size]);

  const options = [
    { value: "small", label: labels.small },
    { value: "normal", label: labels.normal },
    { value: "large", label: labels.large },
    { value: "larger", label: labels.larger },
  ];

  return (
    <SegmentedControl
      label={labels.legend}
      options={options}
      value={size}
      onChange={(next) => {
        setStored(next);
        const chosen = options.find((option) => option.value === next);
        announce(labels.announcement.replace("{size}", chosen?.label ?? next), "polite");
      }}
      className={cn(className)}
    />
  );
}
