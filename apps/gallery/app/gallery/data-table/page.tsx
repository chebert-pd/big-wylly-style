"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import {
  DataTable,
  DataTableToolbar,
  DataTableFilterPanel,
  countActiveFilters,
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Separator,
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetBody,
} from "@wyllo/ui"
import type { FilterConfig, FilterValues } from "@wyllo/ui"
import { Table as TableIcon, Download } from "lucide-react"
import { CodeSnippet } from "@/app/gallery/_components/code-block"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

/* ─── API Reference Data ──────────────────────────────────────────────────── */

const DATA_TABLE_ROWS: PropRow[] = [
  { prop: "columns", type: "ColumnDef<TData, TValue>[]", required: true, description: "TanStack column definitions for the table." },
  { prop: "data", type: "TData[]", required: true, description: "Array of row data objects." },
  { prop: "toolbar", type: "ReactNode", description: "Slot rendered above the table card — typically a DataTableToolbar." },
  { prop: "tableRef", type: "MutableRefObject<Table>", description: "Ref to access the TanStack table instance (e.g. for passing to DataTableToolbar)." },
  { prop: "enableSearch", type: "boolean", default: "true", description: "Enable global search (managed internally or via controlled props)." },
  { prop: "enableSorting", type: "boolean", default: "true", description: "Enable column sorting." },
  { prop: "enablePagination", type: "boolean", default: "true", description: "Enable pagination controls." },
  { prop: "enableFooter", type: "boolean", default: "false", description: "Enable a footer row (auto-detects a total row or uses footerRow)." },
  { prop: "enableExpansion", type: "boolean", default: "false", description: "Enable expandable rows." },
  { prop: "expansionVariant", type: '"panel" | "nested"', default: '"panel"', description: "Expansion mode: full-width panel or nested sub-rows." },
  { prop: "mode", type: '"client" | "server"', default: '"client"', description: "Client-side or server-side data handling." },
]

const TOOLBAR_ROWS: PropRow[] = [
  { prop: "searchValue", type: "string", description: "Current search input value." },
  { prop: "onSearchChange", type: "(value: string) => void", description: "Called when the search input changes." },
  { prop: "onSearchSubmit", type: "(value: string) => void", description: "Called when Enter is pressed in the search field." },
  { prop: "searchPlaceholder", type: "string", default: '"Search..."', description: "Placeholder text for the search input." },
  { prop: "isFilterOpen", type: "boolean", description: "Whether the filter panel is currently open." },
  { prop: "onFilterToggle", type: "() => void", description: "Called to toggle the filter panel. When absent, the filter button is hidden." },
  { prop: "activeFilterCount", type: "number", default: "0", description: "Number of active filters — shown as a badge on the filter button." },
  { prop: "table", type: "Table<TData>", description: "TanStack table instance. When provided, the View dropdown shows toggleable columns automatically." },
  { prop: "actions", type: "ReactNode", description: "Additional action buttons (e.g. Export) rendered on the right." },
]

const FILTER_PANEL_ROWS: PropRow[] = [
  { prop: "filters", type: "FilterConfig[]", required: true, description: "Array of filter definitions." },
  { prop: "values", type: "FilterValues", required: true, description: "Current filter values (controlled)." },
  { prop: "onValuesChange", type: "(values: FilterValues) => void", required: true, description: "Called when any filter value changes." },
]

const FILTER_CONFIG_ROWS: PropRow[] = [
  { prop: "id", type: "string", required: true, description: "Unique filter identifier." },
  { prop: "label", type: "string", required: true, description: "Display label for the filter." },
  { prop: "type", type: '"checkbox-group" | "checkbox-group-searchable" | "amount-range" | "range" | "date-range"', required: true, description: "Filter control type." },
  { prop: "options", type: "{ value: string; label: string }[]", description: "Options for checkbox-group filters." },
  { prop: "min / max / step", type: "number", description: "Bounds for range slider filters." },
]

/* ─── Demo Data ───────────────────────────────────────────────────────────── */

type Payment = {
  status: "pending" | "processing" | "success" | "failed"
  email: string
  amount: number
  category: string
}

