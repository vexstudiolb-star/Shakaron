import type { Locale } from "./config";
import { en } from "./dictionaries/en";
import { ar } from "./dictionaries/ar";

export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
