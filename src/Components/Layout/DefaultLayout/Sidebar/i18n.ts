import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary";
import type { iDictionaryBaseStructure } from "@/Components/Entity/Locale/types";

const en = {
  nav: {
    dashboard: "Dashboard",
    contacts: "Contacts",
  },
  userInfo: {
    user: "User",
    notAvailable: "User info not available",
  },
} satisfies iDictionaryBaseStructure;

const fr = {
  nav: {
    dashboard: "Tableau de bord",
    contacts: "Contacts",
  },
  userInfo: {
    user: "Utilisateur",
    notAvailable: "Informations utilisateur non disponibles",
  },
} satisfies typeof en;

export type iDictionary = typeof en;
export const getDictionary: (locale: string) => iDictionary =
  getDictionaryGenerator({ en, fr });
