"use client"

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  XAxis,
  YAxis,
  Area,
  AreaChart,
} from "recharts"

import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartLegendInteractive,
  ChartTooltip,
  ChartTooltipContent,
  CHART_DEFAULT_MARGIN,
  CHART_DEFAULT_PLOT_LEFT_OFFSET,
  CHART_DEFAULT_YAXIS_WIDTH,
  useChartLegendInteractive,
  type ChartConfig,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const monthlyData = [
  { month: "Jan", approved: 12400, review: 820, declined: 410 },
  { month: "Feb", approved: 13100, review: 910, declined: 380 },
  { month: "Mar", approved: 14800, review: 1040, declined: 420 },
  { month: "Apr", approved: 15900, review: 980, declined: 460 },
  { month: "May", approved: 17200, review: 1120, declined: 510 },
  { month: "Jun", approved: 18400, review: 1260, declined: 540 },
  { month: "Jul", approved: 19100, review: 1180, declined: 580 },
  { month: "Aug", approved: 20400, review: 1320, declined: 610 },
  { month: "Sep", approved: 21800, review: 1410, declined: 650 },
]

const composedData = [
  { month: "Jan", disputes: 120, amount: 24000 },
  { month: "Feb", disputes: 98, amount: 19800 },
  { month: "Mar", disputes: 145, amount: 31200 },
  { month: "Apr", disputes: 132, amount: 28600 },
  { month: "May", disputes: 168, amount: 35400 },
  { month: "Jun", disputes: 142, amount: 30800 },
  { month: "Jul", disputes: 181, amount: 39200 },
  { month: "Aug", disputes: 156, amount: 33400 },
  { month: "Sep", disputes: 194, amount: 42100 },
]

const breakdownData = [
  { name: "Approved", value: 8640, key: "approved" },
  { name: "In Review", value: 1240, key: "review" },
  { name: "Declined", value: 420, key: "declined" },
  { name: "Fraud", value: 180, key: "fraud" },
]

// ---------------------------------------------------------------------------
// Chart palette swatches
// ---------------------------------------------------------------------------

type ChartPalette = {
  name: string
  tokens: Array<{ name: string; cssVar: string }>
}

const CHART_PALETTES: ChartPalette[] = [
  {
    name: "Violet (default)",
    tokens: [
      { name: "chart-1", cssVar: "--chart-1" },
      { name: "chart-2", cssVar: "--chart-2" },
      { name: "chart-3", cssVar: "--chart-3" },
      { name: "chart-4", cssVar: "--chart-4" },
      { name: "chart-5", cssVar: "--chart-5" },
    ],
  },
  {
    name: "Orange",
    tokens: [
      { name: "chart-1-orange", cssVar: "--chart-1-orange" },
      { name: "chart-2-orange", cssVar: "--chart-2-orange" },
      { name: "chart-3-orange", cssVar: "--chart-3-orange" },
      { name: "chart-4-orange", cssVar: "--chart-4-orange" },
      { name: "chart-5-orange", cssVar: "--chart-5-orange" },
    ],
  },
  {
    name: "Pink",
    tokens: [
      { name: "chart-1-pink", cssVar: "--chart-1-pink" },
      { name: "chart-2-pink", cssVar: "--chart-2-pink" },
      { name: "chart-3-pink", cssVar: "--chart-3-pink" },
      { name: "chart-4-pink", cssVar: "--chart-4-pink" },
      { name: "chart-5-pink", cssVar: "--chart-5-pink" },
    ],
  },
  {
    name: "Cyan",
    tokens: [
      { name: "chart-1-cyan", cssVar: "--chart-1-cyan" },
      { name: "chart-2-cyan", cssVar: "--chart-2-cyan" },
      { name: "chart-3-cyan", cssVar: "--chart-3-cyan" },
      { name: "chart-4-cyan", cssVar: "--chart-4-cyan" },
      { name: "chart-5-cyan", cssVar: "--chart-5-cyan" },
    ],
  },
  {
    name: "Lime",
    tokens: [
      { name: "chart-1-lime", cssVar: "--chart-1-lime" },
      { name: "chart-2-lime", cssVar: "--chart-2-lime" },
      { name: "chart-3-lime", cssVar: "--chart-3-lime" },
      { name: "chart-4-lime", cssVar: "--chart-4-lime" },
      { name: "chart-5-lime", cssVar: "--chart-5-lime" },
    ],
  },
  {
    name: "Gray",
    tokens: [
      { name: "chart-1-gray", cssVar: "--chart-1-gray" },
      { name: "chart-2-gray", cssVar: "--chart-2-gray" },
      { name: "chart-3-gray", cssVar: "--chart-3-gray" },
      { name: "chart-4-gray", cssVar: "--chart-4-gray" },
      { name: "chart-5-gray", cssVar: "--chart-5-gray" },
    ],
  },
]

