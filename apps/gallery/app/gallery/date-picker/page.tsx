"use client"

import * as React from "react"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"

import { DatePicker, Card, CardContent, CardHeader, CardTitle, CardDescription } from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

// ─── Prop table rows ───────────────────────────────────────────────────────────

const DATE_PICKER_ROWS: PropRow[] = [
  {
    prop: "variant",
    type: '"basic" | "date-of-birth" | "input" | "time" | "natural-language" | "range"',
    default: '"basic"',
    description: "Selects which date picker experience to render.",
  },
  {
    prop: "value",
    type: "Date | undefined  (DateRange for variant=\"range\")",
    description: "Controlled selected date (or range for variant=\"range\").",
  },
  {
    prop: "onChange",
    type: "(date: Date | undefined) => void  ((range: DateRange | undefined) => void for \"range\")",
    required: true,
    description: "Called when the user selects or clears a date.",
  },
  {
    prop: "onClear",
    type: "() => void",
    description: "When provided, renders an × button on the trigger to clear the selection.",
  },
  {
    prop: "showPresets",
    type: "boolean",
    default: "true",
    description: "Range variant only. Show/hide the \"Last 7/30/90 days\" quick-select buttons.",
  },
  {
    prop: "align",
    type: '"start" | "center" | "end"',
    default: '"start" ("end" for range)',
    description: "Alignment of the calendar popover relative to the trigger.",
  },
  {
    prop: "placeholder",
    type: "string",
    description: "Trigger label or input placeholder shown when no date is selected.",
  },
  {
    prop: "className",
    type: "string",
    description: "Extra classes forwarded to the trigger or wrapper element.",
  },
]

// ─── Helper: display selected value ───────────────────────────────────────────

