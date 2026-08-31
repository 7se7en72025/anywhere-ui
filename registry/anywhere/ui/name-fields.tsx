"use client";

import { Field } from "./field";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface NameFieldsLabels {
  given: string;
  family: string;
}

const DEFAULT_LABELS: NameFieldsLabels = {
  given: "First name",
  family: "Last name",
};

/**
 * Locales that write the family name first. Not an exhaustive list of every
 * such language, but the ones with enough web traffic that getting them
 * backwards is a visible, repeated insult rather than an edge case.
 */
const FAMILY_FIRST = new Set(["ja", "ko", "zh", "hu", "vi", "yue"]);

export interface NameFieldsProps {
  labels?: Partial<NameFieldsLabels>;
  required?: boolean;
  className?: string;
}

/**
 * Given-name and family-name inputs, ordered the way the reader's locale
 * orders them.
 *
 * A form that hardcodes "First name" then "Last name" asks half the world to
 * enter their name backwards, or to decide which of their names the form
 * considers "first". Order here follows the locale; the labels stay props, so
 * a Japanese form can say 姓 and 名 rather than translated Anglocentric ones.
 *
 * `autoComplete` is `given-name`/`family-name` regardless of visual order —
 * those tokens are semantic, not positional, and password managers rely on it.
 */
export function NameFields({ labels: labelOverrides, required, className }: NameFieldsProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { locale } = useLocale();

  const language = locale.toLowerCase().split(/[-_]/)[0];
  const familyFirst = FAMILY_FIRST.has(language);

  const given = (
    <Field
      key="given"
      name="givenName"
      label={labels.given}
      autoComplete="given-name"
      required={required}
    />
  );

  const family = (
    <Field
      key="family"
      name="familyName"
      label={labels.family}
      autoComplete="family-name"
      required={required}
    />
  );

  return (
    <div className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {familyFirst ? [family, given] : [given, family]}
    </div>
  );
}
