/**
 * Memoised `Intl` formatters.
 *
 * Constructing an `Intl.*Format` costs roughly a millisecond on a mid-range
 * phone — negligible once, ruinous inside a list of 200 rows. Every formatter
 * here is cached on its full option set.
 */

const cache = new Map<string, unknown>();

function memo<T>(kind: string, locale: string, options: object, create: () => T): T {
  const key = `${kind}:${locale}:${JSON.stringify(options)}`;

  const hit = cache.get(key);
  if (hit) return hit as T;

  const created = create();
  cache.set(key, created);
  return created;
}

export function numberFormat(
  locale: string,
  options: Intl.NumberFormatOptions = {},
): Intl.NumberFormat {
  return memo("number", locale, options, () => new Intl.NumberFormat(locale, options));
}

export function dateTimeFormat(
  locale: string,
  options: Intl.DateTimeFormatOptions = {},
): Intl.DateTimeFormat {
  return memo("date", locale, options, () => new Intl.DateTimeFormat(locale, options));
}

export function relativeTimeFormat(
  locale: string,
  options: Intl.RelativeTimeFormatOptions = {},
): Intl.RelativeTimeFormat {
  return memo("relative", locale, options, () => new Intl.RelativeTimeFormat(locale, options));
}

export function listFormat(
  locale: string,
  options: Intl.ListFormatOptions = {},
): Intl.ListFormat {
  return memo("list", locale, options, () => new Intl.ListFormat(locale, options));
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ["year", 365 * 24 * 60 * 60 * 1000],
  ["month", 30 * 24 * 60 * 60 * 1000],
  ["week", 7 * 24 * 60 * 60 * 1000],
  ["day", 24 * 60 * 60 * 1000],
  ["hour", 60 * 60 * 1000],
  ["minute", 60 * 1000],
  ["second", 1000],
];

/**
 * "3 days ago" / "منذ ٣ أيام" / "3 दिन पहले", picking the largest unit that
 * still describes the gap.
 */
export function formatRelative(
  value: Date | number,
  locale: string,
  now: Date | number = Date.now(),
  options: Intl.RelativeTimeFormatOptions = { numeric: "auto" },
): string {
  const delta = new Date(value).getTime() - new Date(now).getTime();
  const formatter = relativeTimeFormat(locale, options);

  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(delta) >= ms) {
      return formatter.format(Math.round(delta / ms), unit);
    }
  }

  return formatter.format(0, "second");
}

/** Clear the formatter cache. Only useful in tests. */
export function resetFormatCache(): void {
  cache.clear();
}
