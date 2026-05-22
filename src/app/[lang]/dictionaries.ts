import "server-only";

const dictionaries = {
  it: () => import("@/i18n/messages/it.json").then((m) => m.default),
  en: () => import("@/i18n/messages/en.json").then((m) => m.default),
  de: () => import("@/i18n/messages/de.json").then((m) => m.default),
  es: () => import("@/i18n/messages/es.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;

export const locales = Object.keys(dictionaries) as Locale[];
export const defaultLocale: Locale = "it";

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
