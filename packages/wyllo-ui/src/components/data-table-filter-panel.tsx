"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon, Search } from "lucide-react"
import type { DateRange } from "react-day-picker"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { Checkbox } from "./checkbox"
import { Input } from "./input"
import { Label } from "./label"
import { Slider } from "./slider"
import { Calendar } from "./calendar"
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Separator } from "./separator"

/* ─── Types ────────────────────────────────────────────────────────────────── */

type FilterOption = {
  value: string
  label: string
}

type FilterConfig = {
  id: string
  label: string
  type: "checkbox-group" | "checkbox-group-searchable" | "amount-range" | "range" | "date-range" | "custom"
  /** Options for checkbox-group filters */
  options?: FilterOption[]
  /** Min/max/step for range filters */
  min?: number
  max?: number
  step?: number
  /** Custom render function — receives current value and a setter. Used when type is "custom". */
  render?: (value: any, onChange: (value: any) => void) => React.ReactNode
  /** Custom active check — returns true if this filter is actively filtering. Used with "custom" type. */
  isActive?: (value: any) => boolean
}

type AmountRangeValue = {
  from: string
  to: string
}

type FilterValues = {
  [key: string]: string[] | AmountRangeValue | [number, number] | DateRange | undefined
}

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function isFilterActive(filter: FilterConfig, values: FilterValues): boolean {
  if (filter.type === "checkbox-group" || filter.type === "checkbox-group-searchable") {
    const selected = (values[filter.id] as string[]) || []
    const total = filter.options?.length || 0
    return total > 0 && selected.length < total
  }
  if (filter.type === "amount-range") {
    const range = values[filter.id] as AmountRangeValue
    return !!(range?.from || range?.to)
  }
  if (filter.type === "range") {
    const range = values[filter.id] as [number, number]
    return range?.[0] !== filter.min || range?.[1] !== filter.max
  }
  if (filter.type === "date-range") {
    const range = values[filter.id] as DateRange
    return range?.from !== undefined
  }
  if (filter.type === "custom" && filter.isActive) {
    return filter.isActive(values[filter.id])
  }
  return false
}

function getActiveCount(filter: FilterConfig, values: FilterValues): number | null {
  if (filter.type === "checkbox-group" || filter.type === "checkbox-group-searchable") {
    const selected = (values[filter.id] as string[]) || []
    const total = filter.options?.length || 0
    if (selected.length < total && selected.length > 0) return selected.length
  }
  return null
}

/** Count total active filters across all configs */
function countActiveFilters(filters: FilterConfig[], values: FilterValues): number {
  return filters.filter((f) => isFilterActive(f, values)).length
}

/* ─── Checkbox Group ───────────────────────────────────────────────────────── */

