import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  seo: {
    title: "OminRev",
    description: "Welcome to OminRev",
  },
  common: {
    welcome: "Welcome",
    home: "Home",
    about: "About",
    contact: "Contact",
  },
} satisfies iDictionaryBaseStructure;

const fr = {
  seo: {
    title: "OminRev",
    description: "Bienvenue sur OminRev",
  },
  common: {
    welcome: "Bienvenue",
    home: "Accueil",
    about: "À propos",
    contact: "Contact",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary = getDictionaryGenerator({ en, fr });
