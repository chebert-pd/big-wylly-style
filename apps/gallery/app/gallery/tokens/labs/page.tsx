"use client"

// Wyllolabs theme preview. The Labs role remap + Wonder typography apply to
// any subtree that has both `class="dark"` and `data-theme="labs"`. Wonder
// itself is not loaded in the gallery, so headings fall back to --font-sans
// (Inter) — sizes, leading, and tracking are still accurate.

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@chebert-pd/ui"
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts"

const chartData = [
  { key: "violet", label: "Violet", value: 100 },
  { key: "pink", label: "Pink", value: 84 },
  { key: "orange", label: "Orange", value: 72 },
  { key: "cyan", label: "Cyan", value: 60 },
  { key: "lime", label: "Lime", value: 48 },
  { key: "neutral", label: "Neutral", value: 32 },
]

const chartConfig = {
  violet: { label: "Violet (chart-1)", color: "var(--chart-1)" },
  pink: { label: "Pink (chart-2)", color: "var(--chart-2)" },
  orange: { label: "Orange (chart-3)", color: "var(--chart-3)" },
  cyan: { label: "Cyan (chart-4)", color: "var(--chart-4)" },
  lime: { label: "Lime (chart-5)", color: "var(--chart-5)" },
  neutral: { label: "Neutral (chart-6)", color: "var(--chart-6)" },
} satisfies ChartConfig

type Swatch = {
  token: string
  description: string
  surface: string
  text: string
}

const colorTokens: Swatch[] = [
  {
    token: "--primary",
    description: "Brand violet (was neutral gray)",
    surface: "bg-primary",
    text: "text-primary-foreground",
  },
  {
    token: "--accent",
    description: "Pink hover-lift surface",
    surface: "bg-accent",
    text: "text-accent-foreground",
  },
  {
    token: "--brand-solid",
    description: "Unchanged from base — still violet",
    surface: "bg-brand-solid",
    text: "text-brand-solid-foreground",
  },
  {
    token: "--brand",
    description: "Brand-tinted card surface",
    surface: "bg-brand",
    text: "text-brand-foreground",
  },
  {
    token: "--muted",
    description: "Inherits dark default",
    surface: "bg-muted",
    text: "text-muted-foreground",
  },
  {
    token: "--card",
    description: "Inherits dark default",
    surface: "bg-card",
    text: "text-card-foreground",
  },
]

const chartTokens = [
  { token: "--chart-1", source: "violet-58", surface: "bg-[var(--chart-1)]" },
  { token: "--chart-2", source: "pink-73", surface: "bg-[var(--chart-2)]" },
  { token: "--chart-3", source: "orange-69", surface: "bg-[var(--chart-3)]" },
  { token: "--chart-4", source: "cyan-77", surface: "bg-[var(--chart-4)]" },
  { token: "--chart-5", source: "lime-90", surface: "bg-[var(--chart-5)]" },
  { token: "--chart-6", source: "gray-98 (neutral)", surface: "bg-[var(--chart-6)]" },
]

