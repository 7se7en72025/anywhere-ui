/**
 * Locale facts that UI actually needs, derived from the platform where
 * possible and from a curated table where the platform is silent.
 */

export type Direction = "ltr" | "rtl";

/**
 * Scripts written right-to-left, by ISO 639 code. `Intl.Locale#getTextInfo`
 * answers this correctly but is not available everywhere yet, so this table is
 * the fallback. Codes cover the RTL languages with real-world web traffic:
 * Arabic, Hebrew, Persian, Urdu, Pashto, Sindhi, Uyghur, Yiddish, Dhivehi,
 * Central Kurdish, N'Ko, Syriac, Samaritan, Mandaic, Rohingya, Fula Adlam.
 */
const RTL_LANGUAGES = new Set([
  "ar",
  "arc",
  "ckb",
  "dv",
  "fa",
  "ff",
  "he",
  "iw",
  "ku",
  "mzn",
  "nqo",
  "pnb",
  "ps",
  "sd",
  "syr",
  "ug",
  "ur",
  "yi",
]);

/** Scripts that are RTL regardless of the language subtag. */
const RTL_SCRIPTS = new Set(["Arab", "Hebr", "Thaa", "Syrc", "Nkoo", "Adlm", "Samr", "Mand"]);

/**
 * Resolve writing direction for a BCP 47 tag.
 *
 * Uses `Intl.Locale#getTextInfo` when the runtime provides it (the only source
 * that is correct for every tag, including ones we have never heard of), and
 * falls back to script- then language-subtag matching.
 */
export function getDirection(locale: string): Direction {
  try {
    const resolved = new Intl.Locale(locale) as Intl.Locale & {
      getTextInfo?: () => { direction?: string };
      textInfo?: { direction?: string };
    };

    const direction =
      resolved.getTextInfo?.().direction ?? resolved.textInfo?.direction;
    if (direction === "rtl" || direction === "ltr") return direction;

    const maximized = resolved.maximize?.();
    if (maximized?.script && RTL_SCRIPTS.has(maximized.script)) return "rtl";
    if (resolved.language && RTL_LANGUAGES.has(resolved.language)) return "rtl";

    return "ltr";
  } catch {
    // Malformed tag — fall back to a plain prefix check rather than throwing
    // and taking the whole page down over a bad locale string.
    const language = locale.toLowerCase().split(/[-_]/)[0];
    return RTL_LANGUAGES.has(language) ? "rtl" : "ltr";
  }
}

/**
 * The calendar the locale actually uses, e.g. `islamic-umalqura` for `ar-SA`,
 * `buddhist` for `th-TH`, `persian` for `fa-IR`. Passing this to
 * `Intl.DateTimeFormat` is the difference between a date a user recognises and
 * one they have to convert in their head.
 */
export function getCalendar(locale: string): string {
  try {
    const resolved = new Intl.Locale(locale) as Intl.Locale & {
      getCalendars?: () => string[];
      calendars?: string[];
    };

    return (
      resolved.calendar ??
      resolved.getCalendars?.()[0] ??
      resolved.calendars?.[0] ??
      "gregory"
    );
  } catch {
    return "gregory";
  }
}

/**
 * The locale's own digits, e.g. `arab` (٠١٢) for `ar-EG`, `deva` (०१२) for
 * `hi-IN` when requested explicitly.
 */
export function getNumberingSystem(locale: string): string {
  try {
    return new Intl.NumberFormat(locale).resolvedOptions().numberingSystem;
  } catch {
    return "latn";
  }
}

/** First day of the week (1 = Monday … 7 = Sunday), per the locale. */
export function getFirstDayOfWeek(locale: string): number {
  try {
    const resolved = new Intl.Locale(locale) as Intl.Locale & {
      getWeekInfo?: () => { firstDay?: number };
      weekInfo?: { firstDay?: number };
    };

    return resolved.getWeekInfo?.().firstDay ?? resolved.weekInfo?.firstDay ?? 1;
  } catch {
    return 1;
  }
}
