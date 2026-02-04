import { getDictionaryGenerator } from "@/Components/Entity/Locale/dictionary"

const en = {
  market: "Market",
  selectMarket: "Select market",
}

const fr = {
  market: "Marché",
  selectMarket: "Choisir un marché",
}

export type MarketDictionary = typeof en
export const getMarketDictionary = getDictionaryGenerator({ en, fr })
