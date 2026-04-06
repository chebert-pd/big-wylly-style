"use client"

import * as React from "react"
import { format, parse, isValid } from "date-fns"
import type { DateRange } from "react-day-picker"
import { CalendarIcon, Clock, X } from "lucide-react"

import { Calendar } from "./calendar"
import { Button } from "./button"
import { Input } from "./input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./popover"
import { cn } from "../lib/utils"

// ─── Types ─────────────────────────────────────────────────────────────────────

interface DatePickerBaseProps {
  align?: "start" | "center" | "end"
  className?: string
  placeholder?: string
}

export interface DatePickerSingleProps extends DatePickerBaseProps {
  variant?: "basic" | "date-of-birth" | "input" | "time" | "natural-language"
  value?: Date
  onChange: (date: Date | undefined) => void
  onClear?: () => void
}

export interface DatePickerRangeProps extends DatePickerBaseProps {
  variant: "range"
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  onClear?: () => void
  showPresets?: boolean
}

export type DatePickerProps = DatePickerSingleProps | DatePickerRangeProps

// ─── Natural Language Parser ───────────────────────────────────────────────────

function parseNaturalDate(input: string): Date | undefined {
  const s = input.toLowerCase().trim()

  if (s === "today") return new Date()

  if (s === "tomorrow") {
    const d = new Date()
    d.setDate(d.getDate() + 1)
    return d
  }

  if (s === "yesterday") {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    return d
  }

  if (s === "next week") {
    const d = new Date()
    d.setDate(d.getDate() + 7)
    return d
  }

  if (s === "next month") {
    const d = new Date()
    d.setMonth(d.getMonth() + 1)
    return d
  }

  const nextDay = s.match(
    /^next (sunday|monday|tuesday|wednesday|thursday|friday|saturday)$/
  )
  if (nextDay) {
    const days = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
    ]
    const target = days.indexOf(nextDay[1])
    const d = new Date()
    const diff = (target - d.getDay() + 7) % 7 || 7
    d.setDate(d.getDate() + diff)
    return d
  }

  const inDays = s.match(/^in (\d+) days?$/)
  if (inDays) {
    const d = new Date()
    d.setDate(d.getDate() + +inDays[1])
    return d
  }

  const inWeeks = s.match(/^in (\d+) weeks?$/)
  if (inWeeks) {
    const d = new Date()
    d.setDate(d.getDate() + +inWeeks[1] * 7)
    return d
  }

  const inMonths = s.match(/^in (\d+) months?$/)
  if (inMonths) {
    const d = new Date()
    d.setMonth(d.getMonth() + +inMonths[1])
    return d
  }

  const fmts = [
    "MM/dd/yyyy",
    "M/d/yyyy",
    "MM-dd-yyyy",
    "yyyy-MM-dd",
    "MMMM d, yyyy",
    "MMM d, yyyy",
  ]
  for (const fmt of fmts) {
    try {
      const parsed = parse(input, fmt, new Date())
      if (isValid(parsed)) return parsed
    } catch {
      // continue
    }
  }

  const fallback = new Date(input)
  return isNaN(fallback.getTime()) ? undefined : fallback
}

// ─── Inline Time Input ─────────────────────────────────────────────────────────

function InlineTimePicker({
  value,
  onChange,
}: {
  value?: Date
  onChange: (date: Date) => void
}) {
  const timeStr = value
    ? `${String(value.getHours()).padStart(2, "0")}:${String(value.getMinutes()).padStart(2, "0")}`
    : ""

  return (
    <div className="flex items-center gap-2 border-t border-border px-3 py-2.5">
      <Clock className="h-4 w-4 text-muted-foreground shrink-0" />
      <Input
        type="time"
        size="sm"
        value={timeStr}
        onChange={(e) => {
          const [h, m] = e.target.value.split(":").map(Number)
          const d = value ? new Date(value) : new Date()
          d.setHours(h || 0, m || 0, 0, 0)
          onChange(d)
        }}
        className="w-auto"
      />
    </div>
  )
}

// ─── Inline clear × (used inside trigger buttons) ─────────────────────────────

function ClearX({
  onClear,
  label = "Clear date",
}: {
  onClear: () => void
  label?: string
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      aria-label={label}
      className="ml-auto shrink-0 rounded-sm hover:bg-muted p-0.5 text-muted-foreground hover:text-foreground transition-colors"
      onClick={(e) => {
        e.stopPropagation()
        onClear()
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.stopPropagation()
          onClear()
        }
      }}
    >
      <X className="h-3 w-3" />
    </span>
  )
}

// ─── Shared popover content className (adds smooth open/close animation) ───────

const popoverContentCn = "w-auto p-0 duration-200"

// ─── Variant: Basic ────────────────────────────────────────────────────────────