// ---------------------------------------------------------------------------
// Shared chart configs
// ---------------------------------------------------------------------------

const transactionsConfig: ChartConfig = {
  approved: { label: "Approved", color: "var(--color-chart-1)" },
  review: { label: "In Review", color: "var(--color-chart-3)" },
  declined: { label: "Declined", color: "var(--color-chart-5)" },
}

const disputesConfig: ChartConfig = {
  disputes: { label: "Dispute Count", color: "var(--color-chart-1)" },
  amount: { label: "Dollar Amount", color: "var(--color-chart-4)" },
}

const breakdownConfig: ChartConfig = {
  approved: { label: "Approved", color: "var(--color-chart-1)" },
  review: { label: "In Review", color: "var(--color-chart-2)" },
  declined: { label: "Declined", color: "var(--color-chart-3)" },
  fraud: { label: "Fraud", color: "var(--color-chart-5)" },
}

// ---------------------------------------------------------------------------
// API reference rows
// ---------------------------------------------------------------------------

const CHART_CONTAINER_ROWS: PropRow[] = [
  { prop: "config", type: "ChartConfig", required: true, description: "Maps series keys to labels and colors. Referenced in series via var(--color-<key>)." },
  { prop: "children", type: "ReactElement", required: true, description: "A single Recharts chart element (BarChart, LineChart, ComposedChart, etc.)." },
  { prop: "className", type: "string", description: "Additional CSS classes applied to the wrapping div." },
  { prop: "id", type: "string", description: "Optional stable id for the chart's CSS custom properties scope." },
]

const TOOLTIP_ROWS: PropRow[] = [
  { prop: "indicator", type: '"dot" | "line" | "dashed"', default: '"dot"', description: "Visual style of the series marker in the tooltip." },
  { prop: "hideLabel", type: "boolean", default: "false", description: "Hide the primary label row at the top of the tooltip." },
  { prop: "hideIndicator", type: "boolean", default: "false", description: "Hide the color indicator on each row." },
  { prop: "nameKey", type: "string", description: "Override which key on the payload resolves to the config entry." },
  { prop: "labelKey", type: "string", description: "Override which key on the payload resolves to the tooltip label." },
  { prop: "formatter", type: "(value, name, item, index, payload) => ReactNode", description: "Custom renderer that replaces the entire row's content in the default layout. Ignored when showPercent is true — use valueFormatter instead." },
  { prop: "labelFormatter", type: "(value, payload) => ReactNode", description: "Custom renderer for the tooltip label." },
  { prop: "showPercent", type: "boolean", default: "false", description: "Render a percentage-of-total column in each row. Switches to a wider 3-column layout (label · value · percent)." },
  { prop: "valueFormatter", type: "(value: number) => string", description: "Formats the value cell in showPercent mode. Use for currency, units, etc. Ignored outside showPercent." },
  { prop: "footer", type: "ReactNode | ({ payload, total }) => ReactNode", description: "Optional footer row with a border-top and tighter py-1.5 padding. Pass a ReactNode for free-form copy (e.g. 'Last 30 days') or a function for a total-aware row. Not locked to a 'Total' label." },
]

const INTERACTIVE_LEGEND_ROWS: PropRow[] = [
  { prop: "config", type: "ChartConfig", required: true, description: "Same config passed to ChartContainer. Determines legend items, labels, and colors." },
  { prop: "legend", type: "ChartLegendInteractiveState", required: true, description: "The state object returned from useChartLegendInteractive(config)." },
  { prop: "className", type: "string", description: "Additional classes on the legend wrapper (flex container)." },
]

