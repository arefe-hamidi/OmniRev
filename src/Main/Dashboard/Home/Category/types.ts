/** API response: keys = category names, values = percentage strings e.g. "23%" */
export type CategoriesStatsResponse = Record<string, string>

/** Chart data item: name (category), value (numeric percentage), optional fill for color */
export type CategoryChartItem = {
  name: string
  value: number
  fill?: string
}

/** Params for /categories/stats (date range + market); built from dashboard filters in Home */
export interface CategoryStatsParams {
  created_at_after?: string
  created_at_before?: string
  market?: string
}
