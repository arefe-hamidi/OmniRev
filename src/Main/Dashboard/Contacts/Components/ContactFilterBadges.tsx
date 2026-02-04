"use client"

import { X } from "lucide-react"
import type { iContactFilters } from "../types"
import type { FilterBadgeItem } from "../filterBadges"
import type { iDictionary } from "../i18n"
import Badge from "@/Components/Shadcn/badge"
import Button from "@/Components/Shadcn/button"

interface iProps {
  items: FilterBadgeItem[]
  dictionary: iDictionary
  onClearOne: (key: keyof iContactFilters) => void
  onClearAll: () => void
}

export default function ContactFilterBadges({
  items,
  dictionary,
  onClearOne,
  onClearAll,
}: iProps) {
  if (items.length === 0) return null

  return (
    <div className="border-b px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        {items.map((item) => (
          <Badge
            key={item.key}
            variant="secondary"
            className="flex h-7 items-center gap-1 pr-1"
          >
            <span className="font-normal">
              {item.fieldLabel}: {item.valueLabel}
            </span>
            <button
              type="button"
              onClick={() => onClearOne(item.key)}
              className="hover:bg-muted rounded p-0.5 transition-colors"
              aria-label={`Remove ${item.fieldLabel} filter`}
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </Badge>
        ))}
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-muted-foreground hover:text-foreground"
          onClick={onClearAll}
        >
          {dictionary.filters.clearAll}
        </Button>
      </div>
    </div>
  )
}