const HOOK_ROWS: PropRow[] = [
  { prop: "isHidden(key)", type: "(key: string) => boolean", description: "Whether a given series is currently hidden. Pass to each Recharts series' `hide` prop." },
  { prop: "hasHidden", type: "boolean", description: "Whether any series is hidden. Use to toggle Reset button visibility." },
  { prop: "allHidden", type: "boolean", description: "Whether every series is hidden. Use to render an empty state." },
  { prop: "handleItemClick", type: "(key, event) => void", description: "Wired into each legend item. Opens menu on visible items, reveals hidden items, handles double-click isolate shortcut." },
  { prop: "handleHide", type: "(key: string) => void", description: "Hides the given series. Called by the 'Hide' menu action." },
  { prop: "handleIsolate", type: "(key: string) => void", description: "Hides every series except the given one. Called by the 'Isolate' menu action." },
  { prop: "reset", type: "() => void", description: "Reveals every series. Use for a Reset button." },
  { prop: "contextMenu", type: "{ x, y, seriesKey } | null", description: "Current menu anchor state. ChartLegendInteractive uses this internally." },
]

const LAYOUT_CONSTANT_ROWS: PropRow[] = [
  { prop: "CHART_DEFAULT_MARGIN", type: "{ top, right, left, bottom }", description: "4px-grid-aligned default margin for Recharts charts with a Y-axis. Pairs with the YAxis width and plot-left offset." },
  { prop: "CHART_DEFAULT_YAXIS_WIDTH", type: "number", description: "Default YAxis `width` prop (48px). Keeps the plot-area left edge on the 4px grid." },
  { prop: "CHART_DEFAULT_PLOT_LEFT_OFFSET", type: "number", description: "Distance from container-left to plot-area-left (40px). Apply as `paddingLeft` on the legend wrapper so the legend aligns with the chart's 0-axis. Do NOT apply to charts without a Y-axis." },
]

// ---------------------------------------------------------------------------
// Interactive chart — pulled out for clarity
// ---------------------------------------------------------------------------