function BasicDatePicker({
  value,
  onChange,
  onClear,
  align = "start",
  className,
  placeholder = "Pick a date",
}: DatePickerSingleProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 justify-start gap-2 border-border bg-secondary text-sm font-[420]",
            value ? "text-foreground" : "text-muted-foreground",
            onClear && value && "pr-2",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">{value ? format(value, "MMM d, yyyy") : placeholder}</span>
          {value && onClear && <ClearX onClear={onClear} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={popoverContentCn} sideOffset={8}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d)
            setOpen(false)
          }}
          autoFocus
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── Variant: Date of Birth ────────────────────────────────────────────────────

function DateOfBirthPicker({
  value,
  onChange,
  onClear,
  align = "start",
  className,
  placeholder = "Date of birth",
}: DatePickerSingleProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 min-w-[200px] justify-start gap-2 border-border bg-secondary text-sm font-[420]",
            value ? "text-foreground" : "text-muted-foreground",
            onClear && value && "pr-2",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {value ? format(value, "MMMM d, yyyy") : placeholder}
          </span>
          {value && onClear && <ClearX onClear={onClear} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={popoverContentCn} sideOffset={8}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            onChange(d)
            setOpen(false)
          }}
          captionLayout="dropdown"
          defaultMonth={value ?? new Date(1990, 0, 1)}
          startMonth={new Date(1900, 0)}
          endMonth={new Date()}
          autoFocus
          classNames={{
            // Pad the caption row so dropdowns don't extend under the nav buttons
            // (nav buttons are w-7=28px, positioned at the caption's left/right edges)
            month_caption: "flex h-9 items-center justify-center px-8",
            dropdowns: "flex items-center gap-1.5",
            dropdown:
              "h-7 rounded-[var(--radius)] border border-border bg-secondary px-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring cursor-pointer",
            caption_label: "hidden",
            nav: "absolute inset-x-0 top-3 z-10 h-9 flex items-center justify-between px-3 pointer-events-none",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}

// ─── Variant: Input ────────────────────────────────────────────────────────────

function InputDatePicker({
  value,
  onChange,
  align = "start",
  className,
  placeholder = "MM/DD/YYYY",
}: DatePickerSingleProps) {
  const [open, setOpen] = React.useState(false)
  const [inputVal, setInputVal] = React.useState(
    value ? format(value, "MM/dd/yyyy") : ""
  )

  React.useEffect(() => {
    setInputVal(value ? format(value, "MM/dd/yyyy") : "")
  }, [value])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value
    setInputVal(raw)
    if (!raw) {
      onChange(undefined)
      return
    }
    const parsed = parse(raw, "MM/dd/yyyy", new Date())
    if (isValid(parsed)) onChange(parsed)
  }

  const handleInputBlur = () => {
    if (value) setInputVal(format(value, "MM/dd/yyyy"))
  }

  return (
    <div className={cn("relative inline-flex items-center", className)}>
      <Input
        value={inputVal}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        placeholder={placeholder}
        className="pr-9"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            aria-label="Open calendar"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
          >
            <CalendarIcon className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align={align} className={popoverContentCn} sideOffset={8}>
          <Calendar
            mode="single"
            selected={value}
            onSelect={(d) => {
              onChange(d)
              setOpen(false)
            }}
            autoFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

// ─── Variant: Time ─────────────────────────────────────────────────────────────

function TimeDatePicker({
  value,
  onChange,
  onClear,
  align = "start",
  className,
  placeholder = "Pick date & time",
}: DatePickerSingleProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 justify-start gap-2 border-border bg-secondary text-sm font-[420]",
            value ? "text-foreground" : "text-muted-foreground",
            onClear && value && "pr-2",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate">
            {value ? format(value, "MMM d, yyyy  HH:mm") : placeholder}
          </span>
          {value && onClear && <ClearX onClear={onClear} />}
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className={popoverContentCn} sideOffset={8}>
        <Calendar
          mode="single"
          selected={value}
          onSelect={(d) => {
            if (!d) {
              onChange(undefined)
              return
            }
            const result = new Date(d)
            if (value) result.setHours(value.getHours(), value.getMinutes(), 0, 0)
            onChange(result)
          }}
          autoFocus
        />
        <InlineTimePicker value={value} onChange={onChange} />
      </PopoverContent>
    </Popover>
  )
}

// ─── Variant: Natural Language ─────────────────────────────────────────────────

function NaturalLanguagePicker({
  value,
  onChange,
  onClear,
  className,
  placeholder = 'e.g. "tomorrow" or "in 3 days"',
}: DatePickerSingleProps) {
  const [inputVal, setInputVal] = React.useState(
    value ? format(value, "MMM d, yyyy") : ""
  )
  const [resolved, setResolved] = React.useState<Date | undefined>(value)

  React.useEffect(() => {
    if (value) {
      setInputVal(format(value, "MMM d, yyyy"))
      setResolved(value)
    }
  }, [value])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const text = e.target.value
    setInputVal(text)
    const date = parseNaturalDate(text)
    setResolved(date)
    onChange(date)
  }

  const handleClear = () => {
    setInputVal("")
    setResolved(undefined)
    onChange(undefined)
    onClear?.()
  }

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="relative flex items-center">
        <CalendarIcon className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={inputVal}
          onChange={handleChange}
          placeholder={placeholder}
          className="pl-9 pr-9"
        />
        {inputVal && (
          <Button
            variant="ghost"
            size="sm"
            aria-label="Clear"
            className="absolute right-0.5 top-1/2 -translate-y-1/2 h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
            onClick={handleClear}
          >
            <X className="h-3 w-3" />
          </Button>
        )}
      </div>
      {resolved && (
        <p className="text-xs text-muted-foreground px-1">
          Resolves to:{" "}
          <span className="font-[520] text-foreground">
            {format(resolved, "EEEE, MMMM d, yyyy")}
          </span>
        </p>
      )}
      {inputVal && !resolved && (
        <p className="text-xs text-destructive-foreground px-1">Unable to parse date</p>
      )}
    </div>
  )
}

