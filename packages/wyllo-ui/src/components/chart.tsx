"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import { Eye, EyeOff } from "lucide-react"

import { cn } from "../lib/utils"

// Format: { THEME_NAME: CSS_SELECTOR }
const THEMES = { light: "", dark: ".dark" } as const

// ---------------------------------------------------------------------------
// Chart layout constants (4px-grid aligned)
//
// These three values are coupled: the plot-left offset is derived from the
// YAxis width plus the negative left margin. Changing one requires updating
// the others. The CSS variable --chart-plot-left-offset mirrors
// CHART_DEFAULT_PLOT_LEFT_OFFSET for use in Tailwind classes.
//
// Usage on a chart with a standard Y-axis:
//   <BarChart margin={CHART_DEFAULT_MARGIN}>
//     <YAxis width={CHART_DEFAULT_YAXIS_WIDTH} />
//     ...
//   </BarChart>
//
// And on the legend wrapper:
//   <div style={{ paddingLeft: CHART_DEFAULT_PLOT_LEFT_OFFSET }}>
//     <ChartLegendInteractive ... />
//   </div>
//
// Or with the CSS variable:
//   <div className="pl-[var(--chart-plot-left-offset)]">
//
// Charts without a Y-axis (pie, radial, horizontal bar) should NOT apply
// the offset — their legends align with the container edge.
// ---------------------------------------------------------------------------
export const CHART_DEFAULT_YAXIS_WIDTH = 48
export const CHART_DEFAULT_MARGIN = {
  top: 4,
  right: 8,
  left: -8,
  bottom: 4,
} as const
export const CHART_DEFAULT_PLOT_LEFT_OFFSET = 40

export type ChartConfig = {
  [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
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
    throw new Error("useChart must be used within a <ChartContainer />")
  }

  return context
}

