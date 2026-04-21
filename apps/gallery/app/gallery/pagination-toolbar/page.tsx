"use client"

import { useState } from "react"
import {
  PaginationToolbar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const PAGINATION_TOOLBAR_ROWS: PropRow[] = [
  {
    prop: "currentPage",
    type: "number",
    required: true,
    description: "The current active page (1-indexed).",
  },
  {
    prop: "totalPages",
    type: "number",
    required: true,
    description: "Total number of pages.",
  },
  {
    prop: "onPageChange",
    type: "(page: number) => void",
    required: true,
    description: "Called when the user navigates to a different page.",
  },
  {
    prop: "pageSize",
    type: "number",
    description:
      "Current page size. When provided with onPageSizeChange, renders the rows-per-page selector.",
  },
  {
    prop: "onPageSizeChange",
    type: "(size: number) => void",
    description: "Called when the user changes the page size.",
  },
  {
    prop: "pageSizeOptions",
    type: "number[]",
    default: "[5, 10, 20, 50]",
    description: "Available page size options for the selector.",
  },
  {
    prop: "totalRows",
    type: "number",
    description:
      'When provided, displays a "Total: N rows" indicator next to the rows-per-page selector.',
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes for the toolbar wrapper.",
  },
]

const TOTAL_PAGES = 25

export default function PaginationToolbarPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Pagination Toolbar</h1>
        <p className="p text-muted-foreground">
          A self-contained pagination bar with page indicator, go-to input, and
          previous/next buttons. Optional rows-per-page selector and total row
          count. Use for any paginated dataset over 5 pages. Used internally by
          DataTable.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 gap-6">
        {/* Full toolbar */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">With Rows Per Page</CardTitle>
            <CardDescription>
              The standard configuration — rows-per-page selector, page
              indicator, go-to input, and previous/next buttons.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaginationToolbar
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
            />
          </CardContent>
        </Card>

        {/* Without rows per page */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Without Rows Per Page</CardTitle>
            <CardDescription>
              Omit pageSize and onPageSizeChange when page size is fixed.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaginationToolbar
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setCurrentPage}
            />
          </CardContent>
        </Card>

        {/* With total rows */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">With Total Rows</CardTitle>
            <CardDescription>
              Pass totalRows to show a row count — useful for server-side
              paginated datasets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaginationToolbar
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              totalRows={248}
            />
          </CardContent>
        </Card>

        {/* Custom page sizes */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Custom Page Size Options</CardTitle>
            <CardDescription>
              Override the default options with pageSizeOptions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PaginationToolbar
              currentPage={currentPage}
              totalPages={TOTAL_PAGES}
              onPageChange={setCurrentPage}
              pageSize={pageSize}
              onPageSizeChange={(size) => {
                setPageSize(size)
                setCurrentPage(1)
              }}
              pageSizeOptions={[10, 25, 50, 100]}
            />
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="PaginationToolbar" rows={PAGINATION_TOOLBAR_ROWS} />
      </section>
    </div>
  )
}
