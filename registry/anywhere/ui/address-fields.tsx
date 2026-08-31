"use client";

import { Field } from "./field";
import { cn } from "../lib/cn";
import { useLocale } from "../lib/use-locale";

export interface AddressFieldsLabels {
  line1: string;
  line2: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

const DEFAULT_LABELS: AddressFieldsLabels = {
  line1: "Street address",
  line2: "Apartment, suite, etc.",
  city: "City",
  region: "State or province",
  postalCode: "Postal code",
  country: "Country",
};

type FieldKey = keyof AddressFieldsLabels;

/**
 * Field order by region, and whether a postal code is even asked for.
 *
 * Address format genuinely differs: the US puts city, then state, then ZIP;
 * the UK puts the postcode last on its own line; Japan writes largest-to-
 * smallest, postal code first. And a required "State or province" field is a
 * dead end in the many countries that have no such subdivision.
 */
const FORMATS: Record<string, { order: FieldKey[]; postalOptional?: boolean }> = {
  US: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  GB: { order: ["line1", "line2", "city", "postalCode", "country"] },
  JP: { order: ["postalCode", "region", "city", "line1", "line2", "country"] },
  DE: { order: ["line1", "line2", "postalCode", "city", "country"] },
  IN: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  IE: { order: ["line1", "line2", "city", "region", "postalCode", "country"], postalOptional: true },
  DEFAULT: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
};

const AUTOCOMPLETE: Record<FieldKey, string> = {
  line1: "address-line1",
  line2: "address-line2",
  city: "address-level2",
  region: "address-level1",
  postalCode: "postal-code",
  country: "country-name",
};

export interface AddressFieldsProps {
  /** ISO 3166-1 alpha-2 region. Defaults to the one in the active locale. */
  region?: string;
  labels?: Partial<AddressFieldsLabels>;
  className?: string;
}

/**
 * An address form whose field order follows the country being addressed.
 *
 * Most address forms are a US form with the labels translated: street, city,
 * state, ZIP, in that order, with every field required. That order is wrong in
 * most of the world, and "State" and "ZIP code" are not universal concepts.
 *
 * This orders fields per country, drops the ones that country does not use,
 * and marks only what is genuinely required. Labels remain props so a form can
 * use each country's own vocabulary rather than a translation of the American
 * one.
 */
export function AddressFields({ region, labels: labelOverrides, className }: AddressFieldsProps) {
  const labels = { ...DEFAULT_LABELS, ...labelOverrides };
  const { locale } = useLocale();

  const resolved = region ?? new Intl.Locale(locale).maximize().region ?? "DEFAULT";
  const format = FORMATS[resolved] ?? FORMATS.DEFAULT;

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {format.order.map((key) => (
        <Field
          key={key}
          name={key}
          label={labels[key]}
          autoComplete={AUTOCOMPLETE[key]}
          required={key === "line1" || key === "city" || (key === "postalCode" && !format.postalOptional)}
        />
      ))}
    </div>
  );
}
