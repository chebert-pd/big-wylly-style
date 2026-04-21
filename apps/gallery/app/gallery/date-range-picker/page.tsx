"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"

import { DateRangePicker, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

// ─── Prop table data ──────────────────────────────────────────────────────────

const DATE_RANGE_PICKER_ROWS: PropRow[] = [
  {
    prop: "value",
    type: "DateRange | undefined",
    description: "Controlled selected range ({ from, to }).",
  },
  {
    prop: "onChange",
    type: "(range: DateRange | undefined) => void",
    required: true,
    description: "Called when the user selects a range or clears via the calendar footer.",
  },
  {
    prop: "onClear",
    type: "() => void",
    description: "When provided, renders an × button inside the trigger to clear the range.",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    default: '"end"',
    description: "Alignment of the popover relative to the trigger.",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra classes forwarded to the trigger Button.",
  },
]

// ─── Small controlled wrapper used in each demo ───────────────────────────────

function PickerDemo({
  label,
  initialValue,
  showClear = true,
  align,
}: {
  label: string
  initialValue?: DateRange
  showClear?: boolean
  align?: "start" | "center" | "end"
}) {
  const [range, setRange] = React.useState<DateRange | undefined>(initialValue)

  return (
    <div className="flex flex-col gap-2">
      <div className="label-sm text-muted-foreground">{label}</div>
      <DateRangePicker
        value={range}
        onChange={setRange}
        onClear={showClear ? () => setRange(undefined) : undefined}
        align={align}
      />
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DateRangePickerPage() {
  const [filterRange, setFilterRange] = React.useState<DateRange | undefined>()

  // Pre-built ranges for demos
  const last30: DateRange = React.useMemo(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 30)
    return { from, to }
  }, [])

  const last7: DateRange = React.useMemo(() => {
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 7)
    return { from, to }
  }, [])

  return (
    <div className="space-y-12">

      {/* Page header */}
      <div className="space-y-2">
        <div className="h1">Date Range Picker</div>
        <p className="p text-muted-foreground">
          Filter control for selecting a date range. Includes quick presets, a two-month
          calendar, and a footer with day count and apply/clear actions.
        </p>
      </div>

      {/* ── Live interactive demo ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Live example</CardTitle>
          <CardDescription className="p-sm">
            Open the picker, choose a range or use the quick presets, then apply.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-3">
            <DateRangePicker
              value={filterRange}
              onChange={setFilterRange}
              onClear={() => setFilterRange(undefined)}
              align="start"
            />
            {filterRange?.from && filterRange?.to && (
              <p className="p-sm text-muted-foreground">
                {Math.round(
                  (filterRange.to.getTime() - filterRange.from.getTime()) /
                    (1000 * 60 * 60 * 24)
                )}{" "}
                days selected
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── States ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Trigger states</CardTitle>
          <CardDescription className="p-sm">
            The trigger adapts its label and shows a clear button when a range is set.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <PickerDemo label="Empty (no selection)" showClear={false} />
          <PickerDemo label="Single date picked" initialValue={{ from: new Date(), to: undefined }} />
          <PickerDemo label="Full range — Last 30 days" initialValue={last30} />
          <PickerDemo label="Full range — Last 7 days" initialValue={last7} />
        </CardContent>
      </Card>

      {/* ── In-context: filter bar ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">In context — transaction filter bar</CardTitle>
          <CardDescription className="p-sm">
            Paired with other filters as it would appear above a DataTable on a
            fraud or chargeback review page.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-2">
            {/* Simulated peer filters */}
            <select className="h-9 rounded-[var(--radius)] border border-border bg-secondary px-3 text-sm text-muted-foreground focus:outline-none">
              <option>All statuses</option>
              <option>Pending review</option>
              <option>Approved</option>
              <option>Disputed</option>
            </select>
            <select className="h-9 rounded-[var(--radius)] border border-border bg-secondary px-3 text-sm text-muted-foreground focus:outline-none">
              <option>All networks</option>
              <option>Visa</option>
              <option>Mastercard</option>
              <option>Amex</option>
            </select>
            <PickerDemo label="" initialValue={last30} align="end" />
          </div>
        </CardContent>
      </Card>

      {/* ── Popover alignment ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Popover alignment</CardTitle>
          <CardDescription className="p-sm">
            Use <code className="font-mono">align</code> to control which edge of the trigger
            the calendar opens from. Useful when the picker sits near a screen edge.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-6">
          <PickerDemo label='align="start"' initialValue={last7} align="start" />
          <PickerDemo label='align="center"' initialValue={last7} align="center" />
          <PickerDemo label='align="end" (default)' initialValue={last7} align="end" />
        </CardContent>
      </Card>

      {/* ── API Reference ── */}
      <section className="space-y-4">
        <div className="h2">API Reference</div>
        <PropTable title="DateRangePicker" rows={DATE_RANGE_PICKER_ROWS} />
      </section>

    </div>
  )
}
