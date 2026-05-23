export const locales = ["it", "en", "de", "es"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "it";

export const localeNames: Record<Locale, string> = {
  it: "Italiano",
  en: "English",
  de: "Deutsch",
  es: "Espanol",
};

// Country code to tracking prefix mapping
export const countryPrefixes: Record<string, string> = {
  // Europe
  IT: "IT", DE: "DE", FR: "FR", ES: "ES", AT: "AT", CH: "CH",
  NL: "NL", BE: "BE", PT: "PT", HR: "HR", SI: "SI", GR: "GR",
  PL: "PL", CZ: "CZ", HU: "HU", RO: "RO", BG: "BG", GB: "GB",
  // Americas
  US: "US", CA: "CA", MX: "MX", CR: "CR", PA: "PA", DO: "DO",
  BR: "BR", AR: "AR", CO: "CO", CL: "CL", PE: "PE", EC: "EC",
  UY: "UY", VE: "VE", PY: "PY", BO: "BO",
};
