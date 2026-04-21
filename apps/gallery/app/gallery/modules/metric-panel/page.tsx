"use client"

import * as React from "react"
import { BarChart3, Laptop, Smartphone } from "lucide-react"

import { MetricPanel } from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const METRIC_PANEL_ROWS: PropRow[] = [
  { prop: "title", type: "string", description: "Optional heading rendered above the metric tabs." },
  { prop: "subtitle", type: "string", description: "Optional description rendered below the title." },
  { prop: "items", type: "MetricItem[]", required: true, description: "Array of metric items to display as tabs." },
  { prop: "defaultOpenKey", type: "string", description: "Key of the metric to expand by default. All metrics are collapsed when omitted." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const METRIC_ITEM_ROWS: PropRow[] = [
  { prop: "key", type: "string", required: true, description: "Unique identifier for the metric tab." },
  { prop: "label", type: "string", required: true, description: "Label displayed on the stat card." },
  { prop: "value", type: "string", required: true, description: "Large value displayed on the stat card." },
  { prop: "icon", type: "ReactNode", description: "Icon rendered on the stat card." },
  { prop: "description", type: "string", description: "Secondary description text on the stat card." },
  { prop: "secondary", type: "ReactNode", description: "Additional secondary content on the stat card." },
  { prop: "content", type: "ReactNode", required: true, description: "The expanded content (chart, table, etc.) shown when the metric is selected." },
]

export default function MetricPanelPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2">
        <h1 className="h1">Metric Panel</h1>
        <p className="p text-muted-foreground">
          Large stat tabs that expand to reveal detailed analytics.
        </p>
      </div>

      <MetricPanel
        title="Traffic by platform"
        subtitle="Select a platform to view the breakdown."
        defaultOpenKey={undefined}
        items={[
          {
            key: "desktop",
            label: "Desktop",
            value: "7,324",
            icon: <Laptop className="size-5" />,
            description: "Web",
            content: (
              <div className="rounded-[var(--radius)] border border-border bg-card p-6">
                <p className="p text-muted-foreground">Chart placeholder (Desktop)</p>
              </div>
            ),
          },
          {
            key: "mobile",
            label: "Mobile",
            value: "7,250",
            icon: <Smartphone className="size-5" />,
            description: "iOS + Android",
            content: (
              <div className="rounded-[var(--radius)] border border-border bg-card p-6">
                <p className="p text-muted-foreground">Chart placeholder (Mobile)</p>
              </div>
            ),
          },
          {
            key: "total",
            label: "Total",
            value: "14,574",
            icon: <BarChart3 className="size-5" />,
            description: "All platforms",
            content: (
              <div className="rounded-[var(--radius)] border border-border bg-card p-6">
                <p className="p text-muted-foreground">Chart placeholder (Total)</p>
              </div>
            ),
          },
        ]}
      />

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="MetricPanel" rows={METRIC_PANEL_ROWS} />
        <PropTable title="MetricItem" rows={METRIC_ITEM_ROWS} />
      </section>
    </div>
  )
}
