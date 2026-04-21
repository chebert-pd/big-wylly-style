"use client"

import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const BREADCRUMB_ROWS: PropRow[] = [
  { prop: "children", type: "ReactNode", required: true, description: "BreadcrumbList containing BreadcrumbItems." },
  { prop: "className", type: "string", description: "Additional CSS classes on the nav element." },
]

const BREADCRUMB_SUB_ROWS: PropRow[] = [
  { prop: "BreadcrumbList", type: "component", description: "Ordered list wrapper. Renders an <ol> with flex layout and text styling." },
  { prop: "BreadcrumbItem", type: "component", description: "List item wrapper for a single breadcrumb segment." },
  { prop: "BreadcrumbLink", type: "component", description: "Clickable link within an item. Props: asChild (boolean), href (string)." },
  { prop: "BreadcrumbPage", type: "component", description: "Current page indicator. Renders as a non-interactive span with aria-current=\"page\"." },
  { prop: "BreadcrumbSeparator", type: "component", description: "Visual separator between items. Renders a forward slash by default." },
  { prop: "BreadcrumbEllipsis", type: "component", description: "Ellipsis indicator for collapsed breadcrumb segments. Renders a MoreHorizontal icon." },
]

export default function BreadcrumbGalleryPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Breadcrumb</h1>
        <p className="p text-muted-foreground">
          A navigation trail showing the user's location within a hierarchy.
          Built from composable sub-components for flexible breadcrumb patterns.
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Examples</h2>
          <p className="p text-muted-foreground">
            Common breadcrumb patterns from simple trails to collapsed and
            custom-separator variants.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Basic</CardTitle>
              <CardDescription>A standard breadcrumb trail with the default forward slash separator.</CardDescription>
            </CardHeader>
            <CardContent>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Components</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </CardContent>
          </Card>

          {/* With ellipsis */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">With Ellipsis</CardTitle>
              <CardDescription>Collapse intermediate levels using BreadcrumbEllipsis for deep hierarchies.</CardDescription>
            </CardHeader>
            <CardContent>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbEllipsis />
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Profile</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </CardContent>
          </Card>

          {/* Long trail */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Deep Hierarchy</CardTitle>
              <CardDescription>Breadcrumbs wrap responsively for deeply nested paths.</CardDescription>
            </CardHeader>
            <CardContent>
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Projects</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Acme Corp</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink href="#">Settings</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Members</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Breadcrumb" rows={BREADCRUMB_ROWS} />
        <PropTable title="Sub-components" rows={BREADCRUMB_SUB_ROWS} />
      </section>
    </div>
  )
}
