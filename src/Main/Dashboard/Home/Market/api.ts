import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { apiRoute } from "@/lib/routes/utils"
import { useQuery } from "@tanstack/react-query"
import type { iContact } from "@/Main/Dashboard/Contacts/types"
import type { CategoryStatsParams } from "../Category/types"
import type { DashboardFilters, MarketOption } from "./types"

function toISOStartOfDay(dateStr: string): string {
  if (!dateStr?.trim()) return ""
  return `${dateStr.trim()}T00:00:00.000Z`
}

function toISOEndOfDay(dateStr: string): string {
  if (!dateStr?.trim()) return ""
  return `${dateStr.trim()}T23:59:59.999Z`
}

export function getEffectiveDateRange(filters: DashboardFilters): {
  created_at_after: string
  created_at_before: string
} {
  const now = new Date()
  const toYYYYMMDD = (d: Date) => d.toISOString().slice(0, 10)

  if (filters.dateRangePreset === "yesterday") {
    const y = new Date(now)
    y.setUTCDate(y.getUTCDate() - 1)
    const day = toYYYYMMDD(y)
    return {
      created_at_after: toISOStartOfDay(day),
      created_at_before: toISOEndOfDay(day),
    }
  }
  if (filters.dateRangePreset === "7d") {
    const start = new Date(now)
    start.setUTCDate(start.getUTCDate() - 7)
    return {
      created_at_after: toISOStartOfDay(toYYYYMMDD(start)),
      created_at_before: toISOEndOfDay(toYYYYMMDD(now)),
    }
  }
  if (filters.dateRangePreset === "30d") {
    const start = new Date(now)
    start.setUTCDate(start.getUTCDate() - 30)
    return {
      created_at_after: toISOStartOfDay(toYYYYMMDD(start)),
      created_at_before: toISOEndOfDay(toYYYYMMDD(now)),
    }
  }
  return {
    created_at_after: filters.created_at_after?.trim()
      ? toISOStartOfDay(filters.created_at_after)
      : "",
    created_at_before: filters.created_at_before?.trim()
      ? toISOEndOfDay(filters.created_at_before)
      : "",
  }
}

export function buildStatsParams(filters: DashboardFilters): CategoryStatsParams {
  const { created_at_after, created_at_before } = getEffectiveDateRange(filters)
  const params: CategoryStatsParams = {}
  if (created_at_after) params.created_at_after = created_at_after
  if (created_at_before) params.created_at_before = created_at_before
  if (filters.market?.trim()) params.market = filters.market.trim()
  return params
}

/** Parse various API response shapes into a flat list of contacts (for tests and useGetTopContacts). */
export function parseContactsResponse(body: unknown): iContact[] {
  if (!body || typeof body !== "object") return []
  const obj = body as Record<string, unknown>
  const root = (obj.result ?? obj) as Record<string, unknown>
  let results: iContact[] = []
  const inner = root.data as Record<string, unknown> | undefined
  if (inner && typeof inner === "object" && Array.isArray(inner.data)) {
    results = inner.data as iContact[]
  }
  if (results.length === 0 && Array.isArray(root.data)) {
    results = root.data as iContact[]
  }
  if (results.length === 0 && Array.isArray(root.results)) {
    results = root.results as iContact[]
  }
  return results
}

export function useGetTopContacts(filters: DashboardFilters) {
  const { created_at_after, created_at_before } = getEffectiveDateRange(filters)
  const params: Record<string, string> = {
    page: "1",
    per_page: "10",
    sort_by: "total_order_amount",
    sort_order: "desc",
  }
  if (created_at_after) params.created_at_after = created_at_after
  if (created_at_before) params.created_at_before = created_at_before
  if (filters.market?.trim()) params.market = filters.market.trim()
  const endpoint = apiRoute("CONTACT", "/", params)

  return useQuery({
    queryKey: ["contacts", "top", endpoint],
    queryFn: async () => {
      const res = await proxyFetch(endpoint)
      if (res.status === 404 || !res.ok) return []
      let body: unknown
      try {
        body = await res.json()
      } catch {
        return []
      }
      return parseContactsResponse(body)
    },
  })
}

export function useGetMarkets() {
  const endpoint = apiRoute("MARKETS", "/")
  return useQuery({
    queryKey: ["markets", endpoint],
    queryFn: async (): Promise<MarketOption[]> => {
      const res = await proxyFetch(endpoint)
      if (!res.ok) return []
      let json: unknown
      try {
        json = await res.json()
      } catch {
        return []
      }
      const raw = (json as Record<string, unknown>)?.data ?? json
      if (Array.isArray(raw)) {
        return raw
          .map((x) =>
            typeof x === "string"
              ? x
              : (x as { name?: string; id?: string })?.name ??
                String((x as { id?: string }).id ?? "")
          )
          .filter(Boolean)
      }
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        return Object.values(raw).filter(
          (v): v is string => typeof v === "string"
        )
      }
      return []
    },
  })
}
