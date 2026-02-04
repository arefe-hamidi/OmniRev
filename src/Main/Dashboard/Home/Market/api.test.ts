import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"
import {
  buildStatsParams,
  getEffectiveDateRange,
  parseContactsResponse,
} from "./api"
import type { DashboardFilters } from "./types"

describe("getEffectiveDateRange", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2025-02-04T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("returns yesterday range when preset is yesterday", () => {
    const filters: DashboardFilters = {
      dateRangePreset: "yesterday",
      created_at_after: "",
      created_at_before: "",
      market: "",
    }
    const result = getEffectiveDateRange(filters)
    expect(result.created_at_after).toBe("2025-02-03T00:00:00.000Z")
    expect(result.created_at_before).toBe("2025-02-03T23:59:59.999Z")
  })

  it("returns last 7 days when preset is 7d", () => {
    const filters: DashboardFilters = {
      dateRangePreset: "7d",
      created_at_after: "",
      created_at_before: "",
      market: "",
    }
    const result = getEffectiveDateRange(filters)
    expect(result.created_at_after).toBe("2025-01-28T00:00:00.000Z")
    expect(result.created_at_before).toBe("2025-02-04T23:59:59.999Z")
  })

  it("returns last 30 days when preset is 30d", () => {
    const filters: DashboardFilters = {
      dateRangePreset: "30d",
      created_at_after: "",
      created_at_before: "",
      market: "",
    }
    const result = getEffectiveDateRange(filters)
    expect(result.created_at_after).toBe("2025-01-05T00:00:00.000Z")
    expect(result.created_at_before).toBe("2025-02-04T23:59:59.999Z")
  })

  it("returns custom dates when preset is custom", () => {
    const filters: DashboardFilters = {
      dateRangePreset: "custom",
      created_at_after: "2025-01-10",
      created_at_before: "2025-01-20",
      market: "",
    }
    const result = getEffectiveDateRange(filters)
    expect(result.created_at_after).toBe("2025-01-10T00:00:00.000Z")
    expect(result.created_at_before).toBe("2025-01-20T23:59:59.999Z")
  })

  it("returns empty strings for custom when dates are blank", () => {
    const filters: DashboardFilters = {
      dateRangePreset: "custom",
      created_at_after: "",
      created_at_before: "",
      market: "",
    }
    const result = getEffectiveDateRange(filters)
    expect(result.created_at_after).toBe("")
    expect(result.created_at_before).toBe("")
  })
})

describe("buildStatsParams", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date("2025-02-04T12:00:00.000Z"))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it("includes date range and market when set", () => {
    const filters: DashboardFilters = {
      dateRangePreset: "custom",
      created_at_after: "2025-01-01",
      created_at_before: "2025-01-31",
      market: "US",
    }
    const result = buildStatsParams(filters)
    expect(result.created_at_after).toBe("2025-01-01T00:00:00.000Z")
    expect(result.created_at_before).toBe("2025-01-31T23:59:59.999Z")
    expect(result.market).toBe("US")
  })

  it("omits empty market and uses preset dates", () => {
    const filters: DashboardFilters = {
      dateRangePreset: "yesterday",
      created_at_after: "",
      created_at_before: "",
      market: "",
    }
    const result = buildStatsParams(filters)
    expect(result.created_at_after).toBe("2025-02-03T00:00:00.000Z")
    expect(result.created_at_before).toBe("2025-02-03T23:59:59.999Z")
    expect(result.market).toBeUndefined()
  })
})

describe("parseContactsResponse", () => {
  it("returns empty array for null or non-object", () => {
    expect(parseContactsResponse(null)).toEqual([])
    expect(parseContactsResponse(undefined)).toEqual([])
    expect(parseContactsResponse("string")).toEqual([])
    expect(parseContactsResponse(42)).toEqual([])
  })

  it("parses { data: { data: [...] } } shape", () => {
    const body = {
      data: {
        data: [
          { id: "1", email: "a@test.com", first_name: "A" },
          { id: "2", email: "b@test.com" },
        ],
      },
    }
    const result = parseContactsResponse(body)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ id: "1", email: "a@test.com", first_name: "A" })
    expect(result[1]).toEqual({ id: "2", email: "b@test.com" })
  })

  it("parses { data: [...] } shape when inner data is not array", () => {
    const body = { data: [{ id: "1", email: "x@test.com" }] }
    const result = parseContactsResponse(body)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ id: "1", email: "x@test.com" })
  })

  it("parses { results: [...] } shape", () => {
    const body = { results: [{ id: "r1", email: "r@test.com" }] }
    const result = parseContactsResponse(body)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ id: "r1", email: "r@test.com" })
  })

  it("parses { result: { data: { data: [...] } } } shape", () => {
    const body = {
      result: {
        data: {
          data: [{ id: "1", email: "one@test.com" }],
        },
      },
    }
    const result = parseContactsResponse(body)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ id: "1", email: "one@test.com" })
  })
})
