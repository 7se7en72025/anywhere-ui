"use client";

import { createContext, useContext, useMemo } from "react";
import {
  getCalendar,
  getDirection,
  getFirstDayOfWeek,
  getNumberingSystem,
  type Direction,
} from "./locale";

export interface LocaleInfo {
  /** BCP 47 tag, e.g. `ar-EG`, `hi-IN`, `pt-BR`. */
  locale: string;
  direction: Direction;
  calendar: string;
  numberingSystem: string;
  /** 1 = Monday … 7 = Sunday. */
  firstDayOfWeek: number;
}

const LocaleContext = createContext<LocaleInfo | null>(null);

function describe(locale: string): LocaleInfo {
  return {
    locale,
    direction: getDirection(locale),
    calendar: getCalendar(locale),
    numberingSystem: getNumberingSystem(locale),
    firstDayOfWeek: getFirstDayOfWeek(locale),
  };
}

export interface LocaleProviderProps {
  /**
   * BCP 47 tag. Pass the locale you resolved on the server — reading it from
   * `navigator.language` on the client causes a hydration mismatch and a flash
   * of the wrong direction.
   */
  locale: string;
  children: React.ReactNode;
}

export function LocaleProvider({ locale, children }: LocaleProviderProps) {
  const value = useMemo(() => describe(locale), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

/**
 * Locale facts for the current subtree. Falls back to `en-US` when no provider
 * is present so a component dropped into an existing app still renders.
 */
export function useLocale(): LocaleInfo {
  const context = useContext(LocaleContext);
  const fallback = useMemo(() => describe("en-US"), []);

  return context ?? fallback;
}