function Value({ label, value }: { label: string; value: string }) {
  return (
    <p className="p-sm text-muted-foreground">
      {label}: <span className="font-[520] text-foreground">{value}</span>
    </p>
  )
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function DatePickerPage() {
  // Basic
  const [basicDate, setBasicDate] = React.useState<Date | undefined>()

  // Date of birth
  const [dob, setDob] = React.useState<Date | undefined>()

  // Input
  const [inputDate, setInputDate] = React.useState<Date | undefined>()

  // Time
  const [timeDate, setTimeDate] = React.useState<Date | undefined>()

  // Natural language
  const [nlDate, setNlDate] = React.useState<Date | undefined>()

  // Range — with presets
  const [rangeDate, setRangeDate] = React.useState<DateRange | undefined>()

  // Range — without presets
  const [rangeNoPresets, setRangeNoPresets] = React.useState<DateRange | undefined>()

  return (
    <div className="space-y-12">

      {/* Page header */}
      <div className="space-y-2">
        <div className="h1">Date Picker</div>
        <p className="p text-muted-foreground">
          A versatile date input component with six variants — from a simple calendar
          popover to natural language parsing and date-range selection.
        </p>
      </div>

      {/* ── Basic ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Basic</CardTitle>
          <CardDescription className="p-sm">
            Default single-date picker. A calendar popover opens on click; selecting a date
            closes the popover immediately.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-2">
            <div className="label-sm text-muted-foreground">No selection</div>
            <DatePicker
              value={undefined}
              onChange={() => {}}
            />
          </div>
          <div className="flex flex-col gap-2">
            <div className="label-sm text-muted-foreground">Controlled with clear</div>
            <DatePicker
              value={basicDate}
              onChange={setBasicDate}
              onClear={() => setBasicDate(undefined)}
            />
            {basicDate && <Value label="Selected" value={format(basicDate, "PPP")} />}
          </div>
        </CardContent>
      </Card>

      {/* ── Date of Birth ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Date of Birth</CardTitle>
          <CardDescription className="p-sm">
            Adds a dropdown caption layout for fast month and year navigation — ideal when
            users need to reach dates decades in the past.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-2">
            <div className="label-sm text-muted-foreground">With dropdown navigation</div>
            <DatePicker
              variant="date-of-birth"
              value={dob}
              onChange={setDob}
              onClear={() => setDob(undefined)}
              placeholder="Date of birth"
            />
            {dob && <Value label="Selected" value={format(dob, "MMMM d, yyyy")} />}
          </div>
        </CardContent>
      </Card>

      {/* ── Input ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Input</CardTitle>
          <CardDescription className="p-sm">
            Displays an editable text input (<code className="font-mono">MM/DD/YYYY</code>).
            Users can type directly or open the calendar popover via the calendar icon.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-2">
            <div className="label-sm text-muted-foreground">Type or pick from calendar</div>
            <DatePicker
              variant="input"
              value={inputDate}
              onChange={setInputDate}
              onClear={() => setInputDate(undefined)}
            />
            {inputDate && <Value label="Selected" value={format(inputDate, "PPP")} />}
          </div>
        </CardContent>
      </Card>

      {/* ── Time ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Time Picker</CardTitle>
          <CardDescription className="p-sm">
            Extends the basic calendar with an inline time input below the calendar.
            Switching the date preserves any previously set time.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-2">
            <div className="label-sm text-muted-foreground">Date + time selection</div>
            <DatePicker
              variant="time"
              value={timeDate}
              onChange={setTimeDate}
              onClear={() => setTimeDate(undefined)}
            />
            {timeDate && (
              <Value label="Selected" value={format(timeDate, "PPP 'at' HH:mm")} />
            )}
          </div>
        </CardContent>
      </Card>

      {/* ── Natural Language ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Natural Language</CardTitle>
          <CardDescription className="p-sm">
            A free-text input that parses natural language expressions into dates.
            Supported patterns include: <code className="font-mono">today</code>,{" "}
            <code className="font-mono">tomorrow</code>,{" "}
            <code className="font-mono">yesterday</code>,{" "}
            <code className="font-mono">next monday</code>,{" "}
            <code className="font-mono">in 3 days</code>,{" "}
            <code className="font-mono">in 2 weeks</code>,{" "}
            <code className="font-mono">in 1 month</code>,{" "}
            and standard date strings.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap items-start gap-6">
          <div className="flex flex-col gap-2 w-72">
            <div className="label-sm text-muted-foreground">Type a natural language date</div>
            <DatePicker
              variant="natural-language"
              value={nlDate}
              onChange={setNlDate}
              onClear={() => setNlDate(undefined)}
            />
          </div>
        </CardContent>
      </Card>

      {/* ── Range ── */}
      <Card>
        <CardHeader>
          <CardTitle className="label-lg">Range</CardTitle>
          <CardDescription className="p-sm">
            Two-month calendar for selecting a start and end date. Use{" "}
            <code className="font-mono">showPresets</code> (default <code className="font-mono">true</code>)
            to toggle the "Last 7 / 30 / 90 days" quick-select row.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap items-start gap-6">
            <div className="flex flex-col gap-2">
              <div className="label-sm text-muted-foreground">
                With presets (default)
              </div>
              <DatePicker
                variant="range"
                value={rangeDate}
                onChange={setRangeDate}
                onClear={() => setRangeDate(undefined)}
                align="start"
              />
              {rangeDate?.from && rangeDate?.to && (
                <Value
                  label="Selected"
                  value={`${format(rangeDate.from, "MMM d")} – ${format(rangeDate.to, "MMM d, yyyy")}`}
                />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <div className="label-sm text-muted-foreground">
                Without presets (<code className="font-mono">showPresets=&#123;false&#125;</code>)
              </div>
              <DatePicker
                variant="range"
                value={rangeNoPresets}
                onChange={setRangeNoPresets}
                onClear={() => setRangeNoPresets(undefined)}
                showPresets={false}
                align="start"
              />
              {rangeNoPresets?.from && rangeNoPresets?.to && (
                <Value
                  label="Selected"
                  value={`${format(rangeNoPresets.from, "MMM d")} – ${format(rangeNoPresets.to, "MMM d, yyyy")}`}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ── API Reference ── */}
      <section className="space-y-4">
        <div className="h2">API Reference</div>
        <PropTable title="DatePicker" rows={DATE_PICKER_ROWS} />
      </section>

    </div>
  )
}
