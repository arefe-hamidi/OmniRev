"use client"

import { useState, useMemo } from "react"
import { Search, Filter } from "lucide-react"
import { toast } from "sonner"
import type { iLocale } from "@/Components/Entity/Locale/types"
import { useTableUrlState } from "@/lib/hooks/useTableUrlState"
import { appRoutes } from "@/lib/routes/appRoutes"
import { getDictionary } from "./i18n"
import { useGetContacts, useUpdateContact } from "./api"
import type {
  iContact,
  iContactFormState,
  iContactFilters,
  iContactStatus,
  iContactSource,
  iContactCategory,
} from "./types"
import { defaultFilters, emptyFormState } from "./constants"
import { getActiveFilterBadges } from "./filterBadges"
import { getContactTableColumns } from "./utils"
import { parseErrorResponse } from "@/lib/api/utils/parseError"
import ResponsiveTable from "@/Components/Entity/ResponsiveTable/ResponsiveTable"
import Button from "@/Components/Shadcn/button"
import Card, {
  CardActions,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/Components/Shadcn/card"
import Input from "@/Components/Shadcn/input"
import FullPagination from "@/Components/Entity/FullPagination/FullPagination"
import ContactFilterBadges from "./Components/ContactFilterBadges"
import ContactsTableSkeleton from "./Components/ContactsTableSkeleton"
import ContactFiltersSheet from "./Components/ContactFiltersSheet"
import ContactForm from "./Components/ContactForm"

interface iProps {
  locale: iLocale
}

export default function Contacts({ locale }: iProps) {
  const dictionary = getDictionary(locale)
  const {
    currentPage,
    pageSize,
    searchQuery,
    debouncedSearch,
    setSearchQuery,
    handlePaginationChange,
  } = useTableUrlState({ basePath: appRoutes.dashboard.contacts.root(locale) })

  const [filters, setFilters] = useState<iContactFilters>(defaultFilters)
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<iContact | null>(null)
  const [formData, setFormData] = useState<iContactFormState>(emptyFormState())

  const { data, isLoading, error, refetch } = useGetContacts(
    currentPage,
    pageSize,
    debouncedSearch,
    filters
  )
  const contacts = data?.results ?? []
  const totalCount = data?.count ?? 0
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize))
  const updateMutation = useUpdateContact()

  const activeFilterBadges = useMemo(
    () => getActiveFilterBadges(filters, defaultFilters, dictionary),
    [filters, dictionary]
  )

  const handleOpenEdit = (contact: iContact) => {
    setEditingContact(contact)
    setFormData({
      first_name: contact.first_name ?? "",
      last_name: contact.last_name ?? "",
      email: contact.email ?? "",
      phone_number: contact.phone_number ?? "",
      status: (contact.status ?? "") as iContactStatus,
      source: (contact.source ?? "") as iContactSource,
      market: contact.market ?? "",
      category: (contact.category ?? "") as iContactCategory,
    })
    setEditModalOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const id = editingContact?.id
    if (id == null) return
    try {
      await updateMutation.mutateAsync({
        id,
        data: {
          first_name: formData.first_name || undefined,
          last_name: formData.last_name || undefined,
          email: formData.email,
          phone_number: formData.phone_number || undefined,
          status: formData.status || undefined,
          source: formData.source || undefined,
          market: formData.market || undefined,
          category: formData.category || undefined,
        },
      })
      toast.success(dictionary.messages.success)
      setEditModalOpen(false)
      setEditingContact(null)
      setFormData(emptyFormState())
    } catch (err) {
      console.error("Failed to update contact:", err)
      const errorMessage = await parseErrorResponse(err, dictionary.messages.error)
      toast.error(errorMessage)
    }
  }

  const handleClearOneFilter = (key: keyof iContactFilters) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: defaultFilters[key] }
      if (key === "sort_by") next.sort_order = defaultFilters.sort_order
      return next
    })
  }

  const columns = getContactTableColumns(dictionary, { onEdit: handleOpenEdit })

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5">
            <CardTitle className="text-2xl font-bold tracking-tight">
              {dictionary.title}
            </CardTitle>
            <CardDescription className="text-muted-foreground">
              {dictionary.description}
            </CardDescription>
          </div>
          <CardActions className="flex flex-wrap items-center gap-3 pt-0">
            <div className="relative">
              <Search className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={dictionary.searchPlaceholder}
                className="h-9 w-64 pl-9"
              />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setFilterSheetOpen(true)}
              aria-expanded={filterSheetOpen}
            >
              <Filter className="mr-2 h-4 w-4" />
              {dictionary.filters.label}
            </Button>
          </CardActions>
        </CardHeader>

        <CardContent className="p-0">
          <ContactFilterBadges
            items={activeFilterBadges}
            dictionary={dictionary}
            onClearOne={handleClearOneFilter}
            onClearAll={() => setFilters(defaultFilters)}
          />

          {error ? (
            <div className="text-muted-foreground flex min-h-[200px] flex-col items-center justify-center gap-3 p-8 text-center">
              <p className="text-sm">{dictionary.messages.loadError}</p>
              <Button variant="outline" size="sm" onClick={() => refetch()}>
                {dictionary.messages.retry}
              </Button>
            </div>
          ) : isLoading ? (
            <ContactsTableSkeleton />
          ) : contacts.length === 0 ? (
            <div className="text-muted-foreground flex min-h-[200px] items-center justify-center p-8 text-center">
              <p className="text-sm">{dictionary.messages.noContacts}</p>
            </div>
          ) : (
            <>
              <div className="p-4">
                <ResponsiveTable
                  data={contacts}
                  columns={columns}
                  rowKey="id"
                  isFetching={false}
                  emptyMessage={dictionary.messages.noContacts}
                />
              </div>
              <div className="px-4 pb-4">
                <FullPagination
                  currentPage={currentPage}
                  totalItems={totalCount}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  onChange={handlePaginationChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <ContactFiltersSheet
        open={filterSheetOpen}
        onOpenChange={setFilterSheetOpen}
        filters={filters}
        setFilters={setFilters}
        dictionary={dictionary}
        defaultFilters={defaultFilters}
      />

      <ContactForm
        open={editModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setEditingContact(null)
            setFormData(emptyFormState())
          }
          setEditModalOpen(open)
        }}
        contact={editingContact}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        dictionary={dictionary}
        isPending={updateMutation.isPending}
      />
    </div>
  )
}