const allData: Payment[] = Array.from({ length: 25 }).map((_, i) => {
  const statuses: Payment["status"][] = ["pending", "processing", "success", "failed"]
  const categories = ["Subscription", "One-time", "Refund", "Invoice"]
  return {
    status: statuses[i % statuses.length],
    email: `user${i + 1}@example.com`,
    amount: ((i * 317 + 83) % 4975) + 25,
    category: categories[i % categories.length],
  }
})

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const value = row.getValue("status") as Payment["status"]
      const variantMap: Record<Payment["status"], "success" | "warning" | "destructive" | "default"> = {
        success: "success",
        pending: "warning",
        failed: "destructive",
        processing: "default",
      }
      return <Badge variant={variantMap[value]}>{value}</Badge>
    },
  },
  { accessorKey: "email", header: "Email" },
  { accessorKey: "category", header: "Category" },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const value = row.getValue("amount") as number
      return <div className="text-right">${value.toFixed(2)}</div>
    },
  },
]

type ServiceRow = {
  service: string
  usageCost: number
  credits: number | null
  chargebacks: number | null
  subtotal: number
  percentChange: number
  children?: ServiceRow[]
}

const serviceData: ServiceRow[] = [
  {
    service: "Fraud Detection",
    usageCost: 6453.74, credits: null, chargebacks: null, subtotal: 6453.74, percentChange: 1,
    children: [
      { service: "United States", usageCost: 4517.62, credits: null, chargebacks: null, subtotal: 4517.62, percentChange: 0 },
      { service: "European Union", usageCost: 1290.75, credits: null, chargebacks: null, subtotal: 1290.75, percentChange: 0 },
    ],
  },
  {
    service: "Chargeback Protection",
    usageCost: 2411.90, credits: -7.49, chargebacks: -50, subtotal: 2354.41, percentChange: 6,
  },
  {
    service: "Total",
    usageCost: 8865.64, credits: -7.49, chargebacks: -50, subtotal: 8808.15, percentChange: 0,
  },
]

const serviceColumns: ColumnDef<ServiceRow>[] = [
  { accessorKey: "service", header: "Service" },
  {
    accessorKey: "usageCost",
    header: () => <div className="text-right">Usage Cost</div>,
    cell: ({ row }) => <div className="text-right">${(row.getValue("usageCost") as number).toFixed(2)}</div>,
  },
  {
    accessorKey: "credits",
    header: () => <div className="text-right">Credits</div>,
    cell: ({ row }) => {
      const v = row.getValue("credits") as number | null
      return <div className="text-right">{v !== null ? `$${v.toFixed(2)}` : "—"}</div>
    },
  },
  {
    accessorKey: "subtotal",
    header: () => <div className="text-right">Subtotal</div>,
    cell: ({ row }) => <div className="text-right">${(row.getValue("subtotal") as number).toFixed(2)}</div>,
  },
]

/* ─── Filter Config ───────────────────────────────────────────────────────── */

const filterConfigs: FilterConfig[] = [
  {
    id: "status",
    label: "Status",
    type: "checkbox-group",
    options: [
      { value: "pending", label: "Pending" },
      { value: "processing", label: "Processing" },
      { value: "success", label: "Success" },
      { value: "failed", label: "Failed" },
    ],
  },
  {
    id: "category",
    label: "Category",
    type: "checkbox-group-searchable",
    options: [
      { value: "Subscription", label: "Subscription" },
      { value: "One-time", label: "One-time" },
      { value: "Refund", label: "Refund" },
      { value: "Invoice", label: "Invoice" },
    ],
  },
  {
    id: "amount",
    label: "Amount",
    type: "amount-range",
  },
]

