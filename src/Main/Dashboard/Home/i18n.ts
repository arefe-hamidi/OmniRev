import type { iLocale } from "@/Components/Entity/Locale/types"
import { getCategoryDictionary } from "./Category/i18n"
import { getMarketDictionary } from "./Market/i18n"

const en = {
  title: "Dashboard",
  welcome: "Welcome",
  filters: {
    allMarkets: "All markets",
    dateRange: "Date range",
    yesterday: "Yesterday",
    last7Days: "7 Days",
    last30Days: "30 Days",
    custom: "Custom range",
    market: "Market",
    selectMarket: "Select market",
  },
  highValueCustomers: {
    title: "High-Value Customers",
    empty: "No customers to show",
    totalOrderAmount: "Total order amount",
    columnName: "Name",
    columnSales: "Sales",
  },
}

const fr = {
  title: "Tableau de bord",
  welcome: "Bienvenue",
  filters: {
    allMarkets: "Tous les marchés",
    dateRange: "Période",
    yesterday: "Hier",
    last7Days: "7 jours",
    last30Days: "30 jours",
    custom: "Plage personnalisée",
    market: "Marché",
    selectMarket: "Choisir un marché",
  },
  highValueCustomers: {
    title: "Clients à forte valeur",
    empty: "Aucun client à afficher",
    totalOrderAmount: "Montant total des commandes",
    columnName: "Nom",
    columnSales: "Ventes",
  },
}

function buildDictionary(locale: iLocale) {
  const base = locale === "fr" ? fr : en
  const category = getCategoryDictionary(locale)
  const market = getMarketDictionary(locale)
  return {
    ...base,
    categoriesChart: {
      title: category.title,
      empty: category.empty,
      selectCategory: category.selectCategory,
    },
    filters: {
      ...base.filters,
      market: market.market,
      selectMarket: market.selectMarket,
    },
  }
}

export type DashboardDictionary = ReturnType<typeof buildDictionary>
export const getDictionary = buildDictionary
