import "server-only";
import { locales, defaultLocale } from "@/i18n/config";

const dictionaries = {
  pt: () => import("@/i18n/messages/pt.json").then((m) => m.default),
  en: () => import("@/i18n/messages/en.json").then((m) => m.default),
};

export type Locale = keyof typeof dictionaries;
export type Dictionary = Awaited<ReturnType<(typeof dictionaries)[Locale]>>;

export { locales, defaultLocale };

export const hasLocale = (locale: string): locale is Locale =>
  locale in dictionaries;

export const getDictionary = async (locale: Locale) => dictionaries[locale]();
