import type { iContactFilters } from "./types"
import type { iDictionary } from "./i18n"

export type FilterBadgeItem = {
  key: keyof iContactFilters
  fieldLabel: string
  valueLabel: string
}

export function getActiveFilterBadges(
  filters: iContactFilters,
  defaultFilters: iContactFilters,
  dictionary: iDictionary
): FilterBadgeItem[] {
  const statusLabels: Record<string, string> = {
    potential: dictionary.filters.statusPotential,
    customer: dictionary.filters.statusCustomer,
    lapsed: dictionary.filters.statusLapsed,
  }
  const sourceLabels: Record<string, string> = {
    CRM: dictionary.filters.sourceCRM,
    Organic: dictionary.filters.sourceOrganic,
  }
  const categoryLabels: Record<string, string> = {
    education: dictionary.filters.categoryEducation,
    art: dictionary.filters.categoryArt,
    legal: dictionary.filters.categoryLegal,
    unknown: dictionary.filters.categoryUnknown,
    financial: dictionary.filters.categoryFinancial,
  }
  const sortByLabels: Record<string, string> = {
    total_order_amount: dictionary.filters.sortByOrderAmount,
    created_at: dictionary.filters.sortByCreatedAt,
  }
  const sortOrderLabels: Record<string, string> = {
    asc: dictionary.filters.sortAsc,
    desc: dictionary.filters.sortDesc,
  }

  const items: FilterBadgeItem[] = []
  if (filters.status && filters.status !== defaultFilters.status) {
    items.push({
      key: "status",
      fieldLabel: dictionary.filters.status,
      valueLabel: statusLabels[filters.status] ?? filters.status,
    })
  }
  if (filters.market?.trim() && filters.market !== defaultFilters.market) {
    items.push({
      key: "market",
      fieldLabel: dictionary.filters.market,
      valueLabel: filters.market.trim(),
    })
  }
  if (filters.source && filters.source !== defaultFilters.source) {
    items.push({
      key: "source",
      fieldLabel: dictionary.filters.source,
      valueLabel: sourceLabels[filters.source] ?? filters.source,
    })
  }
  if (filters.category && filters.category !== defaultFilters.category) {
    items.push({
      key: "category",
      fieldLabel: dictionary.filters.category,
      valueLabel: categoryLabels[filters.category] ?? filters.category,
    })
  }
  if (filters.created_at_after?.trim() && filters.created_at_after !== defaultFilters.created_at_after) {
    items.push({
      key: "created_at_after",
      fieldLabel: dictionary.filters.from,
      valueLabel: filters.created_at_after.trim(),
    })
  }
  if (filters.created_at_before?.trim() && filters.created_at_before !== defaultFilters.created_at_before) {
    items.push({
      key: "created_at_before",
      fieldLabel: dictionary.filters.to,
      valueLabel: filters.created_at_before.trim(),
    })
  }
  if (filters.sort_by && filters.sort_by !== defaultFilters.sort_by) {
    const valueLabel = sortByLabels[filters.sort_by] ?? filters.sort_by
    const orderLabel = sortOrderLabels[filters.sort_order]
    items.push({
      key: "sort_by",
      fieldLabel: dictionary.filters.sortBy,
      valueLabel: orderLabel ? `${valueLabel} (${orderLabel})` : valueLabel,
    })
  }
  return items
}
