"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"

import { cn } from "./lib/utils"

const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
  [k: string]: {
    label?: React.ReactNode
    icon?: React.ComponentType<{ className?: string }>
  } & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
  )
}

type ChartContextProps = {
  config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
  const context = React.useContext(ChartContext)
  if (!context) {
    throw new Error("useChart must be used within a ChartContainer")
  }
  return context
}

function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
): ChartConfig[string] | undefined {
  if (typeof payload !== "object" || payload === null) return undefined
  const payloadPayload =
    "payload" in payload &&
    typeof (payload as { payload?: unknown }).payload === "object" &&
    (payload as { payload?: unknown }).payload !== null
      ? (payload as { payload: Record<string, unknown> }).payload
      : undefined

  let configLabelKey: string = key
  const pl = payload as Record<string, unknown>
  if (key in pl && typeof pl[key] === "string") {
    configLabelKey = pl[key] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key] === "string"
  ) {
    configLabelKey = payloadPayload[key] as string
  }
  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.theme || itemConfig.color
  )
  if (!colorConfig.length) return null

  const rules = Object.entries(THEMES)
    .map(([theme, prefix]) => {
      const selector = prefix ? `${prefix} [data-chart=${id}]` : `[data-chart=${id}]`
      const vars = colorConfig
        .map(([key, itemConfig]) => {
          const color =
            itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ??
            itemConfig.color
          if (!color) return null
          // Wrap in hsl() so raw HSL triples (e.g. from var(--chart-1)) become valid colors
          const value = color.startsWith("var(") ? `hsl(${color})` : color
          return ` --color-${key}: ${value};`
        })
        .filter(Boolean)
        .join("")
      return `${selector} {${vars}}`
    })
    .join("\n")

  return <style dangerouslySetInnerHTML={{ __html: rules }} />
}

const ChartContainer = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    config: ChartConfig
    children: React.ReactElement
    /** Explicit height in px so ResponsiveContainer has a defined size (avoids 0 height in flex layouts). */
    height?: number
  }
>(({ id, className, children, config, height, ...props }, ref) => {
  const uniqueId = React.useId()
  const chartId = `chart-${id ?? uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <ChartStyle id={chartId} config={config} />
      <div
        ref={ref}
        className={cn("w-full", className)}
        data-chart={chartId}
        style={height !== undefined ? { height: `${height}px` } : undefined}
        {...props}
      >
        <RechartsPrimitive.ResponsiveContainer
          width="100%"
          height={height !== undefined ? height : "100%"}
        >
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
})
ChartContainer.displayName = "ChartContainer"

const ChartTooltip = RechartsPrimitive.Tooltip

const ChartTooltipContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
    React.ComponentProps<"div"> & {
      hideLabel?: boolean
      hideIndicator?: boolean
      indicator?: "line" | "dot" | "dashed"
      nameKey?: string
      labelKey?: string
    }
>(
  (
    {
      active,
      payload,
      className,
      indicator = "dot",
      hideLabel = false,
      hideIndicator = false,
      label,
      labelFormatter,
      labelClassName,
      formatter,
      nameKey,
      labelKey,
    },
    ref
  ) => {
    const { config } = useChart()

    const tooltipLabel = React.useMemo(() => {
      if (hideLabel || !payload?.length) return null
      const [item] = payload
      const key = `${labelKey ?? (item?.dataKey ?? item?.name ?? "value")}`
      const itemConfig = getPayloadConfigFromPayload(config, item, key)
      const value =
        !labelKey && typeof label === "string"
          ? config[label as keyof typeof config]?.label ?? label
          : itemConfig?.label
      if (labelFormatter) {
        return <>{labelFormatter(value, payload)}</>
      }
      if (!value) return null
      return <div className={cn("font-medium", labelClassName)}>{value}</div>
    }, [label, labelFormatter, payload, hideLabel, labelClassName, config, labelKey])

    if (!active || !payload?.length) return null

    const nestLabel = payload.length === 1 && indicator !== "dot"

    return (
      <div
        ref={ref}
        className={cn(
          "grid min-w-32 items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
          className
        )}
      >
        {!nestLabel ? tooltipLabel : null}
        {payload.map((item, index) => {
          const key = `${nameKey ?? item.name ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)
          const indicatorColor = item.payload?.fill ?? item.color

          return (
            <div
              key={item.dataKey ?? index}
              className="flex flex-wrap items-center gap-1.5"
            >
              {formatter && item?.value !== undefined && item.name ? (
                formatter(item.value, item.name, item, index, item.payload)
              ) : (
                <>
                  {itemConfig?.icon ? (
                    <itemConfig.icon className="h-4 w-4 shrink-0" />
                  ) : (
                    !hideIndicator && (
                      <div
                        className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
                        style={{ backgroundColor: indicatorColor }}
                      />
                    )
                  )}
                  <span className="shrink-0 text-muted-foreground">
                    {itemConfig?.label ?? item.name}
                  </span>
                  {item.value != null && (
                    <span className="font-medium tabular-nums">
                      {item.value.toLocaleString()}
                    </span>
                  )}
                </>
              )}
            </div>
          )
        })}
        {nestLabel ? tooltipLabel : null}
      </div>
    )
  }
)
ChartTooltipContent.displayName = "ChartTooltipContent"

const ChartLegend = RechartsPrimitive.Legend

const ChartLegendContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> &
    Pick<
      React.ComponentProps<typeof RechartsPrimitive.Legend>,
      "payload" | "verticalAlign"
    > & {
      hideIcon?: boolean
      nameKey?: string
    }
>(
  (
    {
      className,
      hideIcon = false,
      payload,
      verticalAlign = "bottom",
      nameKey,
    },
    ref
  ) => {
    const { config } = useChart()
    if (!payload?.length) return null

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-4",
          verticalAlign === "top" ? "flex-col-reverse" : "flex-col",
          className
        )}
      >
        {payload.map((item) => {
          const key = `${nameKey ?? item.dataKey ?? "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className="flex items-center gap-1.5"
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon className="h-4 w-4 shrink-0" />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{ backgroundColor: item.color }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
      </div>
    )
  }
)
ChartLegendContent.displayName = "ChartLegendContent"

export {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
  ChartTooltip,
  ChartTooltipContent,
  useChart,
}
