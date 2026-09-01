import { describe, expect, it } from "vitest";
import { getCalendar, getDirection, getFirstDayOfWeek } from "@/registry/anywhere/lib/locale";
import { formatRelative } from "@/registry/anywhere/lib/format";

describe("getDirection", () => {
  it.each([
    ["ar-EG", "rtl"],
    ["he-IL", "rtl"],
    ["fa-IR", "rtl"],
    ["ur-PK", "rtl"],
    ["ps-AF", "rtl"],
    ["ckb-IQ", "rtl"],
    ["dv-MV", "rtl"],
  ])("treats %s as right-to-left", (locale, expected) => {
    expect(getDirection(locale)).toBe(expected);
  });

  it.each([
    ["en-US", "ltr"],
    ["hi-IN", "ltr"],
    ["bn-BD", "ltr"],
    ["ta-IN", "ltr"],
    ["ja-JP", "ltr"],
    ["zh-CN", "ltr"],
    ["ko-KR", "ltr"],
    ["th-TH", "ltr"],
    ["vi-VN", "ltr"],
    ["tr-TR", "ltr"],
    ["ru-RU", "ltr"],
    ["el-GR", "ltr"],
    ["ka-GE", "ltr"],
    ["am-ET", "ltr"],
    ["pt-BR", "ltr"],
    ["sw-KE", "ltr"],
    ["yo-NG", "ltr"],
  ])("treats %s as left-to-right", (locale, expected) => {
    expect(getDirection(locale)).toBe(expected);
  });

  it("does not throw on a malformed tag", () => {
    expect(() => getDirection("not a locale!!")).not.toThrow();
    expect(getDirection("ar_nonsense")).toBe("rtl");
  });
});

describe("getCalendar", () => {
  it("returns a calendar identifier for every locale", () => {
    const locales = [
      "en-US", "es-ES", "pt-BR", "fr-FR", "de-DE", "ru-RU", "tr-TR",
      "ar-EG", "ar-SA", "he-IL", "fa-IR", "ur-PK",
      "hi-IN", "bn-BD", "ta-IN", "th-TH", "vi-VN",
      "zh-CN", "ja-JP", "ko-KR", "sw-KE", "am-ET",
    ];

    for (const locale of locales) {
      expect(getCalendar(locale), locale).toMatch(/^[a-z]/);
    }
  });

  it("honours an explicit calendar in the tag", () => {
    expect(getCalendar("th-TH-u-ca-buddhist")).toBe("buddhist");
  });
});

describe("getFirstDayOfWeek", () => {
  it("returns a day in range for every locale", () => {
    for (const locale of [
      "en-US", "en-GB", "ar-EG", "he-IL", "fa-IR", "hi-IN", "bn-BD",
      "th-TH", "ja-JP", "zh-CN", "ko-KR", "ru-RU", "pt-BR", "sw-KE",
    ]) {
      const day = getFirstDayOfWeek(locale);
      expect(day).toBeGreaterThanOrEqual(1);
      expect(day).toBeLessThanOrEqual(7);
    }
  });
});

describe("formatRelative", () => {
  const now = new Date("2026-06-15T12:00:00Z");

  it("picks the largest fitting unit", () => {
    const threeDaysAgo = new Date("2026-06-12T12:00:00Z");
    expect(formatRelative(threeDaysAgo, "en-US", now)).toBe("3 days ago");
  });

  it("localises into non-English locales", () => {
    const yesterday = new Date("2026-06-14T12:00:00Z");
    expect(formatRelative(yesterday, "es-ES", now)).toBe("ayer");
  });

  it("handles the present without falling through", () => {
    expect(formatRelative(now, "en-US", now)).toBe("now");
  });
});

describe("formatting across every locale the docs offer", () => {
  // The set the preview switcher exposes. If any of these throw or produce
  // empty output, a reader picking that language sees a broken component.
  const LOCALES = [
    "en-US", "es-ES", "pt-BR", "fr-FR", "de-DE", "ru-RU", "tr-TR",
    "ar-EG", "he-IL", "fa-IR", "ur-PK",
    "hi-IN", "bn-BD", "ta-IN", "th-TH", "vi-VN",
    "zh-CN", "ja-JP", "ko-KR", "sw-KE",
  ];

  it.each(LOCALES)("%s formats numbers, dates, and relative times", (locale) => {
    const date = new Date("2026-06-15T12:00:00Z");

    expect(new Intl.NumberFormat(locale).format(1234567.89)).not.toBe("");
    expect(
      new Intl.DateTimeFormat(locale, { dateStyle: "long", calendar: getCalendar(locale) }).format(date),
    ).not.toBe("");
    expect(formatRelative(new Date("2026-06-12T12:00:00Z"), locale, date)).not.toBe("");
    expect(new Intl.NumberFormat(locale, { notation: "compact" }).format(1234567)).not.toBe("");
  });

  it.each(LOCALES)("%s resolves a direction and a collator", (locale) => {
    expect(["ltr", "rtl"]).toContain(getDirection(locale));
    expect(new Intl.Collator(locale).compare("a", "b")).toBeLessThan(0);
  });
});
