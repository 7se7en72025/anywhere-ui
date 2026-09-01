"use client";

import type { Comparison } from "./comparison";
import { BidiText } from "@/registry/gear5/ui/bidi-text";
import { BytesText } from "@/registry/gear5/ui/bytes-text";
import { CharacterCounter } from "@/registry/gear5/ui/character-counter";
import { CompactNumber } from "@/registry/gear5/ui/compact-number";
import { CurrencyText } from "@/registry/gear5/ui/currency-text";
import { DateRangeText } from "@/registry/gear5/ui/date-range-text";
import { OrdinalText } from "@/registry/gear5/ui/ordinal-text";
import { PluralText } from "@/registry/gear5/ui/plural-text";
import { RelativeTime } from "@/registry/gear5/ui/relative-time";
import { TruncateText } from "@/registry/gear5/ui/truncate-text";

/*
  Every `naive` below is a real implementation of what is genuinely shipped,
  the K/M/B ladder, `parseFloat` on a formatted string, `.length` on a string
  with an emoji in it. None of them are strawmen, and none of the outputs are
  hardcoded: both sides compute at render time so a sceptical reader can check
  them in devtools.
*/

const NAMES = ["Zebra", "Ångström", "Élodie", "apple"];
const SAMPLE_TEXT = "Sunset over the sea 👨‍👩‍👧‍👦";
const RANGE_START = new Date("2026-01-01T00:00:00Z");
const RANGE_END = new Date("2026-01-05T00:00:00Z");
const THREE_DAYS_AGO = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);

