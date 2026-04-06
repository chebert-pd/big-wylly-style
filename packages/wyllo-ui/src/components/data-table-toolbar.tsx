"use client"

import * as React from "react"
import { Search, Filter, Settings2 } from "lucide-react"
import { Tooltip as TooltipPrimitive } from "radix-ui"
import type { Table } from "@tanstack/react-table"

import { cn } from "../lib/utils"
import { Button } from "./button"
import { Input } from "./input"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./dropdown-menu"

/* ─── Tooltip helper ───────────────────────────────────────────────────────── */

function WithTooltip({ tooltip, children }: { tooltip?: string; children: React.ReactElement }) {
  if (!tooltip) return children
  return (
    <TooltipPrimitive.Provider delayDuration={0}>
      <TooltipPrimitive.Root>
        <TooltipPrimitive.Trigger asChild>{children}</TooltipPrimitive.Trigger>
        <TooltipPrimitive.Portal>
          <TooltipPrimitive.Content
            side="bottom"
            className="z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95"
          >
            {tooltip}
          </TooltipPrimitive.Content>
        </TooltipPrimitive.Portal>
      </TooltipPrimitive.Root>
    </TooltipPrimitive.Provider>
  )
}

/* ─── Types ────────────────────────────────────────────────────────────────── */

type DataTableToolbarProps<TData = any> = {
  /** TanStack table instance — used for column visibility dropdown */
  table?: Table<TData>

  /** Current search value */
  searchValue?: string
  /** Called when the search input changes */
  onSearchChange?: (value: string) => void
  /** Called when user presses Enter in search */
  onSearchSubmit?: (value: string) => void
  /** Search placeholder text */
  searchPlaceholder?: string

  /** Whether the filter panel is currently open */
  isFilterOpen?: boolean
  /** Called to toggle the filter panel */
  onFilterToggle?: () => void
  /** Number of active filters — shown as a count badge */
  activeFilterCount?: number

  /** Additional action buttons (e.g. Export, Import) rendered on the right */
  actions?: React.ReactNode

  className?: string
}

/* ─── Component ────────────────────────────────────────────────────────────── */

function DataTableToolbar<TData>({
  table,
  searchValue = "",
  onSearchChange,
  onSearchSubmit,
  searchPlaceholder = "Search...",
  isFilterOpen,
  onFilterToggle,
  activeFilterCount = 0,
  actions,
  className,
}: DataTableToolbarProps<TData>) {
  const hasActiveFilters = activeFilterCount > 0

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") onSearchSubmit?.(searchValue)
  }

  // Derive hideable columns from the table instance
  const hideableColumns = React.useMemo(() => {
    if (!table) return []
    return table
      .getAllColumns()
      .filter((col) => col.getCanHide())
  }, [table])

  /* ── Reusable button renderers ──────────────────────────────────────────── */

  const filterButton = (iconOnly: boolean, fluid: boolean) => {
    if (!onFilterToggle) return null
    return (
      <WithTooltip tooltip={iconOnly ? "Filters" : undefined}>
        <Button
          variant="outline"
          size="sm"
          onClick={onFilterToggle}
          className={cn(fluid && "flex-1 justify-center")}
        >
          <Filter className="size-4" />
          {!iconOnly && <span className="ml-2">Filters</span>}
          {hasActiveFilters && (
            <span className="ml-1.5 inline-flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-[520] leading-none text-primary-foreground">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </WithTooltip>
    )
  }

  const viewDropdown = (iconOnly: boolean, fluid: boolean) => {
    if (!hideableColumns.length) return null
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <WithTooltip tooltip={iconOnly ? "Columns" : undefined}>
            <Button
              variant="outline"
              size="sm"
              className={cn(fluid && "flex-1 justify-center")}
            >
              <Settings2 className="size-4" />
              {!iconOnly && <span className="ml-2">View</span>}
            </Button>
          </WithTooltip>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
          <DropdownMenuSeparator />
          {hideableColumns.map((col) => (
            <DropdownMenuCheckboxItem
              key={col.id}
              className="capitalize"
              checked={col.getIsVisible()}
              onCheckedChange={(value) => col.toggleVisibility(!!value)}
            >
              {col.id}
            </DropdownMenuCheckboxItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    )
  }

  const searchInput = (className?: string) => {
    if (!onSearchChange) return null
    return (
      <div className={cn("relative", className)}>
        <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleSearchKeyDown}
          className="pl-9"
        />
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)} data-slot="data-table-toolbar">
      {/* SM: search on its own row */}
      <div className="sm:hidden">
        {searchInput("w-full")}
      </div>

      {/* SM: icon-only buttons, fluid width */}
      <div className="flex items-center gap-2 sm:hidden">
        {filterButton(true, true)}
        {viewDropdown(true, true)}
        {actions}
      </div>

      {/* MD: single row, icon-only buttons + search */}
      <div className="hidden sm:flex lg:hidden items-center gap-2">
        {filterButton(true, false)}
        {viewDropdown(true, false)}
        {searchInput("min-w-0 flex-1")}
        {actions}
      </div>

      {/* LG+: single row, labeled buttons + search */}
      <div className="hidden lg:flex items-center gap-2">
        {filterButton(false, false)}
        {viewDropdown(false, false)}
        {searchInput("min-w-0 flex-1")}
        {actions}
      </div>
    </div>
  )
}

export { DataTableToolbar }
export type { DataTableToolbarProps }
