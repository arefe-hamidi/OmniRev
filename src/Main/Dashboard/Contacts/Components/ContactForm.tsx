"use client"

import type {
  iContact,
  iContactFormState,
  iContactStatus,
  iContactSource,
  iContactCategory,
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
  contact: iContact | null
  formData: iContactFormState
  setFormData: (data: iContactFormState) => void
  onSubmit: (e: React.FormEvent) => void
  dictionary: iDictionary
  isPending: boolean
}

export default function ContactForm({
  open,
  onOpenChange,
  contact,
  formData,
  setFormData,
  onSubmit,
  dictionary,
  isPending,
}: iProps) {
  if (!contact) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="flex h-full max-h-dvh flex-col overflow-hidden sm:max-w-md"
      >
        <SheetHeader className="shrink-0">
          <SheetTitle>{dictionary.editContact}</SheetTitle>
          <SheetDescription>{dictionary.description}</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-1 pb-6">
          <form id="contact-edit-form" onSubmit={onSubmit} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-first_name">{dictionary.form.firstName}</Label>
                <Input
                  id="contact-first_name"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData({ ...formData, first_name: e.target.value })
                  }
                  placeholder={dictionary.form.firstName}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-last_name">{dictionary.form.lastName}</Label>
                <Input
                  id="contact-last_name"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData({ ...formData, last_name: e.target.value })
                  }
                  placeholder={dictionary.form.lastName}
                />
              </div>
            </div>
          <div className="space-y-2">
            <Label htmlFor="contact-email">{dictionary.form.email} *</Label>
            <Input
              id="contact-email"
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder={dictionary.form.email}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact-phone_number">{dictionary.form.phoneNumber}</Label>
            <Input
              id="contact-phone_number"
              type="tel"
              value={formData.phone_number}
              onChange={(e) =>
                setFormData({ ...formData, phone_number: e.target.value })
              }
              placeholder={dictionary.form.phoneNumber}
            />
          </div>
          <div className="space-y-2">
            <Label>{dictionary.form.status}</Label>
            <Select
              value={formData.status || "none"}
              onValueChange={(v) =>
                setFormData({ ...formData, status: (v === "none" ? "" : v) as iContactStatus })
              }
            >
              <SelectTrigger className="h-9" id="contact-status">
                <SelectValue placeholder={dictionary.form.status} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{dictionary.filters.any}</SelectItem>
                <SelectItem value="potential">{dictionary.filters.statusPotential}</SelectItem>
                <SelectItem value="customer">{dictionary.filters.statusCustomer}</SelectItem>
                <SelectItem value="lapsed">{dictionary.filters.statusLapsed}</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>{dictionary.form.source}</Label>
            <Select
              value={formData.source || "none"}
              onValueChange={(v) =>
                setFormData({ ...formData, source: (v === "none" ? "" : v) as iContactSource })
              }
            >
              <SelectTrigger className="h-9" id="contact-source">
                <SelectValue placeholder={dictionary.form.source} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">{dictionary.filters.any}</SelectItem>
                <SelectItem value="CRM">{dictionary.filters.sourceCRM}</SelectItem>
                <SelectItem value="Organic">{dictionary.filters.sourceOrganic}</SelectItem>
              </SelectContent>
            </Select>
          </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-market">{dictionary.form.market}</Label>
                <Input
                  id="contact-market"
                  value={formData.market}
                  onChange={(e) =>
                    setFormData({ ...formData, market: e.target.value })
                  }
                  placeholder={dictionary.form.market}
                />
              </div>
              <div className="space-y-2">
                <Label>{dictionary.form.category}</Label>
                <Select
                  value={formData.category || "none"}
                  onValueChange={(v) =>
                    setFormData({ ...formData, category: (v === "none" ? "" : v) as iContactCategory })
                  }
                >
                <SelectTrigger className="h-9" id="contact-category">
                  <SelectValue placeholder={dictionary.form.category} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">{dictionary.filters.any}</SelectItem>
                  <SelectItem value="education">{dictionary.filters.categoryEducation}</SelectItem>
                  <SelectItem value="art">{dictionary.filters.categoryArt}</SelectItem>
                  <SelectItem value="legal">{dictionary.filters.categoryLegal}</SelectItem>
                  <SelectItem value="unknown">{dictionary.filters.categoryUnknown}</SelectItem>
                  <SelectItem value="financial">{dictionary.filters.categoryFinancial}</SelectItem>
                </SelectContent>
              </Select>
              </div>
            </div>
          </form>
        </div>
        <SheetFooter className="shrink-0 gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            {dictionary.form.cancel}
          </Button>
          <Button type="submit" form="contact-edit-form" disabled={isPending}>
            {dictionary.form.submit}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