/** The K/M/B ladder, as written in a thousand codebases. */
function naiveCompact(n: number): string {
  if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(1)}B`;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/** The st/nd/rd/th rule everyone writes, including its 11-13 bug. */
function naiveOrdinal(n: number): string {
  const last = n % 10;
  if (last === 1) return `${n}st`;
  if (last === 2) return `${n}nd`;
  if (last === 3) return `${n}rd`;
  return `${n}th`;
}

/** Bytes with an English unit glued on after a Latin-formatted number. */
function naiveBytes(bytes: number): string {
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export const COMPARISONS: Comparison[] = [
  {
    name: "compact-number",
    title: "CompactNumber",
    problem:
      "A K/M/B ladder is not how most of the world shortens numbers. India groups by lakh and crore; Japan and China group by ten-thousands.",
    naiveCode: "`${(n / 1e6).toFixed(1)}M`",
    locale: "hi-IN",
    localeName: "हिन्दी",
    naive: () => naiveCompact(1_234_567),
    correct: () => <CompactNumber value={1_234_567} exactLabel={false} />,
  },
  {
    name: "bidi-text",
    title: "BidiText",
    problem:
      "A right-to-left name next to a number pulls the number to the wrong side of it. Here the naive version renders the reply count before the name instead of after. The sentence reads backwards, and only for users with RTL names.",
    naiveCode: "<span>{name} - {n} replies</span>",
    locale: "ar-EG",
    localeName: "العربية",
    // Digits adjacent to an RTL run with a neutral between them is the case
    // that actually reorders; a name on its own in a sentence does not.
    naive: () => <span dir="ltr">إيان - 42 replies</span>,
    correct: () => (
      <span dir="ltr">
        <BidiText>إيان</BidiText> - 42 replies
      </span>
    ),
  },
  {
    name: "sortable-table",
    title: "SortableTable",
    problem:
      "Array#sort compares UTF-16 code points, not letters. Accented names file after Z, and lowercase files after uppercase.",
    naiveCode: "names.sort()",
    locale: "de-DE",
    localeName: "Deutsch",
    naive: () => [...NAMES].sort().join(" · "),
    // The same collator configuration the component sorts with.
    correct: () =>
      [...NAMES]
        .sort(new Intl.Collator("de-DE", { numeric: true, sensitivity: "base" }).compare)
        .join(" · "),
  },
  {
    name: "currency-field",
    title: "CurrencyField",
    problem:
      "parseFloat on a German-formatted amount silently truncates at the thousands separator. Twelve hundred euros becomes one euro twenty-three.",
    naiveCode: 'parseFloat("1.234,56")',
    locale: "de-DE",
    localeName: "Deutsch",
    naive: () => `€${Number.parseFloat("1.234,56").toFixed(2)}`,
    correct: () => <CurrencyText value={1234.56} currency="EUR" />,
  },
  {
    name: "truncate-text",
    title: "TruncateText",
    problem:
      "slice counts UTF-16 code units, so it cuts a family emoji in half and leaves the fragments to render as tofu.",
    naiveCode: "text.slice(0, 22)",
    locale: "en-US",
    localeName: "English",
    naive: () => `${SAMPLE_TEXT.slice(0, 22)}…`,
    correct: () => <TruncateText text={SAMPLE_TEXT} limit={22} />,
  },
  {
    name: "character-counter",
    title: "CharacterCounter",
    problem:
      "String#length counts code units. A user types one emoji and watches the counter jump by eleven, with no explanation.",
    naiveCode: "value.length",
    locale: "en-US",
    localeName: "English",
    naive: () => `${SAMPLE_TEXT.length} of 40`,
    correct: () => <CharacterCounter value={SAMPLE_TEXT} limit={40} />,
  },
  {
    name: "ordinal-text",
    title: "OrdinalText",
    problem:
      "The st/nd/rd/th rule breaks at 11, 12 and 13, and does not apply at all in languages that do not build ordinals from suffixes.",
    naiveCode: "n % 10 === 1 ? `${n}st` : …",
    locale: "en-US",
    localeName: "English",
    naive: () => [11, 12, 13, 21].map(naiveOrdinal).join(" · "),
    correct: () => (
      <>
        {[11, 12, 13, 21].map((n, index) => (
          <span key={n}>
            {index > 0 && " · "}
            <OrdinalText value={n} />
          </span>
        ))}
      </>
    ),
  },
  {
    name: "bytes-text",
    title: "BytesText",
    problem:
      "An English unit appended to a Latin-formatted number is wrong twice over: French writes the decimal with a comma and calls it Mo, not MB.",
    naiveCode: "`${(b / 1e6).toFixed(1)} MB`",
    locale: "fr-FR",
    localeName: "Français",
    naive: () => naiveBytes(5_400_000),
    correct: () => <BytesText bytes={5_400_000} />,
  },
  {
    name: "date-range-text",
    title: "DateRangeText",
    problem:
      "Joining two formatted dates with a dash repeats everything they share, and puts the separator where a right-to-left locale does not want it.",
    naiveCode: "`${fmt(a)} - ${fmt(b)}`",
    locale: "ja-JP",
    localeName: "日本語",
    naive: () => {
      const format = (d: Date) =>
        new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium" }).format(d);
      return `${format(RANGE_START)} - ${format(RANGE_END)}`;
    },
    correct: () => <DateRangeText start={RANGE_START} end={RANGE_END} />,
  },
  {
    name: "plural-text",
    title: "PluralText",
    problem:
      "count === 1 ? singular : plural assumes every language has exactly two plural forms. Russian has three, and Arabic has six.",
    naiveCode: "count === 1 ? 'файл' : 'файлы'",
    locale: "ru-RU",
    localeName: "Русский",
    naive: () => [1, 3, 5].map((n) => `${n} ${n === 1 ? "файл" : "файлы"}`).join(" · "),
    correct: () => (
      <>
        {[1, 3, 5].map((n, index) => (
          <span key={n}>
            {index > 0 && " · "}
            {n}{" "}
            <PluralText count={n} forms={{ one: "файл", few: "файла", many: "файлов", other: "файла" }} />
          </span>
        ))}
      </>
    ),
  },
  {
    name: "relative-time",
    title: "RelativeTime",
    problem:
      "A hand-built \"3 days ago\" is English-only and loses the exact timestamp, which a screen reader user can never hover to recover.",
    naiveCode: "`${days} days ago`",
    locale: "ar-EG",
    localeName: "العربية",
    naive: () => "3 days ago",
    correct: () => <RelativeTime value={THREE_DAYS_AGO} />,
  },
];
