"use client"

import * as React from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getExpandedRowModel,
  SortingState,
  ExpandedState,
  useReactTable,
} from "@tanstack/react-table"

import { cn } from "@/lib/utils"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from "@/components/ui/table"
import { ChevronUp, ChevronDown, ChevronRight } from "lucide-react"

// Helper type and functions for total/footer row detection
type AnyRecord = Record<string, any>
function isTotalRow(row: unknown): boolean {
  if (typeof row !== "object" || row === null) return false
  const r = row as AnyRecord
  return (
    r.__rowType === "total" ||
    r.rowType === "total" ||
    r.isTotal === true ||
    r._isTotal === true
  )
}

type DataTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]

  /** Optional UI slots */
  icon?: React.ReactNode
  title?: string
  description?: string
  actions?: React.ReactNode
  tabs?: React.ReactNode
  columnVisibilityControl?: React.ReactNode
  filterTrigger?: React.ReactNode
  appliedFilters?: React.ReactNode

  /** Feature flags */
  enableSearch?: boolean
  enableSorting?: boolean
  enablePagination?: boolean
  enableFooter?: boolean

  /** Enable expandable rows */
  enableExpansion?: boolean

  /** Expansion rendering mode */
  expansionVariant?: "panel" | "nested"

  /** Custom full-width panel renderer (used in panel mode) */
  renderExpandedPanel?: (row: TData) => React.ReactNode

  /** Function to return subRows */
  getSubRows?: (row: TData) => TData[] | undefined

  /** Optional row color accessor for color square */
  getRowColor?: (row: TData) => string | undefined

  /** Mode: client or server */
  mode?: "client" | "server"

  /** Controlled state props for server mode or controlled usage */
  search?: string
  onSearchChange?: (value: string) => void

  sortingState?: SortingState
  onSortingStateChange?: (updater: SortingState) => void

  paginationState?: { pageIndex: number; pageSize: number }
  onPaginationStateChange?: (updater: { pageIndex: number; pageSize: number }) => void

  pageCount?: number
  rowCount?: number
  /** Optional explicit footer total/roll-up row */
  footerRow?: TData
  /** Footer label for total row (defaults to "Total") */
  footerLabel?: string
  /** Hide footer when empty (default true) */
  hideFooterWhenEmpty?: boolean
}

