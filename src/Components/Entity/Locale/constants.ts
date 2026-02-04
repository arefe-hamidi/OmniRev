import type { iLocale, iTextDirection } from "./types";

export const LOCALES = ["en", "fr"] as const;

export const DEFAULT_LOCALE: iLocale = "en";

export const LOCALE_COOKIE_NAME = "user-locale";

export const LOCALE_FULLNAME: Record<iLocale, string> = {
  en: "English",
  fr: "Français",
};

export const LOCALE_DIRECTION: Record<iLocale, iTextDirection> = {
  en: "ltr",
  fr: "ltr",
};
