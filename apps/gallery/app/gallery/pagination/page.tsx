"use client"

import { useState } from "react"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  PaginationToolbar,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const PAGINATION_ROWS: PropRow[] = [
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes for the nav wrapper.",
  },
]

const PAGINATION_LINK_ROWS: PropRow[] = [
  {
    prop: "isActive",
    type: "boolean",
    default: "false",
    description:
      'Marks the link as the current page. Renders with the "outline" button variant when active, "ghost" when inactive.',
  },
  {
    prop: "size",
    type: '"xs" | "sm"',
    default: '"sm"',
    description: "Size of the pagination button.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Prevents interaction with the link.",
  },
]

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
      'When provided, displays a "Total: N rows" indicator.',
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes for the toolbar wrapper.",
  },
]

const PAGINATION_SUB_ROWS: PropRow[] = [
  {
    prop: "PaginationContent",
    type: "component",
    description:
      "Wrapper ul element that lays out pagination items in a horizontal row with gap.",
  },
  {
    prop: "PaginationItem",
    type: "component",
    description: "An li element wrapping a single pagination control.",
  },
  {
    prop: "PaginationPrevious",
    type: "component",
    description:
      'Renders a "Previous" link with a left chevron icon. Shows label on sm+ screens.',
  },
  {
    prop: "PaginationNext",
    type: "component",
    description:
      'Renders a "Next" link with a right chevron icon. Shows label on sm+ screens.',
  },
  {
    prop: "PaginationEllipsis",
    type: "component",
    description:
      "Renders a horizontal dots icon to indicate skipped pages. Includes sr-only text.",
  },
]

const TOTAL_PAGES = 25

export default function PaginationPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Pagination</h1>
        <p className="p text-muted-foreground">
          Navigation controls for moving between pages of content. Use the
          composable primitives for 5 pages or fewer, and PaginationToolbar for
          larger datasets.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 gap-6">
        {/* Basic */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Basic Pagination</CardTitle>
            <CardDescription>
              Previous and next controls with numbered page links and ellipsis.
              Best for 5 pages or fewer.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">1</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    2
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">3</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">4</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">5</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>

        {/* PaginationToolbar — with rows per page */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Toolbar with Rows Per Page</CardTitle>
            <CardDescription>
              The standard pattern for paginated data. Includes rows-per-page
              selector, page indicator, go-to input, and previous/next buttons.
              Use for any dataset over 5 pages.
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

        {/* PaginationToolbar — without rows per page */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Toolbar without Rows Per Page</CardTitle>
            <CardDescription>
              When page size is fixed, omit pageSize and onPageSizeChange to
              hide the selector.
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

        {/* PaginationToolbar — with total rows */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Toolbar with Total Rows</CardTitle>
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
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="PaginationToolbar" rows={PAGINATION_TOOLBAR_ROWS} />
        <PropTable title="Pagination" rows={PAGINATION_ROWS} />
        <PropTable title="PaginationLink" rows={PAGINATION_LINK_ROWS} />
        <PropTable title="Sub-components" rows={PAGINATION_SUB_ROWS} />
      </section>
    </div>
  )
}
