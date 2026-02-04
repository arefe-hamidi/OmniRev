"use client"

import Button from "@/Components/Shadcn/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Shadcn/select"
import Input from "@/Components/Shadcn/input"
import type {
  DashboardDateRangePreset,
  DashboardFilters,
} from "../Market/types"

export interface DashboardFilterBarProps {
  filters: DashboardFilters
  onFiltersChange: (f: DashboardFilters) => void
  yesterdayLabel: string
  last7DaysLabel: string
  last30DaysLabel: string
  customLabel: string
  allMarketsLabel: string
  markets: string[]
}

export default function DashboardFilterBar({
  filters,
  onFiltersChange,
  yesterdayLabel,
  last7DaysLabel,
  last30DaysLabel,
  customLabel,
  allMarketsLabel,
  markets,
}: DashboardFilterBarProps) {
  const setPreset = (preset: DashboardDateRangePreset) => {
    onFiltersChange({ ...filters, dateRangePreset: preset })
  }

  const setMarket = (market: string) => {
    onFiltersChange({ ...filters, market })
  }

  const setCustomDates = (created_at_after: string, created_at_before: string) => {
    onFiltersChange({
      ...filters,
      dateRangePreset: "custom",
      created_at_after,
      created_at_before,
    })
  }

  const presets: { value: DashboardDateRangePreset; label: string }[] = [
    { value: "yesterday", label: yesterdayLabel },
    { value: "7d", label: last7DaysLabel },
    { value: "30d", label: last30DaysLabel },
    { value: "custom", label: customLabel },
  ]

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-1 rounded-lg border bg-muted/40 p-1">
        {presets.map(({ value, label }) => (
          <Button
            key={value}
            type="button"
            variant={filters.dateRangePreset === value ? "default" : "ghost"}
            size="sm"
            className="h-8 px-3 text-xs font-medium"
            onClick={() => setPreset(value)}
          >
            {label}
          </Button>
        ))}
      </div>

      {filters.dateRangePreset === "custom" && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            className="h-8 w-[130px] text-xs"
            value={filters.created_at_after}
            onChange={(e) =>
              setCustomDates(e.target.value, filters.created_at_before)
            }
            aria-label="From date"
          />
          <span className="text-muted-foreground">–</span>
          <Input
            type="date"
            className="h-8 w-[130px] text-xs"
            value={filters.created_at_before}
            onChange={(e) =>
              setCustomDates(filters.created_at_after, e.target.value)
            }
            aria-label="To date"
          />
        </div>
      )}

      <Select
        value={filters.market || "_all"}
        onValueChange={(v) => setMarket(v === "_all" ? "" : v)}
      >
        <SelectTrigger className="ml-auto h-8 w-[160px] border-muted-foreground/20 bg-background">
          <SelectValue placeholder={allMarketsLabel} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="_all">{allMarketsLabel}</SelectItem>
          {markets.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
