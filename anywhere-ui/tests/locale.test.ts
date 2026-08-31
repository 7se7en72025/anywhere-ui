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
    ["ja-JP", "ltr"],
    ["pt-BR", "ltr"],
    ["sw-KE", "ltr"],
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
    for (const locale of ["en-US", "th-TH", "ar-SA", "fa-IR", "ja-JP"]) {
      expect(getCalendar(locale)).toMatch(/^[a-z]/);
    }
  });

  it("honours an explicit calendar in the tag", () => {
    expect(getCalendar("th-TH-u-ca-buddhist")).toBe("buddhist");
  });
});

describe("getFirstDayOfWeek", () => {
  it("returns a day in range for every locale", () => {
    for (const locale of ["en-US", "en-GB", "ar-EG", "hi-IN"]) {
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
