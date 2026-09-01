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
 * Field order by country, and which fields that country actually uses.
 *
 * Address format genuinely differs, and the differences are not cosmetic:
 *
 * - Anglophone and most European formats run smallest-to-largest, but disagree
 *   on where the postal code sits — the UK puts it last on its own line, most
 *   of Europe puts it immediately before the city.
 * - East Asian formats run largest-to-smallest, postal code first.
 * - Many countries have no postal code at all, and a required field for one is
 *   a dead end; `noPostal` drops it rather than asking for something that does
 *   not exist.
 * - "State or province" is not universal either. `noRegion` drops it for the
 *   many countries with no such subdivision, instead of making users invent one.
 *
 * Coverage is by population and web traffic rather than alphabetical: the list
 * below covers the large majority of people who will ever fill in this form,
 * and `DEFAULT` is a reasonable smallest-to-largest fallback for the rest. It
 * is not, and does not claim to be, all ~200 countries — a wrong entry is
 * worse than falling back, so countries are added when someone who lives there
 * confirms the order.
 */
const FORMATS: Record<
  string,
  { order: FieldKey[]; postalOptional?: boolean; noPostal?: boolean; noRegion?: boolean }
> = {
  // Smallest-to-largest, postal code after the region.
  US: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  CA: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  AU: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  IN: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  BR: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  MX: { order: ["line1", "line2", "postalCode", "city", "region", "country"] },
  ID: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  MY: { order: ["line1", "line2", "postalCode", "city", "region", "country"] },
  PH: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  TH: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  IT: { order: ["line1", "line2", "postalCode", "city", "region", "country"] },
  ES: { order: ["line1", "line2", "postalCode", "city", "region", "country"] },
  TR: { order: ["line1", "line2", "postalCode", "city", "region", "country"] },
  RU: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  UA: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  ZA: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  EG: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },
  SA: { order: ["line1", "line2", "city", "region", "postalCode", "country"] },

  // Postal code last, on its own line.
  GB: { order: ["line1", "line2", "city", "postalCode", "country"], noRegion: true },
  IE: {
    order: ["line1", "line2", "city", "region", "postalCode", "country"],
    postalOptional: true,
  },

  // Postal code before the city; no state-level subdivision in the address.
  DE: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  FR: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  NL: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  BE: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  PL: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  SE: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  NO: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  DK: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  FI: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  AT: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  CH: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },
  PT: { order: ["line1", "line2", "postalCode", "city", "country"], noRegion: true },

  // Largest-to-smallest, postal code first.
  JP: { order: ["postalCode", "region", "city", "line1", "line2", "country"] },
  CN: { order: ["postalCode", "region", "city", "line1", "line2", "country"] },
  KR: { order: ["postalCode", "region", "city", "line1", "line2", "country"] },
  TW: { order: ["postalCode", "region", "city", "line1", "line2", "country"] },

  // No postal code in use.
  NG: { order: ["line1", "line2", "city", "region", "country"], noPostal: true },
  KE: { order: ["line1", "line2", "city", "region", "country"], noPostal: true },
  GH: { order: ["line1", "line2", "city", "region", "country"], noPostal: true },
  TZ: { order: ["line1", "line2", "city", "region", "country"], noPostal: true },
  UG: { order: ["line1", "line2", "city", "region", "country"], noPostal: true },
  AE: { order: ["line1", "line2", "city", "region", "country"], noPostal: true },
  HK: { order: ["line1", "line2", "city", "region", "country"], noPostal: true },

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

  const omitted = new Set<FieldKey>([
    ...(format.noPostal ? (["postalCode"] as FieldKey[]) : []),
    ...(format.noRegion ? (["region"] as FieldKey[]) : []),
  ]);

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {format.order
        .filter((key) => !omitted.has(key))
        .map((key) => (
          <Field
            key={key}
            name={key}
            label={labels[key]}
            autoComplete={AUTOCOMPLETE[key]}
            required={
              key === "line1" ||
              key === "city" ||
              (key === "postalCode" && !format.postalOptional)
            }
          />
        ))}
    </div>
  );
}