export function DataTable<TData, TValue>({
  columns = [],
  data = [],
  icon,
  title,
  description,
  actions,
  tabs,
  columnVisibilityControl,
  filterTrigger,
  appliedFilters,
  enableSearch = true,
  enableSorting = true,
  enablePagination = true,
  enableFooter = false,
  enableExpansion = false,
  expansionVariant = "panel",
  renderExpandedPanel,
  getSubRows,
  getRowColor,
  mode = "client",
  search,
  onSearchChange,
  sortingState,
  onSortingStateChange,
  paginationState,
  onPaginationStateChange,
  pageCount,
  rowCount,
  footerRow,
  footerLabel,
  hideFooterWhenEmpty = true,
}: DataTableProps<TData, TValue>) {
  const isServer = mode === "server"

  const [sorting, setSorting] = React.useState<SortingState>([])
  const [globalFilter, setGlobalFilter] = React.useState("")
  const [expanded, setExpanded] = React.useState<ExpandedState>({})
  const [pagination, setPagination] = React.useState({ pageIndex: 0, pageSize: 10 })

  const effectiveSorting = sortingState ?? sorting
  const setEffectiveSorting = onSortingStateChange ?? setSorting

  const effectiveSearch = search ?? globalFilter
  const setEffectiveSearch = onSearchChange ?? setGlobalFilter

  const effectivePagination = paginationState ?? pagination
  const setEffectivePagination = onPaginationStateChange ?? setPagination

  // --- Split data and handle footer row logic ---
  const explicitFooterRow = footerRow
  const implicitFooterRow = React.useMemo(() => {
    if (!enableFooter) return undefined
    if (explicitFooterRow) return undefined

    const found = data.find((d) => isTotalRow(d))
    if (found) return found

    // If no flagged total row exists, auto-detect a row where first column equals "Total"
    const firstColumn = columns[0] as any
    const accessor = firstColumn?.accessorKey

    if (accessor) {
      const totalRow = data.find((d: any) => d?.[accessor] === "Total")
      return totalRow
    }

    return undefined
  }, [data, enableFooter, explicitFooterRow, columns])
  const tableData = React.useMemo(() => {
    // Remove implicit footer row from the table body so it won't sort/filter/paginate.
    if (!implicitFooterRow) return data
    return data.filter((d) => d !== implicitFooterRow)
  }, [data, implicitFooterRow])

  const numericColumnIds = React.useMemo(() => {
    const ids = new Set<string>()

    if (!tableData?.length) return ids

    for (const col of columns as Array<ColumnDef<TData, any> & { accessorKey?: string; id?: string; meta?: any }>) {
      const key = (col as any).accessorKey as string | undefined
      const id = (col as any).id ?? key
      if (!id || !key) continue

      // Respect explicit meta overrides
      const align = (col as any).meta?.align
      if (align) continue

      // Scan rows until we find a numeric-like value
      for (const row of tableData as AnyRecord[]) {
        const v = row[key]

        if (
          typeof v === "number" ||
          typeof v === "bigint" ||
          (typeof v === "string" &&
            /^\s*-?\$?\s*-?\d[\d,]*(\.\d+)?%?\s*$/.test(v))
        ) {
          ids.add(id)
          break
        }
      }
    }

    return ids
  }, [columns, tableData])

  const currencyColumnIds = React.useMemo(() => {
    const ids = new Set<string>()

    if (!tableData?.length) return ids

    for (const col of columns as Array<
      ColumnDef<TData, any> & { accessorKey?: string; id?: string; meta?: any }
    >) {
      const key = (col as any).accessorKey as string | undefined
      const id = (col as any).id ?? key
      if (!id || !key) continue

      // Respect explicit meta overrides
      const format = (col as any).meta?.format
      if (format === "currency") {
        ids.add(id)
        continue
      }
      if (format) continue

      // Heuristics: accessor name + value inspection
      if (/(amount|cost|price|revenue|subtotal|total|charge|credit|spent|payment)/i.test(key)) {
        ids.add(id)
        continue
      }

      for (const row of tableData as AnyRecord[]) {
        const v = row[key]
        if (typeof v === "string" && v.includes("$")) {
          ids.add(id)
          break
        }
      }
    }

    return ids
  }, [columns, tableData])

  const isRightAligned = React.useCallback(
    (col: any) => {
      const explicit = col.columnDef?.meta?.align
      if (explicit === "right") return true
      if (explicit === "left") return false
      return numericColumnIds.has(col.id)
    },
    [numericColumnIds]
  )

  const table = useReactTable({
    data: tableData,
    columns,
    state: {
      sorting: effectiveSorting,
      globalFilter: effectiveSearch,
      expanded,
      pagination: enablePagination ? effectivePagination : undefined,
    },
    onSortingChange: enableSorting ? setEffectiveSorting : undefined,
    onGlobalFilterChange: enableSearch ? setEffectiveSearch : undefined,
    onExpandedChange: enableExpansion ? setExpanded : undefined,
    onPaginationChange: enablePagination ? setEffectivePagination : undefined,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: !isServer && enableSearch ? getFilteredRowModel() : undefined,
    getSortedRowModel: !isServer && enableSorting ? getSortedRowModel() : undefined,
    getPaginationRowModel: !isServer && enablePagination ? getPaginationRowModel() : undefined,
    getSubRows: enableExpansion ? getSubRows : undefined,
    getExpandedRowModel:
      enableExpansion && expansionVariant === "nested"
        ? getExpandedRowModel()
        : undefined,
    manualPagination: isServer && enablePagination ? true : false,
    manualSorting: isServer && enableSorting ? true : false,
    manualFiltering: isServer && enableSearch ? true : false,
    pageCount: isServer && enablePagination ? pageCount : undefined,
  })

  const totalPages = React.useMemo(() => {
    if (!enablePagination) return 0
    return isServer && typeof pageCount === "number" ? pageCount : table.getPageCount()
  }, [enablePagination, isServer, pageCount, table])

  const [goToPage, setGoToPage] = React.useState<string>("")

  const commitGoToPage = React.useCallback(() => {
    if (!enablePagination) return
    const raw = Number(goToPage)
    if (!Number.isFinite(raw)) return

    // Users think in 1-based pages; TanStack uses 0-based.
    const target1Based = Math.max(1, Math.min(totalPages || 1, Math.trunc(raw)))
    table.setPageIndex(target1Based - 1)
    setGoToPage("")
  }, [enablePagination, goToPage, table, totalPages])

  return (
    <Card className="w-full overflow-hidden">
      {/* HEADER */}
      <div className="px-6 pt-6 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-start sm:gap-6">
        <div className="flex items-start gap-3">
          {icon && <div className="mt-1">{icon}</div>}
          <div className="space-y-1">
            {title && <h2 className="h2">{title}</h2>}
            {description && (
              <p className="p text-muted-foreground">{description}</p>
            )}
          </div>
        </div>
        {actions && (
          <div className="flex min-w-0 w-full flex-wrap items-center gap-2 sm:w-auto sm:justify-end">
            {actions}
          </div>
        )}
      </div>

      {/* BODY */}
      <div className="mt-4 px-6">
        {/* TABS */}
        {tabs && <div className="mb-4">{tabs}</div>}

        {/* CONTROLS ROW */}
        <div className="flex flex-col gap-4">
          <div className="flex min-w-0 w-full flex-wrap items-center gap-2">
            {filterTrigger ?? (
              <Button variant="outline" size="md">
                Filter
              </Button>
            )}

            {enableSearch && (
              <Input
                placeholder="Search..."
                value={effectiveSearch ?? ""}
                onChange={(e) => setEffectiveSearch(e.target.value)}
                className="min-w-0 flex-1 basis-0 p"
              />
            )}

            {columnVisibilityControl ?? (
              <Button variant="outline" size="md">
                Columns
              </Button>
            )}
          </div>

          {appliedFilters && (
            <div className="flex flex-wrap items-center gap-2">
              {appliedFilters}
            </div>
          )}
        </div>

        {/* TABLE */}
        <div className="mt-3 -mx-6">
          {/*
            Full-bleed separators + footer background:
            - We keep the card padding for content, but let the table area bleed to the card edges.
            Scroll is constrained to the table region only.
          */}
          <div className="overflow-x-auto">
            <Table className="w-full min-w-max table-auto">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={cn(
                        "px-6 py-2 align-middle label-md text-muted-foreground",
                        isRightAligned(header.column) && "text-right",
                        header.column.getCanSort() && "cursor-pointer select-none"
                      )}
                      onClick={
                        enableSorting
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div
                          className={cn(
                            "flex items-center gap-1",
                            isRightAligned(header.column) && "justify-end"
                          )}
                        >
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                          {enableSorting && header.column.getCanSort() && (
                            <span className="flex flex-col leading-none">
                              <ChevronUp
                                className={cn(
                                  "h-3 w-3 transition-opacity",
                                  header.column.getIsSorted() === "asc"
                                    ? "opacity-100 text-foreground"
                                    : "opacity-30"
                                )}
                              />
                              <ChevronDown
                                className={cn(
                                  "h-3 w-3 -mt-1 transition-opacity",
                                  header.column.getIsSorted() === "desc"
                                    ? "opacity-100 text-foreground"
                                    : "opacity-30"
                                )}
                              />
                            </span>
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => {
                  // In panel mode, only render depth 0 rows
                  if (
                    enableExpansion &&
                    expansionVariant === "panel" &&
                    row.depth > 0
                  ) {
                    return null
                  }

                  const isNested =
                    enableExpansion &&
                    expansionVariant === "nested" &&
                    row.depth > 0

                  const isTopLevel = !isNested

                  return (
                    <React.Fragment key={row.id}>
                      <TableRow className={cn(!isNested && enableExpansion && (row.getCanExpand?.() ?? false) && "cursor-pointer hover:bg-accent/40")}
                      >
                        {row.getVisibleCells().map((cell, idx) => {
                          const canExpand = row.getCanExpand?.() ?? false
                          const isExpanded = row.getIsExpanded?.() ?? false

                          return (
                            <TableCell
                              key={cell.id}
                              className={cn(
                                "px-6 py-2 align-middle p",
                                isRightAligned(cell.column) && "text-right",
                                !isTopLevel && "bg-secondary"
                              )}
                            >
                              {idx === 0 && (
                                <div className="flex items-center gap-2">
                                  {enableExpansion && expansionVariant === "nested" && (
                                    <div className="inline-flex size-6 items-center justify-center shrink-0">
                                      {canExpand ? (
                                        <button
                                          onClick={row.getToggleExpandedHandler()}
                                          className="inline-flex size-6 items-center justify-center rounded-lg text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                                        >
                                          {isExpanded ? (
                                            <ChevronDown className="size-4" />
                                          ) : (
                                            <ChevronRight className="size-4" />
                                          )}
                                        </button>
                                      ) : null}
                                    </div>
                                  )}

                                  {getRowColor && !isNested && (
                                    <span
                                      className="inline-block size-3 rounded-sm"
                                      style={{ backgroundColor: getRowColor(row.original) }}
                                    />
                                  )}

                                  <div className="min-w-0 flex-1">
                                    {flexRender(
                                      cell.column.columnDef.cell,
                                      cell.getContext()
                                    )}
                                  </div>
                                </div>
                              )}
                              {idx !== 0 &&
                                flexRender(
                                  cell.column.columnDef.cell,
                                  cell.getContext()
                                )}
                            </TableCell>
                          )
                        })}
                      </TableRow>

                      {/* PANEL MODE (full-width details row, animated) */}
                      {enableExpansion &&
                        expansionVariant === "panel" && (
                          <TableRow>
                            <TableCell
                              colSpan={
                                row.getVisibleCells().length
                              }
                              className="bg-secondary px-6 py-0 border-none"
                            >
                              <div
                                className={cn(
                                  "overflow-hidden transition-all duration-300 ease-out",
                                  row.getIsExpanded()
                                    ? "max-h-[1000px] opacity-100 py-4"
                                    : "max-h-0 opacity-0"
                                )}
                              >
                                {row.getIsExpanded() &&
                                  (renderExpandedPanel ? (
                                    renderExpandedPanel(row.original)
                                  ) : (
                                    <div className="p text-muted-foreground">
                                      No details provided.
                                    </div>
                                  ))}
                              </div>
                            </TableCell>
                          </TableRow>
                        )}
                    </React.Fragment>
                  )
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length + (enableExpansion ? 1 : 0)}
                    className="h-24 text-center p-sm text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            {enableFooter && (() => {
              const effectiveFooterRow = (footerRow ?? implicitFooterRow) as AnyRecord | undefined
              const shouldHide = (hideFooterWhenEmpty ?? true) && !effectiveFooterRow
              if (shouldHide) return null

              const leafColumns = table.getAllLeafColumns()
              const label = footerLabel ?? "Total"

              return (
                <TableFooter>
                  <TableRow className="bg-secondary border-t border-border-subtle">
                    {leafColumns.map((col, idx) => {
                      const key = (col.columnDef as any)?.accessorKey as string | undefined
                      const value = key && effectiveFooterRow ? effectiveFooterRow[key] : undefined

                      return (
                        <TableCell
                          key={col.id}
                          className={cn(
                            "px-6 py-3 align-middle",
                            isRightAligned(col) && "text-right"
                          )}
                        >
                          {idx === 0 ? (
                            <span className="label-md">{label}</span>
                          ) : value !== undefined && value !== null ? (
                            <span className="label-md tabular-nums">
                              {(() => {
                                // Respect explicit meta formatting if provided
                                const format = (col.columnDef as any)?.meta?.format as
                                  | "currency"
                                  | "percent"
                                  | "number"
                                  | undefined

                                const isCurrency = format === "currency" || currencyColumnIds.has(col.id)

                                if (typeof value === "number") {
                                  if (isCurrency) {
                                    return new Intl.NumberFormat(undefined, {
                                      style: "currency",
                                      currency: "USD",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(value)
                                  }

                                  if (format === "percent") {
                                    return new Intl.NumberFormat(undefined, {
                                      style: "percent",
                                      minimumFractionDigits: 0,
                                      maximumFractionDigits: 2,
                                    }).format(value)
                                  }

                                  return value.toLocaleString(undefined, {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })
                                }

                                if (typeof value === "string") {
                                  // If the incoming value is already formatted, keep it.
                                  if (value.includes("$")) return value
                                  if (/^\s*-?\d[\d,]*(\.\d+)?\s*%\s*$/.test(value)) return value

                                  // If it's a numeric-like string and this is a currency column, format it.
                                  const numeric = Number(value.replace(/[^0-9.-]/g, ""))
                                  if (Number.isFinite(numeric) && isCurrency) {
                                    return new Intl.NumberFormat(undefined, {
                                      style: "currency",
                                      currency: "USD",
                                      minimumFractionDigits: 2,
                                      maximumFractionDigits: 2,
                                    }).format(numeric)
                                  }

                                  return value
                                }

                                return String(value)
                              })()}
                            </span>
                          ) : null}
                        </TableCell>
                      )
                    })}
                  </TableRow>
                </TableFooter>
              )
            })()}
            </Table>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      {enablePagination && totalPages > 1 && (
        <div className="mt-3 px-6 pb-6 flex flex-col gap-3 border-t border-border pt-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 max-w-full">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="p-sm text-muted-foreground">
              Rows per page:
            </span>

            <Select
              value={String(effectivePagination.pageSize)}
              onValueChange={(value) => {
                setEffectivePagination({
                  ...effectivePagination,
                  pageSize: Number(value),
                })
              }}
            >
              <SelectTrigger size="inline" className="w-auto">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-4 whitespace-nowrap overflow-x-auto">
            <span className="p-sm text-muted-foreground whitespace-nowrap">
              Page {effectivePagination.pageIndex + 1} of {Math.max(totalPages, 1)}
            </span>

            {isServer && typeof rowCount === "number" && (
              <span className="p-sm text-muted-foreground whitespace-nowrap">
                Total: {rowCount.toLocaleString()} rows
              </span>
            )}

            <div className="flex items-center gap-2">
              <span className="p-sm text-muted-foreground whitespace-nowrap">Go to</span>
              <Input
                size="inline"
                inputMode="numeric"
                pattern="[0-9]*"
                type="number"
                min={1}
                max={Math.max(totalPages, 1)}
                value={goToPage}
                onChange={(e) => setGoToPage(e.target.value)}
                onBlur={commitGoToPage}
                onKeyDown={(e) => {
                  if (e.key === "Enter") commitGoToPage()
                }}
                className="w-16"
                aria-label="Go to page"
              />
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}