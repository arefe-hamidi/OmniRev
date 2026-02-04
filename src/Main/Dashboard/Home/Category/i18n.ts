import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary"

const en = {
  title: "Companies",
  empty: "No category data",
  selectCategory: "Select category",
}

const fr = {
  title: "Entreprises",
  empty: "Aucune donnée de catégorie",
  selectCategory: "Choisir une catégorie",
}

export type CategoryDictionary = typeof en
export const getCategoryDictionary = getDictionaryGenerator({ en, fr })