function CheckboxGroupFilter({
  filter,
  values,
  onValuesChange,
  searchQuery,
}: {
  filter: FilterConfig
  values: FilterValues
  onValuesChange: (values: FilterValues) => void
  searchQuery?: string
}) {
  const options = filter.options || []
  const selectedValues = (values[filter.id] as string[]) || []
  const allSelected = selectedValues.length === options.length
  const someSelected = selectedValues.length > 0 && !allSelected

  const visibleOptions = searchQuery
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  const handleParentChange = () => {
    if (allSelected) {
      onValuesChange({ ...values, [filter.id]: [] })
    } else {
      onValuesChange({ ...values, [filter.id]: options.map((o) => o.value) })
    }
  }

  const handleChildChange = (value: string, checked: boolean) => {
    const newValues = checked
      ? [...selectedValues, value]
      : selectedValues.filter((v) => v !== value)
    onValuesChange({ ...values, [filter.id]: newValues })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Checkbox
          id={`${filter.id}-all`}
          checked={allSelected ? true : someSelected ? "indeterminate" : false}
          onCheckedChange={handleParentChange}
        />
        <Label htmlFor={`${filter.id}-all`} className="text-sm font-[420] cursor-pointer">
          All
        </Label>
      </div>
      <div className="ml-4 space-y-2">
        {visibleOptions.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${filter.id}-${option.value}`}
              checked={selectedValues.includes(option.value)}
              onCheckedChange={(checked) => handleChildChange(option.value, !!checked)}
            />
            <Label htmlFor={`${filter.id}-${option.value}`} className="text-sm font-[420] cursor-pointer">
              {option.label}
            </Label>
          </div>
        ))}
        {searchQuery && visibleOptions.length === 0 && (
          <p className="p-sm text-muted-foreground py-2">No results found</p>
        )}
      </div>
    </div>
  )
}

/* ─── Amount Range ─────────────────────────────────────────────────────────── */

function AmountRangeFilter({
  filter,
  values,
  onValuesChange,
}: {
  filter: FilterConfig
  values: FilterValues
  onValuesChange: (values: FilterValues) => void
}) {
  const externalRange = (values[filter.id] as AmountRangeValue) || { from: "", to: "" }
  const [localFrom, setLocalFrom] = React.useState(externalRange.from)
  const [localTo, setLocalTo] = React.useState(externalRange.to)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    setLocalFrom(externalRange.from)
    setLocalTo(externalRange.to)
  }, [externalRange.from, externalRange.to])

  const applyRange = React.useCallback(() => {
    const fromNum = localFrom.trim() ? parseFloat(localFrom) : null
    const toNum = localTo.trim() ? parseFloat(localTo) : null
    if (fromNum !== null && toNum !== null && fromNum > toNum) {
      setError("From cannot be greater than To")
      return
    }
    setError(null)
    onValuesChange({ ...values, [filter.id]: { from: localFrom.trim(), to: localTo.trim() } })
  }, [localFrom, localTo, values, filter.id, onValuesChange])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") applyRange()
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <Input
            type="number"
            placeholder="From"
            value={localFrom}
            onChange={(e) => setLocalFrom(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={applyRange}
            className="h-8 text-sm pl-6"
            min={0}
          />
        </div>
        <span className="text-muted-foreground text-xs">to</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
          <Input
            type="number"
            placeholder="To"
            value={localTo}
            onChange={(e) => setLocalTo(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={applyRange}
            className="h-8 text-sm pl-6"
            min={0}
          />
        </div>
      </div>
      {error && <p className="text-xs text-destructive-foreground">{error}</p>}
    </div>
  )
}

/* ─── Filter Panel ─────────────────────────────────────────────────────────── */

function DataTableFilterPanel({
  filters,
  values,
  onValuesChange,
  className,
}: {
  filters: FilterConfig[]
  values: FilterValues
  onValuesChange: (values: FilterValues) => void
  className?: string
}) {
  const [searchQueries, setSearchQueries] = React.useState<Record<string, string>>({})
  const hasActiveFilters = filters.some((f) => isFilterActive(f, values))

  const handleReset = () => {
    const resetValues: FilterValues = {}
    filters.forEach((filter) => {
      if (filter.type === "checkbox-group" || filter.type === "checkbox-group-searchable") {
        resetValues[filter.id] = filter.options?.map((o) => o.value) || []
      } else if (filter.type === "amount-range") {
        resetValues[filter.id] = { from: "", to: "" }
      } else if (filter.type === "range" && filter.min !== undefined && filter.max !== undefined) {
        resetValues[filter.id] = [filter.min, filter.max]
      } else if (filter.type === "date-range") {
        resetValues[filter.id] = undefined
      }
    })
    setSearchQueries({})
    onValuesChange(resetValues)
  }

  return (
    <div
      data-slot="data-table-filter-panel"
      className={cn("flex flex-col", className)}
    >
      {/* Scrollable filter list */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 p-4">
          {filters.map((filter, index) => {
            const activeCount = getActiveCount(filter, values)
            const isActive = isFilterActive(filter, values)

            return (
              <div key={filter.id} className="space-y-3">
                {/* Label + active count */}
                <div className="flex items-center gap-2">
                  <Label className="label-sm">{filter.label}</Label>
                  {isActive && activeCount !== null && (
                    <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-[520] text-primary-foreground">
                      {activeCount}
                    </span>
                  )}
                </div>

                {/* Checkbox Group */}
                {filter.type === "checkbox-group" && (
                  <CheckboxGroupFilter
                    filter={filter}
                    values={values}
                    onValuesChange={onValuesChange}
                  />
                )}

                {/* Searchable Checkbox Group */}
                {filter.type === "checkbox-group-searchable" && (
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                      <Input
                        type="text"
                        placeholder="Search..."
                        value={searchQueries[filter.id] || ""}
                        onChange={(e) =>
                          setSearchQueries((prev) => ({ ...prev, [filter.id]: e.target.value }))
                        }
                        className="h-8 text-sm pl-8"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      <CheckboxGroupFilter
                        filter={filter}
                        values={values}
                        onValuesChange={onValuesChange}
                        searchQuery={searchQueries[filter.id]}
                      />
                    </div>
                  </div>
                )}

                {/* Amount Range */}
                {filter.type === "amount-range" && (
                  <AmountRangeFilter filter={filter} values={values} onValuesChange={onValuesChange} />
                )}

                {/* Slider Range */}
                {filter.type === "range" && filter.min !== undefined && filter.max !== undefined && (
                  <div className="space-y-3">
                    <Slider
                      value={(values[filter.id] as [number, number]) || [filter.min, filter.max]}
                      min={filter.min}
                      max={filter.max}
                      step={filter.step || 1}
                      onValueChange={(value: number[]) =>
                        onValuesChange({ ...values, [filter.id]: value as [number, number] })
                      }
                    />
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={(values[filter.id] as [number, number])?.[0] ?? filter.min}
                        onChange={(e) => {
                          const currentMax = (values[filter.id] as [number, number])?.[1] ?? filter.max!
                          onValuesChange({ ...values, [filter.id]: [Number(e.target.value), currentMax] })
                        }}
                        className="h-8 text-xs"
                        min={filter.min}
                        max={filter.max}
                      />
                      <span className="text-muted-foreground text-xs">to</span>
                      <Input
                        type="number"
                        value={(values[filter.id] as [number, number])?.[1] ?? filter.max}
                        onChange={(e) => {
                          const currentMin = (values[filter.id] as [number, number])?.[0] ?? filter.min!
                          onValuesChange({ ...values, [filter.id]: [currentMin, Number(e.target.value)] })
                        }}
                        className="h-8 text-xs"
                        min={filter.min}
                        max={filter.max}
                      />
                    </div>
                  </div>
                )}

                {/* Date Range */}
                {filter.type === "date-range" && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-[420] h-9 text-xs",
                          !(values[filter.id] as DateRange)?.from && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 size-3.5" />
                        {(values[filter.id] as DateRange)?.from ? (
                          (values[filter.id] as DateRange)?.to ? (
                            <>
                              {format((values[filter.id] as DateRange).from!, "LLL dd")} –{" "}
                              {format((values[filter.id] as DateRange).to!, "LLL dd")}
                            </>
                          ) : (
                            format((values[filter.id] as DateRange).from!, "LLL dd, y")
                          )
                        ) : (
                          "Select date range"
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        selected={values[filter.id] as DateRange}
                        onSelect={(range) => onValuesChange({ ...values, [filter.id]: range })}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                )}

                {/* Custom */}
                {filter.type === "custom" && filter.render && (
                  filter.render(
                    values[filter.id],
                    (value) => onValuesChange({ ...values, [filter.id]: value }),
                  )
                )}

                {/* Separator */}
                {index < filters.length - 1 && <Separator className="mt-4" />}
              </div>
            )
          })}
        </div>
      </div>

      {/* Reset footer */}
      <div className="shrink-0 border-t border-border p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={handleReset}
          disabled={!hasActiveFilters}
        >
          Reset filters
        </Button>
      </div>
    </div>
  )
}

export { DataTableFilterPanel, countActiveFilters }
export type { FilterConfig, FilterOption, FilterValues, AmountRangeValue }
