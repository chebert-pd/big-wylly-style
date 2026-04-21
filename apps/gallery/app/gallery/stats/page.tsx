"use client"

import {
  ShoppingBag,
  ClipboardClock,
  CircleCheck,
  DollarSign,
} from "lucide-react"

import { Card, CardContent, CardFooter, StatBlock, Button } from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const STAT_BLOCK_ROWS: PropRow[] = [
  { prop: "label", type: "string", required: true, description: "The stat's display label." },
  { prop: "value", type: "string", required: true, description: "The primary metric value displayed prominently." },
  { prop: "size", type: '"default" | "lg"', default: '"default"', description: "Layout density. default = gap-1 (compact), lg = gap-6 (spacious)." },
  { prop: "valueSize", type: '"sm" | "md" | "lg"', default: '"md"', description: "Controls the scale of the primary metric number." },
  { prop: "icon", type: "ReactNode", description: "Optional icon anchored to the top-right." },
  { prop: "description", type: "string", description: "Small muted text below the label." },
  { prop: "secondary", type: "ReactNode", description: "Secondary line below the value. Use for explainer copy or trend sentence." },
  { prop: "trend", type: '{ value: string; direction: "up" | "down"; tone?: "success" | "destructive" | "neutral" }', description: 'Renders an icon + text indicator next to (or below) the value. tone defaults to direction-inferred (up → success, down → destructive).' },
  { prop: "trendPosition", type: '"inline" | "between" | "below"', default: '"inline"', description: 'Controls where trend sits relative to the value. "inline" — side by side; "between" — value left, trend right, full width; "below" — trend on its own line.' },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function StatsPage() {
  return (
    <div className="space-y-10">
      <h1 className="h1">StatBlock</h1>

      {/* -------------------------------- */}
      {/* Row of 3 — Level 1 Card */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Card — 3 Across</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card level={1}>
            <CardContent>
              <StatBlock
                icon={<ShoppingBag className="size-5" />}
                label="Total Orders"
                value="12,482"
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                icon={<ClipboardClock className="size-5" />}
                label="Orders in Review"
                value="184"
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                icon={<CircleCheck className="size-5" />}
                label="Pass Rate"
                value="96.8%"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Row of 4 — With Footer Note */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Card — With Footer Note</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Approval Rate"
                value="97.2%"
                valueSize="lg"
                trend={{ direction: "up", value: "+1.4%" }}
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <span className="p-sm text-muted-foreground">vs last period</span>
            </CardFooter>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Revenue Passed"
                value="$482,320"
                valueSize="lg"
                trend={{ direction: "up", value: "+6.2%" }}
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <span className="p-sm text-muted-foreground">vs last period</span>
            </CardFooter>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Fraud Prevented"
                value="$38,420"
                valueSize="lg"
                trend={{ direction: "up", value: "+4.8%" }}
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <span className="p-sm text-muted-foreground">vs last period</span>
            </CardFooter>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Customer ROI"
                value="4.2x"
                valueSize="lg"
                trend={{ direction: "up", value: "+0.6x" }}
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <span className="p-sm text-muted-foreground">vs last period</span>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Row of 4 — With Footer Action */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Card — With Footer Action</h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(14rem,1fr))] gap-4">
          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Approval Rate"
                value="97.2%"
                valueSize="lg"
                trend={{ direction: "up", value: "+1.4%" }}
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <Button variant="ghost" size="xs">Generate report</Button>
            </CardFooter>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Revenue Passed"
                value="$482,320"
                valueSize="lg"
                trend={{ direction: "up", value: "+6.2%" }}
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <Button variant="ghost" size="xs">Generate report</Button>
            </CardFooter>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Fraud Prevented"
                value="$38,420"
                valueSize="lg"
                trend={{ direction: "up", value: "+4.8%" }}
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <Button variant="ghost" size="xs">Generate report</Button>
            </CardFooter>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Customer ROI"
                value="4.2x"
                valueSize="lg"
                trend={{ direction: "up", value: "+0.6x" }}
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <Button variant="ghost" size="xs">Generate report</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Trend — Positions */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Trend — Positions</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Inline (default)"
                value="$12,400"
                valueSize="lg"
                trend={{ direction: "up", value: "+12.5%" }}
                trendPosition="inline"
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Between"
                value="$12,400"
                valueSize="lg"
                trend={{ direction: "up", value: "+12.5%" }}
                trendPosition="between"
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Below"
                value="$12,400"
                valueSize="lg"
                trend={{ direction: "up", value: "+12.5%" }}
                trendPosition="below"
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Trend — Tones */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Trend — Tones</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Success (up, default)"
                value="97.2%"
                valueSize="lg"
                trend={{ direction: "up", value: "+1.4%" }}
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Destructive (down, default)"
                value="42%"
                valueSize="lg"
                trend={{ direction: "down", value: "-3.2%" }}
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Neutral (explicit)"
                value="8,200"
                valueSize="lg"
                trend={{ direction: "up", value: "0.0%", tone: "neutral" }}
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                label="Success + Down (cost reduction)"
                value="$24,100"
                valueSize="lg"
                trend={{ direction: "down", value: "-8.3%", tone: "success" }}
              />
            </CardContent>
          </Card>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* Level 2 — Nested */}
      {/* -------------------------------- */}
      <section className="space-y-4">
        <h2 className="h2">Level 2 — Nested</h2>
        <Card level={1}>
          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Card level={2}>
                <CardContent>
                  <StatBlock
                    icon={<ShoppingBag className="size-5" />}
                    label="Orders"
                    value="12,482"
                    valueSize="sm"
                  />
                </CardContent>
              </Card>

              <Card level={2}>
                <CardContent>
                  <StatBlock
                    icon={<DollarSign className="size-5" />}
                    label="Lifetime Spent"
                    value="$1.2M"
                    valueSize="sm"
                  />
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* -------------------------------- */}
      {/* Large (size lg) — Combinations */}
      {/* -------------------------------- */}
      <section className="space-y-6">
        <h2 className="h2">Size lg — Spacious Layout</h2>

        {/* Row 1 — Minimal */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                label="Total Orders"
                value="12,482"
                valueSize="lg"
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                label="Revenue Passed"
                value="$482,320"
                valueSize="lg"
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                label="Fraud Prevented"
                value="$38,420"
                valueSize="lg"
              />
            </CardContent>
          </Card>
        </div>

        {/* Row 2 — With Icon + Secondary */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                icon={<ShoppingBag className="size-5" />}
                label="Total Orders"
                value="12,482"
                valueSize="lg"
                secondary="Includes approved and reviewed transactions"
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                icon={<ClipboardClock className="size-5" />}
                label="Orders in Review"
                value="184"
                valueSize="lg"
                secondary="Pending manual review"
              />
            </CardContent>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                icon={<CircleCheck className="size-5" />}
                label="Pass Rate"
                value="96.8%"
                valueSize="lg"
                secondary="Across all merchants"
              />
            </CardContent>
          </Card>
        </div>

        {/* Row 3 — With Footer Action */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                label="Approval Rate"
                value="97.2%"
                valueSize="lg"
                secondary="Compared to previous period"
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <Button variant="ghost" size="xs">View breakdown</Button>
            </CardFooter>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                icon={<DollarSign className="size-5" />}
                label="Revenue Passed"
                value="$482,320"
                valueSize="lg"
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <Button variant="ghost" size="xs">Generate report</Button>
            </CardFooter>
          </Card>

          <Card level={1}>
            <CardContent>
              <StatBlock
                size="lg"
                label="Customer ROI"
                value="4.2x"
                valueSize="lg"
                secondary="Average return per merchant"
              />
            </CardContent>
            <CardFooter data-divider className="bg-secondary">
              <Button variant="ghost" size="xs">View details</Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      {/* -------------------------------- */}
      {/* API Reference */}
      {/* -------------------------------- */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="StatBlock" rows={STAT_BLOCK_ROWS} />
      </section>
    </div>
  )
}