// ─── Variant: Range ────────────────────────────────────────────────────────────

function RangeDatePicker({
  value,
  onChange,
  onClear,
  showPresets = true,
  align = "end",
  className,
  placeholder = "Pick a range",
}: DatePickerRangeProps) {
  const [open, setOpen] = React.useState(false)

  const label = React.useMemo(() => {
    if (!value?.from) return placeholder
    if (!value.to) return format(value.from, "MMM d, yyyy")
    return `${format(value.from, "MMM d, yyyy")} – ${format(value.to, "MMM d, yyyy")}`
  }, [value, placeholder])

  const hasRange = !!value?.from

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "h-9 justify-start gap-2 border-border bg-secondary text-sm font-[420]",
            hasRange ? "text-foreground" : "text-muted-foreground",
            onClear && hasRange && "pr-2",
            className
          )}
        >
          <CalendarIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <span className="truncate max-w-[200px]">{label}</span>
          {hasRange && onClear && (
            <ClearX onClear={onClear} label="Clear date range" />
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align={align} className={popoverContentCn} sideOffset={8}>
        <div className="flex flex-col">
          {/* Quick presets — range only */}
          {showPresets && (
            <div className="flex items-center gap-1.5 border-b border-border px-3 py-2.5">
              <span className="p-sm text-muted-foreground mr-1">Quick:</span>
              {[
                { label: "Last 7 days", days: 7 },
                { label: "Last 30 days", days: 30 },
                { label: "Last 90 days", days: 90 },
              ].map((preset) => (
                <Button
                  key={preset.days}
                  variant="outline"
                  size="sm"
                  className="h-7 text-xs px-2.5"
                  onClick={() => {
                    const to = new Date()
                    const from = new Date()
                    from.setDate(from.getDate() - preset.days)
                    onChange({ from, to })
                    setOpen(false)
                  }}
                >
                  {preset.label}
                </Button>
              ))}
            </div>
          )}

          {/* Two-month calendar */}
          <Calendar
            mode="range"
            selected={value}
            onSelect={onChange}
            numberOfMonths={2}
            disabled={{ after: new Date() }}
            defaultMonth={
              value?.from
                ? new Date(value.from.getFullYear(), value.from.getMonth() - 1)
                : new Date(new Date().getFullYear(), new Date().getMonth() - 1)
            }
            className="p-3"
          />

          {/* Footer */}
          <div className="flex items-center justify-between border-t border-border px-3 py-2.5 gap-2">
            <div className="p-sm text-muted-foreground">
              {value?.from && value?.to
                ? `${Math.round(
                    (value.to.getTime() - value.from.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )} days selected`
                : value?.from
                  ? "Select end date"
                  : "Select start date"}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-xs"
                onClick={() => {
                  onChange(undefined)
                  setOpen(false)
                }}
              >
                Clear
              </Button>
              <Button
                variant="primary"
                size="sm"
                className="h-7 text-xs"
                disabled={!value?.from || !value?.to}
                onClick={() => setOpen(false)}
              >
                Apply
              </Button>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}

// ─── DatePicker (main export) ──────────────────────────────────────────────────

export function DatePicker(props: DatePickerProps) {
  if (props.variant === "range") {
    return <RangeDatePicker {...props} />
  }

  const singleProps = props as DatePickerSingleProps

  switch (singleProps.variant) {
    case "date-of-birth":
      return <DateOfBirthPicker {...singleProps} />
    case "input":
      return <InputDatePicker {...singleProps} />
    case "time":
      return <TimeDatePicker {...singleProps} />
    case "natural-language":
      return <NaturalLanguagePicker {...singleProps} />
    default:
      return <BasicDatePicker {...singleProps} />
  }
}
