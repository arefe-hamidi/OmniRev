import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { apiRoute } from "@/lib/routes/utils"
import { useQuery } from "@tanstack/react-query"
import type {
  CategoriesStatsResponse,
  CategoryChartItem,
  CategoryStatsParams,
} from "./types"

/** Parse percentage from number or string (e.g. "23%" or 23). Exported for tests. */
export function parsePercent(value: unknown): number {
  if (typeof value === "number" && !Number.isNaN(value)) return value
  const s = String(value ?? "").replace("%", "").trim()
  const n = parseFloat(s)
  return Number.isNaN(n) ? 0 : n
}

/** Parse categories stats API response into chart items. Exported for tests. */
export function parseStatsResponse(data: unknown): CategoryChartItem[] {
  if (!data || typeof data !== "object") return []
  if (Array.isArray(data)) {
    return data
      .map((item) => {
        if (!item || typeof item !== "object") return null
        const name = (item as { name?: unknown }).name
        const val = (item as { value?: unknown }).value
        if (name == null || name === "") return null
        return { name: String(name), value: parsePercent(val) }
      })
      .filter((x): x is CategoryChartItem => x !== null)
  }
  const raw = data as CategoriesStatsResponse
  return Object.entries(raw).map(([name, percentStr]) => ({
    name,
    value: parsePercent(percentStr),
  }))
}

function buildParams(params: CategoryStatsParams): Record<string, string> {
  const out: Record<string, string> = {}
  if (params.created_at_after) out.created_at_after = params.created_at_after
  if (params.created_at_before) out.created_at_before = params.created_at_before
  if (params.market?.trim()) out.market = params.market.trim()
  return out
}

export function useGetCategoriesStats(params: CategoryStatsParams) {
  const queryParams = buildParams(params)
  const endpoint = apiRoute("CATEGORIES", "/stats", queryParams)
  return useQuery({
    queryKey: ["categories", "stats", endpoint],
    queryFn: async () => {
      const res = await proxyFetch(endpoint)
      if (!res.ok) {
        throw new Error(`Categories stats failed: ${res.status}`)
      }
      let json: unknown
      try {
        json = await res.json()
      } catch {
        throw new Error("Categories stats: invalid JSON")
      }
      const data =
        (json as Record<string, unknown>)?.data ??
        (json as Record<string, unknown>)?.result ??
        (json as Record<string, unknown>)?.stats ??
        json
      return parseStatsResponse(data)
    },
  })
}
