import { proxyFetch } from "@/lib/api/proxyFetch/proxyFetch"
import { apiRoute } from "@/lib/routes/utils"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import type {
  iContact,
  iContactUpdateRequest,
  iContactFilters,
} from "./types"

/** Convert YYYY-MM-DD to ISO 8601 start of day for created_at_after */
function toISOStartOfDay(dateStr: string): string {
  if (!dateStr?.trim()) return ""
  return `${dateStr.trim()}T00:00:00.000Z`
}

/** Convert YYYY-MM-DD to ISO 8601 end of day for created_at_before */
function toISOEndOfDay(dateStr: string): string {
  if (!dateStr?.trim()) return ""
  return `${dateStr.trim()}T23:59:59.999Z`
}

function buildListParams(
  page: number,
  perPage: number,
  search: string,
  filters: iContactFilters
): Record<string, string> {
  const params: Record<string, string> = {
    page: String(page),
    per_page: String(perPage),
  }
  if (search.trim()) params.q = search.trim()
  if (filters.status) params.status = filters.status
  if (filters.market?.trim()) params.market = filters.market.trim()
  if (filters.source) params.source = filters.source
  if (filters.category) params.category = filters.category
  if (filters.created_at_after?.trim())
    params.created_at_after = toISOStartOfDay(filters.created_at_after)
  if (filters.created_at_before?.trim())
    params.created_at_before = toISOEndOfDay(filters.created_at_before)
  if (filters.sort_by) {
    params.sort_by = filters.sort_by
    params.sort_order = filters.sort_order
  }
  return params
}

export function useGetContacts(
  page: number,
  perPage: number,
  search: string,
  filters: iContactFilters
) {
  const params = buildListParams(page, perPage, search, filters)
  const endpoint = apiRoute("CONTACT", "/", params)
  return useQuery({
    queryKey: ["contacts", endpoint, page, perPage, search, filters],
    queryFn: async () => {
      const res = await proxyFetch(endpoint)
      if (res.status === 404) return { results: [], count: 0 }
      if (!res.ok) throw res
      let body: unknown
      try {
        body = await res.json()
      } catch {
        return { results: [], count: 0 }
      }
      if (!body || typeof body !== "object") return { results: [], count: 0 }

      const obj = body as Record<string, unknown>
      // Some APIs wrap payload in { result: { data: {}, pagination } }
      const root = (obj.result ?? obj) as Record<string, unknown>
      let results: iContact[] = []
      let count = 0

      // Shape: { data: { data: [], pagination: { total } } }
      const inner = root.data as Record<string, unknown> | undefined
      if (inner && typeof inner === "object") {
        const arr = inner.data
        if (Array.isArray(arr)) {
          results = arr as iContact[]
          const pag = inner.pagination as { total?: number } | undefined
          count = typeof pag?.total === "number" ? pag.total : results.length
        }
      }

      // Fallback: { data: [], pagination: { total } }
      if (results.length === 0 && root.data !== undefined) {
        if (Array.isArray(root.data)) {
          results = root.data as iContact[]
          const pag = root.pagination as { total?: number } | undefined
          count = typeof pag?.total === "number" ? pag.total : results.length
        }
      }

      // Fallback: { results: [], count: n }
      if (results.length === 0 && Array.isArray(root.results)) {
        results = root.results as iContact[]
        count = typeof root.count === "number" ? root.count : results.length
      }

      return { results, count }
    },
    placeholderData: (prev) => prev,
  })
}

export function useUpdateContact() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: number | string; data: iContactUpdateRequest }) => {
      const endpoint = apiRoute("CONTACT", `/${String(id)}`)
      const res = await proxyFetch(endpoint, {
        method: "PUT",
        body: data,
      })
      if (!res.ok) throw res
      return (await res.json()) as iContact
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["contacts"] })
    },
  })
}
