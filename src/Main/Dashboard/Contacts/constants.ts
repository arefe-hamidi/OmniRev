import type { iContactFilters, iContactFormState } from "./types"

export const defaultFilters: iContactFilters = {
  status: "",
  market: "",
  source: "",
  category: "",
  created_at_after: "",
  created_at_before: "",
  sort_by: "",
  sort_order: "desc",
}

export function emptyFormState(): iContactFormState {
  return {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    status: "",
    source: "",
    market: "",
    category: "",
  }
}