function InteractiveLegendChart() {
  const legend = useChartLegendInteractive(disputesConfig)

  return (
    <div className="flex flex-col gap-6">
      <ChartContainer config={disputesConfig} className="aspect-auto h-[280px] w-full">
        <ComposedChart data={composedData} margin={CHART_DEFAULT_MARGIN}>
          <CartesianGrid vertical={false} stroke="var(--border)" />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <YAxis
            yAxisId="left"
            width={CHART_DEFAULT_YAXIS_WIDTH}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            width={CHART_DEFAULT_YAXIS_WIDTH}
            tickLine={false}
            axisLine={false}
            tickFormatter={(v: number) =>
              v >= 1000 ? `$${(v / 1000).toFixed(0)}k` : `$${v}`
            }
          />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar
            yAxisId="left"
            dataKey="disputes"
            fill="var(--color-disputes)"
            radius={[4, 4, 0, 0]}
            hide={legend.isHidden("disputes")}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="amount"
            stroke="var(--color-amount)"
            strokeWidth={2}
            dot={{ r: 3 }}
            hide={legend.isHidden("amount")}
          />
        </ComposedChart>
      </ChartContainer>

      {/* Legend wrapper: paddingLeft aligns with plot-area 0-axis.
          overflow-visible needed because the interactive legend's
          dropdown menu is absolutely positioned inside. */}
      <div
        className="flex flex-wrap items-center justify-start gap-x-4 gap-y-2 overflow-visible"
        style={{ paddingLeft: CHART_DEFAULT_PLOT_LEFT_OFFSET }}
      >
        <ChartLegendInteractive config={disputesConfig} legend={legend} />
        <Button
          variant="outline"
          size="xs"
          onClick={legend.reset}
          className={legend.hasHidden ? "visible" : "invisible"}
        >
          Reset
        </Button>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function ChartPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="h1">Chart</h1>
        <p className="p text-muted-foreground max-w-2xl">
          Design-system integration layer for Recharts. Provides themed colors,
          card-styled tooltips, wrapping left-aligned legends, and an interactive
          legend with Hide / Isolate.
        </p>
      </div>

      {/* -------------------------------- */}
      {/* Color Usage */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Color Usage</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            Each palette has 5 tokens.{" "}
            <code className="label-sm">chart-1</code> is the featured accent —
            the brand color for hued palettes, or{" "}
            <code className="label-sm">primary</code> for gray.{" "}
            <code className="label-sm">chart-2</code> is the darkest supporting
            tone, and <code className="label-sm">chart-3</code> through{" "}
            <code className="label-sm">chart-5</code> step progressively lighter
            from there. Use the default violet for primary charts; switch to a
            named palette (e.g.{" "}
            <code className="label-sm">chart-1-orange</code>) when a chart needs
            a different accent or when multiple charts sit side-by-side.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {CHART_PALETTES.map((palette) => (
            <Card key={palette.name}>
              <CardHeader>
                <CardTitle>{palette.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {palette.tokens.map((token) => (
                  <div key={token.name} className="flex items-center gap-3">
                    <div
                      className="size-6 rounded-md border border-border shrink-0"
                      style={{ backgroundColor: `var(${token.cssVar})` }}
                    />
                    <code className="label-sm text-muted-foreground">
                      {token.name}
                    </code>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Interactive legend — the headline */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Interactive Legend</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            Click a visible series to open Hide / Isolate. Click a hidden series
            to reveal it. Double-click a visible series to isolate it. Legend
            items wrap, align left, and sit flush with the chart's 0-axis via
            <code className="label-sm mx-1">CHART_DEFAULT_PLOT_LEFT_OFFSET</code>.
          </p>
        </div>
        <Card className="overflow-visible">
          <CardHeader>
            <CardTitle>Disputes over time</CardTitle>
            <CardDescription>
              Composed bar + line chart with interactive legend
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-visible">
            <InteractiveLegendChart />
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* Tooltip — themed card surface */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Tooltip</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            <code className="label-sm">ChartTooltipContent</code> uses the popover
            surface token, 4px radius, floating elevation, and px-4 py-3 padding.
            Hover any bar to see it.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Transactions by status</CardTitle>
            <CardDescription>
              Stacked bar chart with themed tooltip and themed legend
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={transactionsConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <BarChart data={monthlyData} margin={CHART_DEFAULT_MARGIN}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  width={CHART_DEFAULT_YAXIS_WIDTH}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="approved"
                  stackId="a"
                  fill="var(--color-approved)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="review"
                  stackId="a"
                  fill="var(--color-review)"
                  radius={[0, 0, 0, 0]}
                />
                <Bar
                  dataKey="declined"
                  stackId="a"
                  fill="var(--color-declined)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* Tooltip with showPercent + footer */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Tooltip — showPercent + footer</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            Pass <code className="label-sm">showPercent</code> to render a
            percentage-of-total column alongside each value.{" "}
            <code className="label-sm">valueFormatter</code> controls how the
            value cell is displayed, and <code className="label-sm">footer</code>
            {" "}takes either a ReactNode (free-form copy) or a function that
            receives <code className="label-sm">{"{ payload, total }"}</code>{" "}
            for a total row. The footer has tighter <code className="label-sm">py-1.5</code>{" "}
            padding and a border-top divider.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Transactions with totals</CardTitle>
            <CardDescription>
              Hover any bar — tooltip shows value, percent, and a total footer
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={transactionsConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <BarChart data={monthlyData} margin={CHART_DEFAULT_MARGIN}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  width={CHART_DEFAULT_YAXIS_WIDTH}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      showPercent
                      valueFormatter={(v) => v.toLocaleString()}
                      footer={({ total }) => (
                        <>
                          <span className="text-muted-foreground flex-1">
                            Total
                          </span>
                          <span className="text-foreground text-right font-mono font-[520] tabular-nums">
                            {total.toLocaleString()}
                          </span>
                          {/* spacer aligns with the percent column above */}
                          <span className="w-14 shrink-0" />
                        </>
                      )}
                    />
                  }
                />
                <ChartLegend content={<ChartLegendContent />} />
                <Bar
                  dataKey="approved"
                  stackId="a"
                  fill="var(--color-approved)"
                />
                <Bar
                  dataKey="review"
                  stackId="a"
                  fill="var(--color-review)"
                />
                <Bar
                  dataKey="declined"
                  stackId="a"
                  fill="var(--color-declined)"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* Tooltip with static footer copy */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Tooltip — static footer copy</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            The footer is not locked to a Total label. Pass a ReactNode for
            free-form context like a date range, a hint, or an annotation.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Approved transactions</CardTitle>
            <CardDescription>Line chart with a contextual footer</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ approved: transactionsConfig.approved! }}
              className="aspect-auto h-[260px] w-full"
            >
              <LineChart data={monthlyData} margin={CHART_DEFAULT_MARGIN}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  width={CHART_DEFAULT_YAXIS_WIDTH}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      footer={
                        <span className="text-muted-foreground">
                          Rolling 9-month window
                        </span>
                      }
                    />
                  }
                />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="var(--color-approved)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* Line chart */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Line Chart</h2>
        <Card>
          <CardHeader>
            <CardTitle>Approved transactions</CardTitle>
            <CardDescription>Time-series line with themed color</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ approved: transactionsConfig.approved! }}
              className="aspect-auto h-[260px] w-full"
            >
              <LineChart data={monthlyData} margin={CHART_DEFAULT_MARGIN}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  width={CHART_DEFAULT_YAXIS_WIDTH}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                <Line
                  type="monotone"
                  dataKey="approved"
                  stroke="var(--color-approved)"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* Area chart */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Area Chart</h2>
        <Card>
          <CardHeader>
            <CardTitle>Transaction volume</CardTitle>
            <CardDescription>Stacked area chart</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={transactionsConfig}
              className="aspect-auto h-[280px] w-full"
            >
              <AreaChart data={monthlyData} margin={CHART_DEFAULT_MARGIN}>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  width={CHART_DEFAULT_YAXIS_WIDTH}
                  tickLine={false}
                  axisLine={false}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
                <Area
                  type="monotone"
                  dataKey="approved"
                  stackId="a"
                  stroke="var(--color-approved)"
                  fill="var(--color-approved)"
                  fillOpacity={0.25}
                />
                <Area
                  type="monotone"
                  dataKey="review"
                  stackId="a"
                  stroke="var(--color-review)"
                  fill="var(--color-review)"
                  fillOpacity={0.25}
                />
                <Area
                  type="monotone"
                  dataKey="declined"
                  stackId="a"
                  stroke="var(--color-declined)"
                  fill="var(--color-declined)"
                  fillOpacity={0.25}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* Pie chart — no Y-axis, no offset */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <div className="space-y-1">
          <h2 className="h2">Pie Chart</h2>
          <p className="p-sm text-muted-foreground max-w-2xl">
            Charts without a Y-axis (pie, radial, horizontal bar) do NOT apply
            the plot-left offset — their legends align with the container edge.
          </p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Transaction breakdown</CardTitle>
            <CardDescription>Single-period categorical distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={breakdownConfig}
              className="aspect-auto h-[300px] w-full"
            >
              <PieChart>
                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                <Pie
                  data={breakdownData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                >
                  {breakdownData.map((entry) => (
                    <Cell
                      key={entry.key}
                      fill={`var(--color-${entry.key})`}
                    />
                  ))}
                </Pie>
                <Legend
                  content={<ChartLegendContent nameKey="name" />}
                  verticalAlign="bottom"
                />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* API Reference */}
      {/* -------------------------------- */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="ChartContainer" rows={CHART_CONTAINER_ROWS} />
        <PropTable title="ChartTooltipContent" rows={TOOLTIP_ROWS} />
        <PropTable title="ChartLegendInteractive" rows={INTERACTIVE_LEGEND_ROWS} />
        <PropTable title="useChartLegendInteractive — returned state" rows={HOOK_ROWS} />
        <PropTable title="Layout constants" rows={LAYOUT_CONSTANT_ROWS} />
      </section>
    </div>
  )
}
