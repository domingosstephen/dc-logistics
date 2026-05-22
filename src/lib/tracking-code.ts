import { countryPrefixes } from "@/i18n/config";

const CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no I/O/0/1

function randomChars(n: number): string {
  let result = "";
  for (let i = 0; i < n; i++) {
    result += CHARS[Math.floor(Math.random() * CHARS.length)];
  }
  return result;
}

export function generateTrackingCode(originCountry: string): string {
  const prefix =
    countryPrefixes[originCountry.toUpperCase()] || originCountry.toUpperCase().slice(0, 2);
  return `${prefix}-${randomChars(4)}-${randomChars(2)}`;
}
