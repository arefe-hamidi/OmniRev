import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  logo: "OminRev",
  logout: "Logout",
} satisfies iDictionaryBaseStructure;

const fr = {
  logo: "OminRev",
  logout: "Déconnexion",
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary: (locale: string) => iDictionary =
  getDictionaryGenerator({ en, fr });
