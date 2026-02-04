"use client";

import { useState } from "react";
import type { ComponentType } from "react";
import dynamic from "next/dynamic";
import type { iLocale } from "@/Components/Entity/Locale/types";
import type { CategoriesChartProps } from "./Category/Components/CategoriesChart";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/Shadcn/card";
import Skeleton from "@/Components/Shadcn/skeleton";
import { useGetCategoriesStats } from "./Category/api";
import { getCategoryDictionary } from "./Category/i18n";
import {
  buildStatsParams,
  useGetMarkets,
  useGetTopContacts,
} from "./Market/api";
import { DEFAULT_DASHBOARD_FILTERS } from "./Market/constants";
import { getDictionary } from "./i18n";
import DashboardFilterBar from "./Components/DashboardFilterBar";
import HighValueCustomers from "./Market/Components/HighValueCustomers";

const CategoriesChartDynamic = dynamic(
  () => import("./Category/Components/CategoriesChart").then((m) => m.default),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[280px] w-full rounded-lg" />,
  }
) as ComponentType<CategoriesChartProps>;

interface iProps {
  locale: iLocale;
}

export default function Home({ locale }: iProps) {
  const dictionary = getDictionary(locale);
  const categoryDict = getCategoryDictionary(locale);
  const [filters, setFilters] = useState(DEFAULT_DASHBOARD_FILTERS);

  const statsParams = buildStatsParams(filters);
  const { data: chartItems, isPending: chartPending } =
    useGetCategoriesStats(statsParams);
  const { data: topContacts = [], isPending: contactsPending } =
    useGetTopContacts(filters);
  const { data: markets = [] } = useGetMarkets();

  const itemsToShow = chartItems && chartItems.length > 0 ? chartItems : [];
  const hasChartData = itemsToShow.length > 0;

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
      <div className="container space-y-6 px-4 py-6">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {dictionary.title}
          </h1>
          <DashboardFilterBar
            filters={filters}
            onFiltersChange={setFilters}
            yesterdayLabel={dictionary.filters.yesterday}
            last7DaysLabel={dictionary.filters.last7Days}
            last30DaysLabel={dictionary.filters.last30Days}
            customLabel={dictionary.filters.custom}
            allMarketsLabel={dictionary.filters.allMarkets}
            markets={markets}
          />
        </header>

        <div className="grid gap-6 lg:grid-cols-2">
          {chartPending && (
            <Card className="shadow-sm">
              <CardHeader className="flex-row items-start justify-between space-y-0 pb-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-8 w-[130px] rounded-lg" />
              </CardHeader>
              <CardContent className="flex justify-center pt-0">
                <Skeleton className="h-[280px] w-full max-w-[300px] rounded-lg" />
              </CardContent>
            </Card>
          )}
          {!chartPending && hasChartData && (
            <CategoriesChartDynamic
              data={itemsToShow}
              title={categoryDict.title}
              selectPlaceholder={categoryDict.selectCategory}
            />
          )}
          {!chartPending && !hasChartData && (
            <Card className="shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">
                  {dictionary.categoriesChart.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex h-[280px] items-center justify-center text-muted-foreground">
                  {dictionary.categoriesChart.empty}
                </div>
              </CardContent>
            </Card>
          )}
          <HighValueCustomers
            contacts={topContacts}
            isPending={contactsPending}
            title={dictionary.highValueCustomers.title}
            emptyLabel={dictionary.highValueCustomers.empty}
            columnNameLabel={dictionary.highValueCustomers.columnName}
            columnSalesLabel={dictionary.highValueCustomers.columnSales}
          />
        </div>
      </div>
    </div>
  );
}
