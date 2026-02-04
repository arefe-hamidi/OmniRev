import { describe, expect, it } from "vitest"
import { parsePercent, parseStatsResponse } from "./api"

describe("parsePercent", () => {
  it("returns number as-is when valid", () => {
    expect(parsePercent(0)).toBe(0)
    expect(parsePercent(23)).toBe(23)
    expect(parsePercent(100)).toBe(100)
    expect(parsePercent(23.5)).toBe(23.5)
  })

  it("returns 0 for NaN number", () => {
    expect(parsePercent(Number.NaN)).toBe(0)
  })

  it("parses string without percent sign", () => {
    expect(parsePercent("23")).toBe(23)
    expect(parsePercent(" 50 ")).toBe(50)
  })

  it("parses string with percent sign", () => {
    expect(parsePercent("23%")).toBe(23)
    expect(parsePercent("100%")).toBe(100)
  })

  it("returns 0 for invalid string", () => {
    expect(parsePercent("")).toBe(0)
    expect(parsePercent("abc")).toBe(0)
    expect(parsePercent(null)).toBe(0)
    expect(parsePercent(undefined)).toBe(0)
  })
})

describe("parseStatsResponse", () => {
  it("returns empty array for null or non-object", () => {
    expect(parseStatsResponse(null)).toEqual([])
    expect(parseStatsResponse(undefined)).toEqual([])
    expect(parseStatsResponse("x")).toEqual([])
  })

  it("parses array of { name, value } items", () => {
    const data = [
      { name: "Education", value: 25 },
      { name: "Art", value: "15%" },
    ]
    const result = parseStatsResponse(data)
    expect(result).toHaveLength(2)
    expect(result[0]).toEqual({ name: "Education", value: 25 })
    expect(result[1]).toEqual({ name: "Art", value: 15 })
  })

  it("skips items with missing or empty name", () => {
    const data = [
      { name: "A", value: 10 },
      { name: "", value: 20 },
      { value: 30 },
    ]
    const result = parseStatsResponse(data)
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({ name: "A", value: 10 })
  })

  it("parses record (object) shape with category names as keys", () => {
    const data = {
      Education: "25",
      Art: "18%",
      Legal: 12,
    }
    const result = parseStatsResponse(data)
    expect(result).toHaveLength(3)
    expect(result).toContainEqual({ name: "Education", value: 25 })
    expect(result).toContainEqual({ name: "Art", value: 18 })
    expect(result).toContainEqual({ name: "Legal", value: 12 })
  })
})
