"use client"

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
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
    type: '"xs" | "sm" | "md" | "lg"',
    default: '"md"',
    description: "Size of the pagination button.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Prevents interaction with the link.",
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

export default function PaginationPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Pagination</h1>
        <p className="p text-muted-foreground">
          Navigation controls for moving between pages of content. Composed from
          semantic sub-components for previous, next, page numbers, and
          ellipsis.
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
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">10</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>

        {/* First page */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">First Page Active</CardTitle>
            <CardDescription>
              When on the first page, the previous button is still present for
              consistent layout.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious href="#" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    1
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">2</PaginationLink>
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

        {/* With ellipsis on both sides */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Ellipsis on Both Sides</CardTitle>
            <CardDescription>
              When the active page is in the middle of a large set, ellipsis
              appears on both ends.
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
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">12</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#" isActive>
                    13
                  </PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">14</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLink href="#">25</PaginationLink>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext href="#" />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Pagination" rows={PAGINATION_ROWS} />
        <PropTable title="PaginationLink" rows={PAGINATION_LINK_ROWS} />
        <PropTable title="Sub-components" rows={PAGINATION_SUB_ROWS} />
      </section>
    </div>
  )
}
