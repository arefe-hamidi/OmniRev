/** Market option from /markets API (display string) */
export type MarketOption = string

/** Date range preset for dashboard global filter */
export type DashboardDateRangePreset = "yesterday" | "7d" | "30d" | "custom"

/** Global dashboard filters; changing these reloads both widgets with same params */
export interface DashboardFilters {
  dateRangePreset: DashboardDateRangePreset
  created_at_after: string
  created_at_before: string
  market: string
}
