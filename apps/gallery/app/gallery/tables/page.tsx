"use client"

import * as React from "react"
import {
  ColumnDef,
  SortingState,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import {
  Badge,
  Button,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const TABLE_ROWS: PropRow[] = [
  { prop: "className", type: "string", description: "Additional CSS classes applied to the <table> element." },
]

const TABLE_SUB_ROWS: PropRow[] = [
  { prop: "Table", type: "component", description: "Root wrapper. Renders a scrollable <div> containing the <table> element." },
  { prop: "TableHeader", type: "component", description: "Renders <thead>. Applies a bottom border to child rows." },
  { prop: "TableBody", type: "component", description: "Renders <tbody>. Removes the border from the last row." },
  { prop: "TableFooter", type: "component", description: "Renders <tfoot>. Applies a top border." },
  { prop: "TableRow", type: "component", description: "Renders <tr>. Applies a bottom border and transition-colors on hover." },
  { prop: "TableHead", type: "component", description: "Renders <th>. Props: size ('default' | 'sm', default 'default'). Controls height and label style." },
  { prop: "TableCell", type: "component", description: "Renders <td>. Applies standard padding, vertical alignment, and whitespace-nowrap." },
  { prop: "TableCaption", type: "component", description: "Renders <caption> below the table with muted foreground text." },
]

type Payment = {
  id: string
  status: "pending" | "processing" | "success" | "failed"
  email: string
  amount: number
}

const data: Payment[] = [
  { id: "728ed52f", status: "pending", email: "m@example.com", amount: 100 },
  { id: "489e1d42", status: "processing", email: "example@gmail.com", amount: 125 },
  { id: "a1b2c3d4", status: "success", email: "pay@acme.co", amount: 2500 },
  { id: "e5f6g7h8", status: "failed", email: "billing@contoso.com", amount: 42 },
  { id: "x9y8z7w6", status: "success", email: "finance@widgets.io", amount: 980 },
  { id: "k3l4m5n6", status: "pending", email: "ops@storefront.com", amount: 310 },
  { id: "p0q1r2s3", status: "processing", email: "hello@brand.com", amount: 75 },
  { id: "t4u5v6w7", status: "failed", email: "support@shop.net", amount: 19 },
  { id: "z8y7x6w5", status: "success", email: "payments@merchant.org", amount: 640 },
  { id: "n4m3l2k1", status: "pending", email: "owner@local.biz", amount: 205 },
  { id: "r9s8t7u6", status: "success", email: "acct@company.io", amount: 1120 },
  { id: "b7c6d5e4", status: "processing", email: "team@startup.dev", amount: 330 },
]

const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Payment["status"]
      const variantMap: Record<Payment["status"], "success" | "destructive" | "warning" | "default"> = {
        success: "success",
        failed: "destructive",
        pending: "warning",
        processing: "default",
      }
      return <Badge variant={variantMap[status]}>{status}</Badge>
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="truncate">{String(row.getValue("email"))}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <button
        type="button"
        className="w-full text-right"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Amount
      </button>
    ),
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"))
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)

      return <span className="block w-full text-right truncate">{formatted}</span>
    },
  },
]

const total = data.reduce((sum, row) => sum + row.amount, 0)
const formattedTotal = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
}).format(total)

export default function Page() {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
  })

  return (
    <div className="p-10 space-y-8">
      <div className="space-y-2">
        <h1 className="h1">Tables</h1>
        <p className="p text-muted-foreground">
          Basic table without any controls.
        </p>
      </div>

      <section className="space-y-6">
        <div>
          <Table className="table-auto w-full">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className={`px-4 py-2 align-middle ${
                        header.id === "amount" ? "text-right" : ""
                      }`}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} className="border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="px-4 py-2 align-middle truncate"
                        title={
                          typeof cell.getValue() === "string"
                            ? String(cell.getValue())
                            : undefined
                        }
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow className="border-b" style={{ borderColor: "var(--color-border-subtle)" }}>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center p-sm text-muted-foreground"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colSpan={2} className="px-4 py-2 label-md">Total</TableCell>
                <TableCell className="px-4 py-2 text-right label-md">{formattedTotal}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Table" rows={TABLE_ROWS} />
        <PropTable title="Sub-components" rows={TABLE_SUB_ROWS} />
      </section>
    </div>
  )
}