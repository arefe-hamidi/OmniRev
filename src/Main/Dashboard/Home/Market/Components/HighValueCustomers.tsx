"use client"

import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/Shadcn/card"
import Skeleton from "@/Components/Shadcn/skeleton"
import Table, {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/Components/Shadcn/table"
import type { iContact } from "@/Main/Dashboard/Contacts/types"

export interface HighValueCustomersProps {
  contacts: iContact[]
  isPending: boolean
  title: string
  emptyLabel: string
  columnNameLabel: string
  columnSalesLabel: string
}

function formatCurrency(value: number | string | undefined): string {
  if (value === undefined || value === null) return "—"
  const n = typeof value === "string" ? parseFloat(value) : value
  if (Number.isNaN(n)) return "—"
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(n)
}

function displayName(c: iContact): string {
  const first = c.first_name?.trim()
  const last = c.last_name?.trim()
  if (first || last) return [first, last].filter(Boolean).join(" ")
  return c.email ?? "—"
}

export default function HighValueCustomers({
  contacts,
  isPending,
  title,
  emptyLabel,
  columnNameLabel,
  columnSalesLabel,
}: HighValueCustomersProps) {
  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {isPending && (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-md" />
            ))}
          </div>
        )}
        {!isPending && contacts.length === 0 && (
          <p className="text-sm text-muted-foreground">{emptyLabel}</p>
        )}
        {!isPending && contacts.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="h-10 bg-muted/50 font-semibold text-foreground">
                  {columnNameLabel}
                </TableHead>
                <TableHead className="h-10 bg-muted/50 text-right font-semibold text-foreground">
                  {columnSalesLabel}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">
                    {displayName(c)}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {formatCurrency(c.total_order_amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
