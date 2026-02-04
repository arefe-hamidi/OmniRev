"use client";

import * as React from "react";
import { Label, Pie, PieChart, Sector } from "recharts";
import type { PieSectorDataItem } from "recharts/types/polar/Pie";
import {
  ChartContainer,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/Components/Shadcn/chart";
import Card, {
  CardContent,
  CardHeader,
  CardTitle,
} from "@/Components/Shadcn/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/Components/Shadcn/select";
import type { CategoryChartItem } from "../types";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
  "var(--chart-6)",
  "var(--chart-7)",
] as const;

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
}

function buildChartConfigAndData(items: CategoryChartItem[]) {
  const config: ChartConfig = {};
  const chartData = items.map((item, index) => {
    const key = item.name;
    const color = CHART_COLORS[index % CHART_COLORS.length];
    config[key] = { label: capitalize(key), color };
    return {
      name: key,
      value: item.value,
      fill: `var(--color-${key})`,
    };
  });
  return { config, chartData };
}

export interface CategoriesChartProps {
  data: CategoryChartItem[];
  title: string;
  selectPlaceholder?: string;
}

export default function CategoriesChart({
  data,
  title,
  selectPlaceholder = "Select category",
}: CategoriesChartProps) {
  const id = "categories-pie-interactive";
  const [activeCategory, setActiveCategory] = React.useState(
    data[0]?.name ?? ""
  );

  const { config, chartData } = React.useMemo(
    () => buildChartConfigAndData(data),
    [data]
  );

  const activeIndex = React.useMemo(
    () => chartData.findIndex((item) => item.name === activeCategory),
    [chartData, activeCategory]
  );

  const categoryKeys = React.useMemo(
    () => chartData.map((item) => item.name),
    [chartData]
  );

  React.useEffect(() => {
    if (data.length > 0 && !activeCategory) {
      setActiveCategory(data[0].name);
    }
  }, [data, activeCategory]);

  if (data.length === 0) return null;

  return (
    <Card data-chart={id} className="flex flex-col">
      <ChartStyle id={id} config={config} />
      <CardHeader className="flex-row items-start space-y-0 pb-0">
        <div className="grid gap-1">
          <CardTitle>{title}</CardTitle>
        </div>
        <Select
          value={activeCategory || categoryKeys[0]}
          onValueChange={setActiveCategory}
        >
          <SelectTrigger
            className="ml-auto h-7 w-[130px] rounded-lg pl-2.5"
            aria-label="Select category"
          >
            <SelectValue placeholder={selectPlaceholder} />
          </SelectTrigger>
          <SelectContent align="end" className="rounded-xl">
            {categoryKeys.map((key) => {
              const itemConfig = config[key];
              const color =
                itemConfig && "color" in itemConfig
                  ? itemConfig.color
                  : undefined;
              if (!itemConfig || color == null) return null;
              return (
                <SelectItem
                  key={key}
                  value={key}
                  className="rounded-lg [&_span]:flex"
                >
                  <div className="flex items-center gap-2 text-xs">
                    <span
                      className="flex h-3 w-3 shrink-0 rounded-xs"
                      style={{
                        backgroundColor: color.startsWith("var(")
                          ? `hsl(${color})`
                          : color,
                      }}
                    />
                    {itemConfig?.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-1 justify-center pb-0">
        <ChartContainer
          id={id}
          config={config}
          className="mx-auto aspect-square w-full max-w-[300px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              innerRadius={60}
              strokeWidth={5}
              activeIndex={activeIndex >= 0 ? activeIndex : 0}
              activeShape={({
                outerRadius = 0,
                ...props
              }: PieSectorDataItem) => (
                <g>
                  <Sector {...props} outerRadius={outerRadius + 10} />
                  <Sector
                    {...props}
                    outerRadius={outerRadius + 25}
                    innerRadius={outerRadius + 12}
                  />
                </g>
              )}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    const idx = activeIndex >= 0 ? activeIndex : 0;
                    const item = chartData[idx];
                    if (!item) return null;
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {item.value}%
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground text-sm"
                        >
                          {item ? capitalize(item.name) : ""}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
