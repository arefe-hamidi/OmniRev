"use client"

import { Pencil } from "lucide-react"
import type { iContact } from "./types"
import type { iDictionary } from "./i18n"
import type { iResponsiveColumn } from "@/Components/Entity/ResponsiveTable/types"
import Badge from "@/Components/Shadcn/badge"
import Button from "@/Components/Shadcn/button"

/** Format number as USD */
function formatUsd(value: number | undefined): string {
  if (value == null || Number.isNaN(value)) return "—"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(value)
}

/** User-friendly date from ISO string */
function formatCreatedAt(iso?: string): string {
  if (!iso) return "—"
  try {
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return iso
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: "medium",
    }).format(d)
  } catch {
    return iso
  }
}

function fullName(contact: iContact): string {
  const first = (contact.first_name ?? "").trim()
  const last = (contact.last_name ?? "").trim()
  if (first && last) return `${first} ${last}`
  if (first) return first
  if (last) return last
  return contact.email
}

export interface iContactTableHandlers {
  onEdit: (contact: iContact) => void
}

export function getContactTableColumns(
  dictionary: iDictionary,
  handlers: iContactTableHandlers
): iResponsiveColumn<iContact>[] {
  return [
    {
      label: dictionary.table.name,
      cell: ({ row }) => <div className="font-medium">{fullName(row)}</div>,
    },
    {
      label: dictionary.table.status,
      cell: ({ row }) => (
        <Badge variant={row.status ? "default" : "secondary"}>
          {row.status ?? "—"}
        </Badge>
      ),
    },
    {
      label: dictionary.table.source,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.source ?? "—"}</span>
      ),
    },
    {
      label: dictionary.table.orderCount,
      cell: ({ row }) => (
        <span>{row.order_count != null ? String(row.order_count) : "—"}</span>
      ),
    },
    {
      label: dictionary.table.totalOrderValue,
      cell: ({ row }) => (
        <span>{formatUsd(Number(row.total_order_amount))}</span>
      ),
    },
    {
      label: dictionary.table.createdAt,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatCreatedAt(row.created_at)}
        </span>
      ),
    },
    {
      label: dictionary.table.actions,
      stickyRight: true,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => handlers.onEdit(row)}
          aria-label={dictionary.editContact}
        >
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ]
}
