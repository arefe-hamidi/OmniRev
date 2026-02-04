"use client"

import type {
  iContactFilters,
  iContactSource,
  iContactCategory,
  iContactStatus,
  iContactSortBy,
  iContactSortOrder,
} from "../types"
import type { iDictionary } from "../i18n"
import Button from "@/Components/Shadcn/button"
import Input from "@/Components/Shadcn/input"
import Label from "@/Components/Shadcn/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Shadcn/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/Components/Shadcn/sheet"

interface iProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  filters: iContactFilters
  setFilters: (f: iContactFilters | ((prev: iContactFilters) => iContactFilters)) => void
  dictionary: iDictionary
  defaultFilters: iContactFilters
  onApply?: () => void
}

export default function ContactFiltersSheet({
  open,
  onOpenChange,
  filters,
  setFilters,
  dictionary,
  defaultFilters,
  onApply,
}: iProps) {
  const handleClear = () => {
    setFilters(defaultFilters)
    onOpenChange(false)
  }

  const handleApply = () => {
    onApply?.()
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full max-h-dvh flex-col overflow-hidden sm:max-w-md"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle>{dictionary.filters.label}</SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-6">
          <div className="space-y-4 py-6">
            <div className="space-y-2">
            <Label>{dictionary.filters.status}</Label>
            <Select
              value={filters.status || "any"}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, status: (v === "any" ? "" : v) as iContactStatus }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={dictionary.filters.any} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{dictionary.filters.any}</SelectItem>
                <SelectItem value="potential">{dictionary.filters.statusPotential}</SelectItem>
                <SelectItem value="customer">{dictionary.filters.statusCustomer}</SelectItem>
                <SelectItem value="lapsed">{dictionary.filters.statusLapsed}</SelectItem>
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-market">{dictionary.filters.market}</Label>
              <Input
              id="filter-market"
              value={filters.market}
              onChange={(e) =>
                setFilters((f) => ({ ...f, market: e.target.value }))
              }
              placeholder={dictionary.filters.market}
              className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label>{dictionary.filters.source}</Label>
              <Select
              value={filters.source || "any"}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, source: (v === "any" ? "" : v) as iContactSource }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={dictionary.filters.any} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{dictionary.filters.any}</SelectItem>
                <SelectItem value="CRM">{dictionary.filters.sourceCRM}</SelectItem>
                <SelectItem value="Organic">{dictionary.filters.sourceOrganic}</SelectItem>
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
              <Label>{dictionary.filters.category}</Label>
              <Select
              value={filters.category || "any"}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, category: (v === "any" ? "" : v) as iContactCategory }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={dictionary.filters.any} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{dictionary.filters.any}</SelectItem>
                <SelectItem value="education">{dictionary.filters.categoryEducation}</SelectItem>
                <SelectItem value="art">{dictionary.filters.categoryArt}</SelectItem>
                <SelectItem value="legal">{dictionary.filters.categoryLegal}</SelectItem>
                <SelectItem value="unknown">{dictionary.filters.categoryUnknown}</SelectItem>
                <SelectItem value="financial">{dictionary.filters.categoryFinancial}</SelectItem>
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-created_at_after">{dictionary.filters.from}</Label>
              <Input
              id="filter-created_at_after"
              type="date"
              value={filters.created_at_after}
              onChange={(e) =>
                setFilters((f) => ({ ...f, created_at_after: e.target.value }))
              }
              className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="filter-created_at_before">{dictionary.filters.to}</Label>
              <Input
              id="filter-created_at_before"
              type="date"
              value={filters.created_at_before}
              onChange={(e) =>
                setFilters((f) => ({ ...f, created_at_before: e.target.value }))
              }
              className="h-9"
              />
            </div>
            <div className="space-y-2">
              <Label>{dictionary.filters.sortBy}</Label>
              <Select
              value={filters.sort_by || "any"}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, sort_by: (v === "any" ? "" : v) as iContactSortBy }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue placeholder={dictionary.filters.any} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">{dictionary.filters.any}</SelectItem>
                <SelectItem value="total_order_amount">{dictionary.filters.sortByOrderAmount}</SelectItem>
                <SelectItem value="created_at">{dictionary.filters.sortByCreatedAt}</SelectItem>
              </SelectContent>
            </Select>
            </div>
            <div className="space-y-2">
              <Label>{dictionary.filters.sortOrder}</Label>
              <Select
              value={filters.sort_order}
              onValueChange={(v) =>
                setFilters((f) => ({ ...f, sort_order: v as iContactSortOrder }))
              }
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{dictionary.filters.sortDesc}</SelectItem>
                <SelectItem value="asc">{dictionary.filters.sortAsc}</SelectItem>
              </SelectContent>
            </Select>
            </div>
          </div>
        </div>
        <SheetFooter className="shrink-0 gap-2 pt-4">
          <Button variant="outline" onClick={handleClear}>
            {dictionary.filters.clear}
          </Button>
          <Button onClick={handleApply}>{dictionary.filters.apply}</Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
