export interface iContact {
  id: string
  first_name?: string
  last_name?: string
  email: string
  phone_number?: string
  status?: string
  source?: string
  market?: string
  category?: string
  order_count?: number
  total_order_amount?: number
  created_at?: string
  [key: string]: unknown
}

/** API list response: { data: { data: T[], pagination: { page, per_page, total, total_page } } } */
export interface iContactListApiWrapper<T> {
  data: {
    data: T[]
    pagination: {
      page: number
      per_page: number
      total: number
      total_page: number
    }
  }
}

/** Payload for PUT /contacts/:id (all optional except email when provided) */
export interface iContactUpdateRequest {
  first_name?: string
  last_name?: string
  email: string
  phone_number?: string
  status?: string
  source?: string
  market?: string
  category?: string
}

/** API-accepted source values */
export type iContactSource = "CRM" | "Organic" | ""

/** API-accepted category values */
export type iContactCategory = "education" | "art" | "legal" | "unknown" | "financial" | ""

/** API-accepted status values */
export type iContactStatus = "potential" | "customer" | "lapsed" | ""

/** API sort_by values */
export type iContactSortBy = "total_order_amount" | "created_at" | ""

/** API sort_order values */
export type iContactSortOrder = "asc" | "desc"

/** Form state for edit contact modal */
export interface iContactFormState {
  first_name: string
  last_name: string
  email: string
  phone_number: string
  status: iContactStatus
  source: iContactSource
  market: string
  category: iContactCategory
}

/** Filter state for contacts list (maps to API: q, source, category, status, market, created_at_after, created_at_before, sort_by, sort_order) */
export interface iContactFilters {
  status: iContactStatus
  market: string
  source: iContactSource
  category: iContactCategory
  created_at_after: string
  created_at_before: string
  sort_by: iContactSortBy
  sort_order: iContactSortOrder
}