export default function LabsThemePreviewPage() {
  return (
    <div className="space-y-12">
      {/* Page header — rendered in the gallery's own theme */}
      <div className="space-y-2">
        <h1 className="h1">Wyllolabs Theme</h1>
        <p className="p-lg text-muted-foreground">
          Dark-only theme variant. Brand violet collapses into Primary, Accent
          shifts pink, charts repaint multi-hue, and headings adopt the Wonder
          display face. Activated by setting{" "}
          <code className="rounded bg-muted px-1 font-mono text-xs">
            class=&quot;dark&quot; data-theme=&quot;labs&quot;
          </code>{" "}
          on a document or container.
        </p>
      </div>

      {/* ═══════════════════════════════════════
       * LABS PREVIEW SCOPE
       * Everything below is rendered with Labs variables active.
       * ═══════════════════════════════════════ */}
      <div
        className="dark overflow-hidden rounded-xl border border-border"
        data-theme="labs"
      >
        <div className="space-y-10 bg-background p-8">
          {/* ─────────────────────────────
           * Type scale
           * ───────────────────────────── */}
          <Card level={2}>
            <CardHeader>
              <CardTitle className="label-lg">Type scale</CardTitle>
              <CardDescription className="p">
                Wonder is not loaded in the gallery — display sizes will render
                in Inter as a fallback. Use this preview to verify scale,
                leading, and tracking; verify the typeface itself in the
                Wyllolabs app.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .labs-display — 96px
                </div>
                <div className="labs-display">Big Wylly Style</div>
              </div>

              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .h1 — 64px / 500
                </div>
                <div className="h1">Make something delightful</div>
              </div>

              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .h2 — 50px / 500
                </div>
                <div className="h2">Section heading example</div>
              </div>

              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .h3 — 40px / 500
                </div>
                <div className="h3">A subsection heading</div>
              </div>

              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .h4 — 30px / 500
                </div>
                <div className="h4">Minor heading</div>
              </div>

              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .p-lg / .p / .p-sm — 24 / 20 / 16px
                </div>
                <p className="p-lg">
                  Large body — 24px. For prominent intro paragraphs and
                  marketing-leaning copy where readability and rhythm matter.
                </p>
                <p className="p">
                  Default body — 20px. The agency spec sets Labs body at 20px,
                  noticeably larger than the in-product 14px default.
                </p>
                <p className="p-sm">
                  Small body — 16px. Use sparingly for captions or supporting
                  detail, not for primary reading flow.
                </p>
              </div>

              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .labs-eyebrow — small label, no caps
                </div>
                <div className="labs-eyebrow">A wonder-adjacent eyebrow</div>
              </div>

              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .labs-quote — 32px italic
                </div>
                <blockquote className="labs-quote">
                  &ldquo;A great brand voice carries the work even when the
                  pixels do not.&rdquo;
                </blockquote>
              </div>

              <div className="space-y-2">
                <div className="label-sm text-muted-foreground">
                  .data-lg / .data-md — Wonder for display data
                </div>
                <div className="flex flex-wrap items-baseline gap-8">
                  <div className="data-lg">$1,247,890</div>
                  <div className="data-md">+18.4%</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ─────────────────────────────
           * Color role remap
           * ───────────────────────────── */}
          <Card level={2}>
            <CardHeader>
              <CardTitle className="label-lg">Color role remap</CardTitle>
              <CardDescription className="p">
                Labs collapses Brand into Primary, so anything wired to{" "}
                <code className="font-mono text-xs">--primary</code> (focus
                rings, primary borders, sidebar primary, switch accent) picks
                up violet automatically.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {colorTokens.map((swatch) => (
                  <div
                    key={swatch.token}
                    className={`flex h-24 flex-col justify-between rounded-md border border-border p-3 ${swatch.surface} ${swatch.text}`}
                  >
                    <div className="label-sm font-mono">{swatch.token}</div>
                    <div className="p-sm">{swatch.description}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ─────────────────────────────
           * Chart progression
           * ───────────────────────────── */}
          <Card level={2}>
            <CardHeader>
              <CardTitle className="label-lg">Chart progression</CardTitle>
              <CardDescription className="p">
                Each chart slot uses the foundation step of its color ramp.
                <code className="ml-1 font-mono text-xs">--chart-6</code> is a
                neutral fallback for series that should not pull from the brand
                palette.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Swatch row */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
                {chartTokens.map((slot) => (
                  <div
                    key={slot.token}
                    className="overflow-hidden rounded-md border border-border"
                  >
                    <div className={`h-16 ${slot.surface}`} />
                    <div className="space-y-0.5 p-3">
                      <div className="label-sm font-mono">{slot.token}</div>
                      <div className="p-sm text-muted-foreground">
                        {slot.source}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Bar chart demo — ChartContainer wires --color-{key} from config */}
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-64 w-full"
              >
                <BarChart data={chartData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                  />
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <YAxis
                    tick={{ fill: "var(--muted-foreground)" }}
                    stroke="var(--border)"
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="value">
                    {chartData.map((entry) => (
                      <Cell
                        key={entry.key}
                        fill={`var(--color-${entry.key})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ChartContainer>
            </CardContent>
          </Card>

          {/* ─────────────────────────────
           * Components in Labs context
           * ───────────────────────────── */}
          <Card level={2}>
            <CardHeader>
              <CardTitle className="label-lg">Components in context</CardTitle>
              <CardDescription className="p">
                Spot-check how shared components inherit the Labs role remap
                without any per-component changes.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-3">
                <Button variant="primary">Primary action</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="destructive">Destructive</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge>Default</Badge>
                <Badge variant="brand">Brand</Badge>
                <Badge variant="success">Success</Badge>
                <Badge variant="warning">Warning</Badge>
                <Badge variant="destructive">Destructive</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