const defaultFilterValues: FilterValues = {
  status: ["pending", "processing", "success", "failed"],
  category: ["Subscription", "One-time", "Refund", "Invoice"],
  amount: { from: "", to: "" },
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function DataTablePage() {
  const [search, setSearch] = useState("")
  const [filterOpen, setFilterOpen] = useState(false)
  const [filterValues, setFilterValues] = useState<FilterValues>(defaultFilterValues)

  // Apply filters client-side for demo
  const filteredData = allData.filter((row) => {
    // Status filter
    const statusFilter = filterValues.status as string[] | undefined
    if (statusFilter && statusFilter.length < 4 && !statusFilter.includes(row.status)) return false

    // Category filter
    const categoryFilter = filterValues.category as string[] | undefined
    if (categoryFilter && categoryFilter.length < 4 && !categoryFilter.includes(row.category)) return false

    // Amount filter
    const amountFilter = filterValues.amount as { from: string; to: string } | undefined
    if (amountFilter) {
      if (amountFilter.from && row.amount < parseFloat(amountFilter.from)) return false
      if (amountFilter.to && row.amount > parseFloat(amountFilter.to)) return false
    }

    return true
  })

  return (
    <div className="space-y-16">
      <div className="space-y-2">
        <h1 className="h1">Data Table</h1>
        <p className="p text-muted-foreground">
          Sortable, filterable, and paginated tables with a responsive toolbar and composable filter panel.
        </p>
      </div>

      {/* ── Example 1: Full toolbar + filter panel ───────────────────────── */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">With Toolbar & Filters</h2>
          <p className="p text-muted-foreground">
            The toolbar adapts to screen size — labeled buttons on desktop, icon-only on tablet,
            stacked on mobile. Click &ldquo;Filters&rdquo; to open the filter panel in a side sheet.
          </p>
        </div>

        {/* Consumer-owned section header */}
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3">
            <TableIcon className="size-5 text-muted-foreground mt-0.5" />
            <div>
              <h3 className="h2">Payments</h3>
              <p className="p text-muted-foreground">Manage and review incoming payments.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="md">Secondary</Button>
            <Button size="md">Primary</Button>
          </div>
        </div>

        <DataTable
          columns={columns}
          data={filteredData}
          enableSearch={false}
          toolbar={
            <DataTableToolbar
              searchValue={search}
              onSearchChange={setSearch}
              onFilterToggle={() => setFilterOpen(!filterOpen)}
              activeFilterCount={countActiveFilters(filterConfigs, filterValues)}
              actions={
                <Button variant="outline" size="sm">
                  <Download className="size-4" />
                  <span className="ml-2 hidden lg:inline">Export</span>
                </Button>
              }
            />
          }
        />

        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="left" className="w-80 p-0">
            <SheetHeader className="px-4 pt-4">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <SheetBody className="p-0">
              <DataTableFilterPanel
                filters={filterConfigs}
                values={filterValues}
                onValuesChange={setFilterValues}
                className="h-full"
              />
            </SheetBody>
          </SheetContent>
        </Sheet>
      </div>

      <Separator />

      {/* ── Example 2: Nested expansion + footer ─────────────────────────── */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Nested Expansion with Footer</h2>
          <p className="p text-muted-foreground">
            Expandable rows with a footer total row auto-detected from the data.
          </p>
        </div>

        <DataTable
          columns={serviceColumns}
          data={serviceData}
          enableExpansion
          expansionVariant="nested"
          getSubRows={(row) => row.children ?? []}
          enableFooter
          enableSearch={false}
        />
      </div>

      <Separator />

      {/* ── Filter Panel ─────────────────────────────────────────────────────── */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Filter Panel</h2>
          <p className="p text-muted-foreground">
            The filter panel is a standalone component that renders filter controls. It doesn&rsquo;t
            know about the table — you connect them by filtering your data based on the filter
            values and passing the filtered result to the DataTable.
          </p>
        </div>

        {/* How it connects */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">How filters connect to the table</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="p text-muted-foreground">
              Each filter&rsquo;s <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">id</code> corresponds
              to a column or field in your data. You define the filter configs, manage the filter
              values in state, and apply them to your data before passing it to the table.
            </p>
            <CodeSnippet title="Connecting filters to the table">{`// 1. Define filters that match your data shape
const filters: FilterConfig[] = [
  { id: "status", label: "Status", type: "checkbox-group",
    options: [{ value: "active", label: "Active" }, ...] },
  { id: "amount", label: "Amount", type: "amount-range" },
]

// 2. Filter data based on values
const filtered = data.filter(row => {
  const statuses = filterValues.status as string[]
  if (statuses?.length && !statuses.includes(row.status)) return false
  return true
})

// 3. Pass filtered data to the table
<DataTable columns={columns} data={filtered} />`}</CodeSnippet>
          </CardContent>
        </Card>

        {/* Built-in filter types */}
        <div className="space-y-4">
          <h3 className="h3">Built-in filter types</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card level={1}>
              <CardHeader className="pb-4">
                <CardTitle className="label-md">checkbox-group</CardTitle>
                <CardDescription>Multi-select with parent &ldquo;All&rdquo; toggle and active count badge.</CardDescription>
              </CardHeader>
            </Card>
            <Card level={1}>
              <CardHeader className="pb-4">
                <CardTitle className="label-md">checkbox-group-searchable</CardTitle>
                <CardDescription>Same as checkbox-group but with a search input to filter long option lists.</CardDescription>
              </CardHeader>
            </Card>
            <Card level={1}>
              <CardHeader className="pb-4">
                <CardTitle className="label-md">amount-range</CardTitle>
                <CardDescription>From/To number inputs with dollar prefix. Applies on Enter or blur.</CardDescription>
              </CardHeader>
            </Card>
            <Card level={1}>
              <CardHeader className="pb-4">
                <CardTitle className="label-md">range</CardTitle>
                <CardDescription>Slider with min/max number inputs for continuous numeric ranges.</CardDescription>
              </CardHeader>
            </Card>
            <Card level={1}>
              <CardHeader className="pb-4">
                <CardTitle className="label-md">date-range</CardTitle>
                <CardDescription>Popover calendar for selecting a date range with dual-month view.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Custom filters */}
        <div className="space-y-4">
          <h3 className="h3">Custom filters</h3>
          <p className="p text-muted-foreground">
            Use <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">type: &ldquo;custom&rdquo;</code> to
            render any filter UI you want. The panel still handles the label, active badge,
            separators, and reset — you just provide the control.
          </p>
          <CodeSnippet title="Custom filter example">{`{
  id: "priority",
  label: "Priority",
  type: "custom",
  render: (value, onChange) => (
    <ToggleGroup type="single" value={value} onValueChange={onChange}>
      <ToggleGroupItem value="low">Low</ToggleGroupItem>
      <ToggleGroupItem value="medium">Medium</ToggleGroupItem>
      <ToggleGroupItem value="high">High</ToggleGroupItem>
    </ToggleGroup>
  ),
  // Controls the active badge + reset button
  isActive: (value) => !!value,
}`}</CodeSnippet>
        </div>

        {/* Where to render */}
        <div className="space-y-4">
          <h3 className="h3">Where to render it</h3>
          <p className="p text-muted-foreground">
            The filter panel is just content — it doesn&rsquo;t come with its own container.
            Drop it into whatever surface fits your layout.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card level={1}>
              <CardHeader className="pb-4">
                <CardTitle className="label-md">Sheet (side drawer)</CardTitle>
                <CardDescription>Most common. Slides in from the left or right. Used in the demo above.</CardDescription>
              </CardHeader>
            </Card>
            <Card level={1}>
              <CardHeader className="pb-4">
                <CardTitle className="label-md">Sidebar column</CardTitle>
                <CardDescription>Persistent filter panel alongside the table for data-heavy dashboards.</CardDescription>
              </CardHeader>
            </Card>
            <Card level={1}>
              <CardHeader className="pb-4">
                <CardTitle className="label-md">Full Screen Sheet</CardTitle>
                <CardDescription>For complex filter setups on mobile where a side sheet is too narrow.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>

      <Separator />

      {/* ── API Reference ─────────────────────────────────────────────────── */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="DataTable" rows={DATA_TABLE_ROWS} />
        <PropTable title="DataTableToolbar" rows={TOOLBAR_ROWS} />
        <PropTable title="DataTableFilterPanel" rows={FILTER_PANEL_ROWS} />
        <PropTable title="FilterConfig" rows={FILTER_CONFIG_ROWS} />
      </section>
    </div>
  )
}
