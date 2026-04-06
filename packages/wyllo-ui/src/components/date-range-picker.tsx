/**
 * DateRangePicker — backwards-compatible re-export.
 *
 * This component is now a thin wrapper around <DatePicker variant="range" />.
 * Prefer importing DatePicker directly for new usage:
 *   import { DatePicker } from "./date-picker"
 */

"use client"

import type { DateRange } from "react-day-picker"
import { DatePicker } from "./date-picker"

interface DateRangePickerProps {
  value?: DateRange
  onChange: (range: DateRange | undefined) => void
  onClear?: () => void
  align?: "start" | "center" | "end"
  className?: string
  showPresets?: boolean
}

export function DateRangePicker({
  value,
  onChange,
  onClear,
  align = "end",
  className,
  showPresets = true,
}: DateRangePickerProps) {
  return (
    <DatePicker
      variant="range"
      value={value}
      onChange={onChange}
      onClear={onClear}
      align={align}
      className={className}
      showPresets={showPresets}
    />
  )
}
