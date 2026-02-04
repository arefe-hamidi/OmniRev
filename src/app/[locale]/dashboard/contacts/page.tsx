import type { iLocale } from "@/Components/Entity/Locale/types"
import { DEFAULT_LOCALE } from "@/Components/Entity/Locale/constants"
import DefaultLayout from "@/Components/Layout/DefaultLayout/DefaultLayout"
import Contacts from "@/Main/Dashboard/Contacts/Contacts"

interface iProps {
  params: Promise<{ locale: string }>
}

export default async function Page({ params }: iProps) {
  const { locale } = await params
  const validLocale = (locale === "en" || locale === "fr" ? locale : DEFAULT_LOCALE) as iLocale

  return (
    <DefaultLayout locale={validLocale}>
      <Contacts locale={validLocale} />
    </DefaultLayout>
  )
}
