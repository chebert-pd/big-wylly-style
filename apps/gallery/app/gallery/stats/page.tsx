"use client"

import {
  ShoppingBag,
  ClipboardClock,
  CircleCheck,
  DollarSign,
} from "lucide-react"

import { StatCard, StatsGrid } from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const STAT_CARD_ROWS: PropRow[] = [
  { prop: "label", type: "string", required: true, description: "The stat's display label." },
  { prop: "value", type: "string", required: true, description: "The primary metric value displayed prominently." },
  { prop: "variant", type: '"default" | "large"', default: '"default"', description: '"large" uses a spacious two-row layout with a full-width centered footer action.' },
  { prop: "size", type: '"default" | "lg"', default: '"default"', description: "Card padding and typography density." },
  { prop: "valueSize", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls the scale of the primary metric number." },
  { prop: "surfaceLevel", type: "0 | 1 | 2", default: "0", description: "The surface the card sits on. Automatically picks the next elevation level up so the card always reads above its container." },
  { prop: "icon", type: "ReactNode", description: "Optional icon anchored to the top-right of the card." },
  { prop: "description", type: "string", description: "Small muted text below the label." },
  { prop: "secondary", type: "ReactNode", description: "Secondary line below the value. Use for explainer copy or a trend sentence." },
  { prop: "trend", type: '{ value: string; direction: "up" | "down"; tone?: "success" | "destructive" | "neutral" }', description: 'Renders an icon + text indicator next to (or below) the value. tone controls the color; defaults to direction-inferred (up → success, down → destructive).' },
  { prop: "trendPosition", type: '"inline" | "between" | "below"', default: '"inline"', description: 'Controls where trend sits relative to the value. "inline" — side by side; "between" — value left, trend right, full width; "below" — trend on its own line.' },
  { prop: "comparison", type: "ReactNode", description: 'Footer left-side text, e.g. "vs last period".' },
  { prop: "action", type: '{ label: string; onClick?: () => void }', description: "Footer action rendered as a ghost button." },
  { prop: "className", type: "string", description: "Additional CSS classes applied to the outer card." },
]

const STATS_GRID_ROWS: PropRow[] = [
  { prop: "children", type: "ReactNode", required: true, description: "StatCard elements. surfaceLevel is injected automatically unless already set on a child." },
  { prop: "surfaceLevel", type: "0 | 1 | 2", default: "0", description: "Passed to all StatCard children that don't define their own surfaceLevel." },
  { prop: "className", type: "string", description: "Additional CSS classes on the grid wrapper (4-col by default)." },
]

export default function StatsPage() {
  return (
    <div className="space-y-10">
      <h1 className="h1">Stats</h1>

      {/* -------------------------------- */}
      {/* Row of 3 — Level 0 */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Level 0 — 3 Across</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            surfaceLevel={0}
            icon={<ShoppingBag className="size-5" />}
            label="Total Orders"
            value="12,482"
            valueSize="md"
          />

          <StatCard
            surfaceLevel={0}
            icon={<ClipboardClock className="size-5" />}
            label="Orders in Review"
            value="184"
            valueSize="md"
          />

          <StatCard
            surfaceLevel={0}
            icon={<CircleCheck className="size-5" />}
            label="Pass Rate"
            value="96.8%"
            valueSize="md"
          />
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Row of 4 — With Badges + Comparison */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Level 0 — With Comparison</h2>
        <StatsGrid surfaceLevel={0}>
          <StatCard
            label="Approval Rate"
            value="97.2%"
            valueSize="lg"
            trend={{ direction: "up", value: "+1.4%" }}
            comparison="vs last period"
          />

          <StatCard
            label="Revenue Passed"
            value="$482,320"
            valueSize="lg"
            trend={{ direction: "up", value: "+6.2%" }}
            comparison="vs last period"
          />

          <StatCard
            label="Fraud Prevented"
            value="$38,420"
            valueSize="lg"
            trend={{ direction: "up", value: "+4.8%" }}
            comparison="vs last period"
          />

          <StatCard
            label="Customer ROI"
            value="4.2x"
            valueSize="lg"
            trend={{ direction: "up", value: "+0.6x" }}
            comparison="vs last period"
          />
        </StatsGrid>
      </section>

      {/* -------------------------------- */}
      {/* Row of 4 — With Action */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Level 0 — With Action</h2>
        <StatsGrid surfaceLevel={0}>
          <StatCard
            label="Approval Rate"
            value="97.2%"
            valueSize="lg"
            trend={{ direction: "up", value: "+1.4%" }}
            action={{ label: "Generate report" }}
          />

          <StatCard
            label="Revenue Passed"
            value="$482,320"
            valueSize="lg"
            trend={{ direction: "up", value: "+6.2%" }}
            action={{ label: "Generate report" }}
          />

          <StatCard
            label="Fraud Prevented"
            value="$38,420"
            valueSize="lg"
            trend={{ direction: "up", value: "+4.8%" }}
            action={{ label: "Generate report" }}
          />

          <StatCard
            label="Customer ROI"
            value="4.2x"
            valueSize="lg"
            trend={{ direction: "up", value: "+0.6x" }}
            action={{ label: "Generate report" }}
          />
        </StatsGrid>
      </section>

      {/* -------------------------------- */}
      {/* Trend — Positions */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Trend — Positions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            surfaceLevel={0}
            label="Inline (default)"
            value="$12,400"
            valueSize="lg"
            trend={{ direction: "up", value: "+12.5%" }}
            trendPosition="inline"
          />
          <StatCard
            surfaceLevel={0}
            label="Between"
            value="$12,400"
            valueSize="lg"
            trend={{ direction: "up", value: "+12.5%" }}
            trendPosition="between"
          />
          <StatCard
            surfaceLevel={0}
            label="Below"
            value="$12,400"
            valueSize="lg"
            trend={{ direction: "up", value: "+12.5%" }}
            trendPosition="below"
          />
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Trend — Tones */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Trend — Tones</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <StatCard
            surfaceLevel={0}
            label="Success (up, default)"
            value="97.2%"
            valueSize="lg"
            trend={{ direction: "up", value: "+1.4%" }}
          />
          <StatCard
            surfaceLevel={0}
            label="Destructive (down, default)"
            value="42%"
            valueSize="lg"
            trend={{ direction: "down", value: "-3.2%" }}
          />
          <StatCard
            surfaceLevel={0}
            label="Neutral (explicit)"
            value="8,200"
            valueSize="lg"
            trend={{ direction: "up", value: "0.0%", tone: "neutral" }}
          />
          <StatCard
            surfaceLevel={0}
            label="Success + Down (cost reduction)"
            value="$24,100"
            valueSize="lg"
            trend={{ direction: "down", value: "-8.3%", tone: "success" }}
          />
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Row of 2 — Level 1 */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Level 1 — Nested</h2>
        <div className="bg-card p-6 rounded-[var(--radius)] border border-border">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <StatCard
              surfaceLevel={1}
              icon={<ShoppingBag className="size-5" />}
              label="Orders"
              value="12,482"
              valueSize="sm"
            />

            <StatCard
              surfaceLevel={1}
              icon={<DollarSign className="size-5" />}
              label="Lifetime Spent"
              value="$1.2M"
              valueSize="sm"
            />
          </div>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Large Variant — Combinations */}
      {/* -------------------------------- */}
      <section className="space-y-6">
        <h2 className="h2">Level 0 — Large Variant Combinations</h2>

        {/* Row 1 — Minimal (Required Only) */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            variant="large"
            surfaceLevel={0}
            label="Total Orders"
            value="12,482"
            valueSize="lg"
          />

          <StatCard
            variant="large"
            surfaceLevel={0}
            label="Revenue Passed"
            value="$482,320"
            valueSize="lg"
          />

          <StatCard
            variant="large"
            surfaceLevel={0}
            label="Fraud Prevented"
            value="$38,420"
            valueSize="lg"
          />
        </div>

        {/* Row 2 — With Icon + Secondary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            variant="large"
            surfaceLevel={0}
            icon={<ShoppingBag className="size-5" />}
            label="Total Orders"
            value="12,482"
            valueSize="lg"
            secondary="Includes approved and reviewed transactions"
          />

          <StatCard
            variant="large"
            surfaceLevel={0}
            icon={<ClipboardClock className="size-5" />}
            label="Orders in Review"
            value="184"
            valueSize="lg"
            secondary="Pending manual review"
          />

          <StatCard
            variant="large"
            surfaceLevel={0}
            icon={<CircleCheck className="size-5" />}
            label="Pass Rate"
            value="96.8%"
            valueSize="lg"
            secondary="Across all merchants"
          />
        </div>

        {/* Row 3 — With Action */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <StatCard
            variant="large"
            surfaceLevel={0}
            label="Approval Rate"
            value="97.2%"
            valueSize="lg"
            secondary="Compared to previous period"
            action={{ label: "View breakdown" }}
          />

          <StatCard
            variant="large"
            surfaceLevel={0}
            icon={<DollarSign className="size-5" />}
            label="Revenue Passed"
            value="$482,320"
            valueSize="lg"
            action={{ label: "Generate report" }}
          />

          <StatCard
            variant="large"
            surfaceLevel={0}
            label="Customer ROI"
            value="4.2x"
            valueSize="lg"
            secondary="Average return per merchant"
            action={{ label: "View details" }}
          />
        </div>
      </section>

      {/* -------------------------------- */}
      {/* API Reference */}
      {/* -------------------------------- */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="StatCard" rows={STAT_CARD_ROWS} />
        <PropTable title="StatsGrid" rows={STATS_GRID_ROWS} />
      </section>
    </div>
  )
}