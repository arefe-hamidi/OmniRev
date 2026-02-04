import { describe, expect, it } from "vitest"
import { getActiveFilterBadges } from "./filterBadges"
import type { iContactFilters } from "./types"
import type { iDictionary } from "./i18n"

function mockDictionary(overrides: Partial<iDictionary["filters"]> = {}): iDictionary {
  return {
    filters: {
      status: "Status",
      market: "Market",
      source: "Source",
      category: "Category",
      from: "From",
      to: "To",
      sortBy: "Sort by",
      statusPotential: "Potential",
      statusCustomer: "Customer",
      statusLapsed: "Lapsed",
      sourceCRM: "CRM",
      sourceOrganic: "Organic",
      categoryEducation: "Education",
      categoryArt: "Art",
      categoryLegal: "Legal",
      categoryUnknown: "Unknown",
      categoryFinancial: "Financial",
      sortByOrderAmount: "Total order amount",
      sortByCreatedAt: "Created at",
      sortAsc: "Ascending",
      sortDesc: "Descending",
      ...overrides,
    },
  } as iDictionary
}

const defaultFilters: iContactFilters = {
  status: "",
  market: "",
  source: "",
  category: "",
  created_at_after: "",
  created_at_before: "",
  sort_by: "",
  sort_order: "desc",
}

describe("getActiveFilterBadges", () => {
  it("returns empty array when filters match defaults", () => {
    const dict = mockDictionary()
    const result = getActiveFilterBadges(defaultFilters, defaultFilters, dict)
    expect(result).toEqual([])
  })

  it("returns badge for status when different from default", () => {
    const dict = mockDictionary()
    const filters: iContactFilters = { ...defaultFilters, status: "customer" }
    const result = getActiveFilterBadges(filters, defaultFilters, dict)
    expect(result).toHaveLength(1)
    expect(result[0].key).toBe("status")
    expect(result[0].fieldLabel).toBe("Status")
    expect(result[0].valueLabel).toBe("Customer")
  })

  it("returns badge for market when set", () => {
    const dict = mockDictionary()
    const filters: iContactFilters = { ...defaultFilters, market: "US" }
    const result = getActiveFilterBadges(filters, defaultFilters, dict)
    expect(result).toHaveLength(1)
    expect(result[0].key).toBe("market")
    expect(result[0].valueLabel).toBe("US")
  })

  it("returns badge for source when different from default", () => {
    const dict = mockDictionary()
    const filters: iContactFilters = { ...defaultFilters, source: "CRM" }
    const result = getActiveFilterBadges(filters, defaultFilters, dict)
    expect(result).toHaveLength(1)
    expect(result[0].key).toBe("source")
    expect(result[0].valueLabel).toBe("CRM")
  })

  it("returns badge for category when different from default", () => {
    const dict = mockDictionary()
    const filters: iContactFilters = { ...defaultFilters, category: "education" }
    const result = getActiveFilterBadges(filters, defaultFilters, dict)
    expect(result).toHaveLength(1)
    expect(result[0].key).toBe("category")
    expect(result[0].valueLabel).toBe("Education")
  })

  it("returns badges for date range when set", () => {
    const dict = mockDictionary()
    const filters: iContactFilters = {
      ...defaultFilters,
      created_at_after: "2025-01-01",
      created_at_before: "2025-01-31",
    }
    const result = getActiveFilterBadges(filters, defaultFilters, dict)
    expect(result).toHaveLength(2)
    expect(result.find((b) => b.key === "created_at_after")).toEqual({
      key: "created_at_after",
      fieldLabel: "From",
      valueLabel: "2025-01-01",
    })
    expect(result.find((b) => b.key === "created_at_before")).toEqual({
      key: "created_at_before",
      fieldLabel: "To",
      valueLabel: "2025-01-31",
    })
  })

  it("returns badge for sort_by with order label", () => {
    const dict = mockDictionary()
    const filters: iContactFilters = {
      ...defaultFilters,
      sort_by: "total_order_amount",
      sort_order: "desc",
    }
    const result = getActiveFilterBadges(filters, defaultFilters, dict)
    expect(result).toHaveLength(1)
    expect(result[0].key).toBe("sort_by")
    expect(result[0].valueLabel).toContain("Total order amount")
    expect(result[0].valueLabel).toContain("Descending")
  })

  it("returns multiple badges when multiple filters differ", () => {
    const dict = mockDictionary()
    const filters: iContactFilters = {
      ...defaultFilters,
      status: "potential",
      market: "EU",
      source: "Organic",
    }
    const result = getActiveFilterBadges(filters, defaultFilters, dict)
    expect(result).toHaveLength(3)
    const keys = result.map((b) => b.key)
    expect(keys).toContain("status")
    expect(keys).toContain("market")
    expect(keys).toContain("source")
  })
})