function ChartContainer({
  id,
  className,
  children,
  config,
  ...props
}: React.ComponentProps<"div"> & {
  config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >["children"]
}) {
  const uniqueId = React.useId()
  const chartId = `chart-${id || uniqueId.replace(/:/g, "")}`

  return (
    <ChartContext.Provider value={{ config }}>
      <div
        data-slot="chart"
        data-chart={chartId}
        className={cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className
        )}
        {...props}
      >
        <ChartStyle id={chartId} config={config} />
        <RechartsPrimitive.ResponsiveContainer>
          {children}
        </RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
  const colorConfig = Object.entries(config).filter(
    ([, config]) => config.theme || config.color
  )

  if (!colorConfig.length) {
    return null
  }

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
  .map(([key, itemConfig]) => {
    const color =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return color ? `  --color-${key}: ${color};` : null
  })
  .join("\n")}
}
`
          )
          .join("\n"),
      }}
    />
  )
}

const ChartTooltip = RechartsPrimitive.Tooltip

/**
 * Context passed to the `footer` prop of ChartTooltipContent when used as a function.
 * Use `total` to render a total row. `payload` is the filtered, visible series.
 */
type ChartTooltipFooterContext = {
  payload: ReadonlyArray<{
    value?: number | string
    name?: string | number
    color?: string
    dataKey?: string | number
    [key: string]: unknown
  }>
  total: number
}

function ChartTooltipContent({
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
  color,
  nameKey,
  labelKey,
  showPercent = false,
  valueFormatter,
  footer,
}: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<"div"> & {
    hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: "line" | "dot" | "dashed"
    nameKey?: string
    labelKey?: string
    /**
     * When true, each row renders a percentage-of-total column alongside the
     * value. The total is computed from the filtered payload. Use together with
     * `valueFormatter` to control how the value cell is displayed, and with
     * `footer` (function form) to render a total row.
     */
    showPercent?: boolean
    /**
     * Formats the value cell in showPercent mode. Ignored when showPercent is
     * false — for the default layout, use the `formatter` prop to take over
     * the row entirely.
     */
    valueFormatter?: (value: number) => string
    /**
     * Optional footer row rendered below the tooltip body with a border-top
     * and tighter vertical padding. Pass a ReactNode for static copy, or a
     * function receiving `{ payload, total }` to render a total row. Not
     * bound to the "Total" label — consumers control the content fully.
     */
    footer?:
      | React.ReactNode
      | ((context: ChartTooltipFooterContext) => React.ReactNode)
  }) {
  const { config } = useChart()

  const tooltipLabel = React.useMemo(() => {
    if (hideLabel || !payload?.length) {
      return null
    }

    const [item] = payload
    const key = `${labelKey || item?.dataKey || item?.name || "value"}`
    const itemConfig = getPayloadConfigFromPayload(config, item, key)
    const value =
      !labelKey && typeof label === "string"
        ? config[label as keyof typeof config]?.label || label
        : itemConfig?.label

    if (labelFormatter) {
      return (
        <div className={cn("font-[520]", labelClassName)}>
          {labelFormatter(value, payload)}
        </div>
      )
    }

    if (!value) {
      return null
    }

    return <div className={cn("font-[520]", labelClassName)}>{value}</div>
  }, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])

  if (!active || !payload?.length) {
    return null
  }

  const filteredPayload = payload.filter((item) => item.type !== "none")
  const needsTotal = showPercent || typeof footer === "function"
  const total = needsTotal
    ? filteredPayload.reduce(
        (sum, item) => sum + (Number(item.value) || 0),
        0
      )
    : 0

  const nestLabel =
    !showPercent && filteredPayload.length === 1 && indicator !== "dot"

  const resolvedFooter =
    typeof footer === "function"
      ? footer({
          payload:
            filteredPayload as unknown as ChartTooltipFooterContext["payload"],
          total,
        })
      : footer

  return (
    <div
      className={cn(
        "border-border bg-popover text-popover-foreground overflow-hidden rounded-md border text-xs shadow-[var(--elevation-floating)]",
        showPercent ? "min-w-[20rem]" : "min-w-[8rem]",
        className
      )}
    >
      <div className="grid items-start gap-1.5 px-4 py-3">
        {!nestLabel ? tooltipLabel : null}
        <div className="grid gap-1.5">
          {filteredPayload.map((item, index) => {
            const key = `${nameKey || item.name || item.dataKey || "value"}`
            const itemConfig = getPayloadConfigFromPayload(config, item, key)
            const indicatorColor = color || item.payload.fill || item.color

            // ---- showPercent layout ----
            if (showPercent) {
              const numericValue = Number(item.value) || 0
              const percent = total > 0 ? (numericValue / total) * 100 : 0
              const displayValue = valueFormatter
                ? valueFormatter(numericValue)
                : numericValue.toLocaleString()
              return (
                <div
                  key={item.dataKey}
                  className="flex w-full items-center gap-1.5"
                >
                  <div className="flex min-w-0 flex-1 items-center gap-1.5">
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className="h-2 w-2 shrink-0 rounded-[2px]"
                          style={{
                            backgroundColor: indicatorColor as string,
                          }}
                        />
                      )
                    )}
                    <span className="text-muted-foreground truncate">
                      {itemConfig?.label || item.name}
                    </span>
                  </div>
                  <span className="text-foreground ml-6 text-right font-mono font-[520] tabular-nums">
                    {displayValue}
                  </span>
                  <span className="text-muted-foreground ml-2 w-14 shrink-0 text-right tabular-nums">
                    ({percent.toFixed(1)}%)
                  </span>
                </div>
              )
            }

            // ---- default layout ----
            return (
              <div
                key={item.dataKey}
                className={cn(
                  "[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-1.5 [&>svg]:h-2.5 [&>svg]:w-2.5",
                  indicator === "dot" && "items-center"
                )}
              >
                {formatter && item?.value !== undefined && item.name ? (
                  formatter(item.value, item.name, item, index, item.payload)
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <itemConfig.icon />
                    ) : (
                      !hideIndicator && (
                        <div
                          className={cn(
                            "shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)",
                            {
                              "h-2.5 w-2.5": indicator === "dot",
                              "w-1": indicator === "line",
                              "w-0 border-[1.5px] border-dashed bg-transparent":
                                indicator === "dashed",
                              "my-0.5": nestLabel && indicator === "dashed",
                            }
                          )}
                          style={
                            {
                              "--color-bg": indicatorColor,
                              "--color-border": indicatorColor,
                            } as React.CSSProperties
                          }
                        />
                      )
                    )}
                    <div
                      className={cn(
                        "flex flex-1 justify-between gap-6 leading-none",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <div className="grid gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <span className="text-muted-foreground">
                          {itemConfig?.label || item.name}
                        </span>
                      </div>
                      {item.value && (
                        <span className="text-foreground font-mono font-[520] tabular-nums">
                          {item.value.toLocaleString()}
                        </span>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
      {resolvedFooter != null && (
        <div className="border-border flex items-center gap-2 border-t px-4 py-1.5">
          {resolvedFooter}
        </div>
      )}
    </div>
  )
}

const ChartLegend = RechartsPrimitive.Legend

function ChartLegendContent({
  className,
  hideIcon = false,
  payload,
  verticalAlign = "bottom",
  nameKey,
}: React.ComponentProps<"div"> &
  Pick<RechartsPrimitive.LegendProps, "payload" | "verticalAlign"> & {
    hideIcon?: boolean
    nameKey?: string
  }) {
  const { config } = useChart()

  if (!payload?.length) {
    return null
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start gap-x-4 gap-y-2",
        verticalAlign === "top" ? "pb-3" : "pt-3",
        className
      )}
    >
      {payload
        .filter((item) => item.type !== "none")
        .map((item) => {
          const key = `${nameKey || item.dataKey || "value"}`
          const itemConfig = getPayloadConfigFromPayload(config, item, key)

          return (
            <div
              key={item.value}
              className={cn(
                "[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3"
              )}
            >
              {itemConfig?.icon && !hideIcon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: item.color,
                  }}
                />
              )}
              {itemConfig?.label}
            </div>
          )
        })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Interactive legend
//
// ChartLegendInteractive is a sibling-rendered legend (not inside the Recharts
// chart) that supports Hide / Isolate interactions via a single-click menu
// and a double-click isolate shortcut.
//
// Pair with useChartLegendInteractive and use the Recharts `hide` prop on
// each series element (Bar, Line, etc.) so visibility changes don't cause
// the chart to remount or the layout to jump.
// ---------------------------------------------------------------------------

type ChartLegendInteractiveState = {
  hiddenSeries: Set<string>
  isHidden: (key: string) => boolean
  hasHidden: boolean
  allHidden: boolean
  handleItemClick: (
    key: string,
    event: React.MouseEvent<HTMLButtonElement>
  ) => void
  handleHide: (key: string) => void
  handleIsolate: (key: string) => void
  reset: () => void
  contextMenu: { x: number; y: number; seriesKey: string } | null
  setContextMenu: (
    menu: { x: number; y: number; seriesKey: string } | null
  ) => void
}

function useChartLegendInteractive(
  config: ChartConfig
): ChartLegendInteractiveState {
  const allKeys = React.useMemo(() => Object.keys(config), [config])
  const [hiddenSeries, setHiddenSeries] = React.useState<Set<string>>(
    () => new Set()
  )
  const [contextMenu, setContextMenu] = React.useState<{
    x: number
    y: number
    seriesKey: string
  } | null>(null)
  const lastClickRef = React.useRef<{ key: string; time: number } | null>(null)

  const isHidden = React.useCallback(
    (key: string) => hiddenSeries.has(key),
    [hiddenSeries]
  )

  const handleHide = React.useCallback((key: string) => {
    setHiddenSeries((prev) => {
      const next = new Set(prev)
      next.add(key)
      return next
    })
  }, [])

  const handleIsolate = React.useCallback(
    (key: string) => {
      const next = new Set<string>()
      allKeys.forEach((k) => {
        if (k !== key) next.add(k)
      })
      setHiddenSeries(next)
    },
    [allKeys]
  )

  const handleItemClick = React.useCallback(
    (key: string, event: React.MouseEvent<HTMLButtonElement>) => {
      // Clicking a hidden series reveals it.
      if (hiddenSeries.has(key)) {
        setHiddenSeries((prev) => {
          const next = new Set(prev)
          next.delete(key)
          return next
        })
        return
      }

      // Double-click is an Isolate shortcut.
      const now = Date.now()
      const last = lastClickRef.current
      if (last && last.key === key && now - last.time < 300) {
        lastClickRef.current = null
        handleIsolate(key)
        setContextMenu(null)
        return
      }
      lastClickRef.current = { key, time: now }

      // Anchor the menu below the clicked button.
      const button = event.currentTarget
      setContextMenu({
        x: 0,
        y: button.offsetHeight + 4,
        seriesKey: key,
      })
    },
    [hiddenSeries, handleIsolate]
  )

  const reset = React.useCallback(() => {
    setHiddenSeries(new Set())
  }, [])

  return {
    hiddenSeries,
    isHidden,
    hasHidden: hiddenSeries.size > 0,
    allHidden: allKeys.length > 0 && hiddenSeries.size === allKeys.length,
    handleItemClick,
    handleHide,
    handleIsolate,
    reset,
    contextMenu,
    setContextMenu,
  }
}

function LegendMenu({
  x,
  y,
  seriesKey,
  onHide,
  onIsolate,
  onClose,
}: {
  x: number
  y: number
  seriesKey: string
  onHide: (key: string) => void
  onIsolate: (key: string) => void
  onClose: () => void
}) {
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose()
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [onClose])

  React.useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return (
    <div
      ref={menuRef}
      role="menu"
      className="absolute z-50 min-w-[160px] rounded-md border border-border bg-popover text-popover-foreground shadow-[var(--elevation-floating)] py-1"
      style={{ left: `${x}px`, top: `${y}px` }}
    >
      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors"
        onClick={() => {
          onHide(seriesKey)
          onClose()
        }}
      >
        <EyeOff className="size-3.5" />
        Hide
      </button>
      <button
        type="button"
        role="menuitem"
        className="flex w-full items-center gap-2 px-3 py-2 text-xs hover:bg-accent transition-colors"
        onClick={() => {
          onIsolate(seriesKey)
          onClose()
        }}
      >
        <Eye className="size-3.5" />
        Isolate
      </button>
    </div>
  )
}

function ChartLegendInteractive({
  config,
  legend,
  className,
}: {
  config: ChartConfig
  legend: ChartLegendInteractiveState
  className?: string
}) {
  const entries = Object.entries(config).filter(
    ([, itemConfig]) => itemConfig.label
  )

  return (
    <div
      className={cn(
        "flex flex-wrap items-center justify-start gap-x-4 gap-y-2",
        className
      )}
    >
      {entries.map(([key, itemConfig]) => {
        const hidden = legend.isHidden(key)
        const isMenuOpen = legend.contextMenu?.seriesKey === key
        const color =
          ("color" in itemConfig && itemConfig.color) ||
          `var(--color-${key})`

        return (
          <div key={key} className="relative">
            <button
              type="button"
              aria-pressed={!hidden}
              className={cn(
                "flex items-center gap-1.5 text-xs cursor-pointer transition-opacity",
                hidden && "opacity-40"
              )}
              onClick={(e) => legend.handleItemClick(key, e)}
            >
              {itemConfig.icon ? (
                <itemConfig.icon />
              ) : (
                <div
                  className="h-2 w-2 shrink-0 rounded-[2px]"
                  style={{
                    backgroundColor: hidden
                      ? "var(--muted-foreground)"
                      : (color as string),
                  }}
                />
              )}
              <span>{itemConfig.label}</span>
            </button>
            {isMenuOpen && legend.contextMenu && (
              <LegendMenu
                x={legend.contextMenu.x}
                y={legend.contextMenu.y}
                seriesKey={legend.contextMenu.seriesKey}
                onHide={legend.handleHide}
                onIsolate={legend.handleIsolate}
                onClose={() => legend.setContextMenu(null)}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}

// Helper to extract item config from a payload.
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string
) {
  if (typeof payload !== "object" || payload === null) {
    return undefined
  }

  const payloadPayload =
    "payload" in payload &&
    typeof payload.payload === "object" &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === "string"
  ) {
    configLabelKey = payload[key as keyof typeof payload] as string
  } else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === "string"
  ) {
    configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }

  return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}

export {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartLegendInteractive,
  useChartLegendInteractive,
  ChartStyle,
}
export type { ChartLegendInteractiveState, ChartTooltipFooterContext }
// CHART_DEFAULT_YAXIS_WIDTH, CHART_DEFAULT_MARGIN, and
// CHART_DEFAULT_PLOT_LEFT_OFFSET are exported at their declaration site above.
