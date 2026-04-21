"use client"

import {
  Skeleton,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const SKELETON_ROWS: PropRow[] = [
  {
    prop: "className",
    type: "string",
    description:
      "CSS classes to control dimensions, shape, and spacing. Use width/height utilities to size, and rounded-full for circular shapes.",
  },
]

export default function SkeletonPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Skeleton</h1>
        <p className="p text-muted-foreground">
          Animated placeholder blocks that indicate loading content. Shape and
          size are controlled entirely through className utilities.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Text lines */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Text Lines</CardTitle>
            <CardDescription>
              Simulates a paragraph of loading text content.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </CardContent>
        </Card>

        {/* Circle */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Circle (Avatar)</CardTitle>
            <CardDescription>
              A rounded-full skeleton for avatar placeholders.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-16 w-16 rounded-full" />
          </CardContent>
        </Card>

        {/* Card layout */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Card Layout</CardTitle>
            <CardDescription>
              A full card skeleton mimicking a loading content card with image,
              title, and description.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 rounded-lg border p-4">
              <Skeleton className="h-32 w-full rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-4/5" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Profile row */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Profile Row</CardTitle>
            <CardDescription>
              Avatar with name and description lines.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Skeleton className="h-12 w-12 rounded-full shrink-0" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table rows */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Table Rows</CardTitle>
            <CardDescription>
              Skeleton rows simulating a loading data table.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 5 }, (_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 flex-1" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Mixed shapes */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Mixed Shapes</CardTitle>
            <CardDescription>
              Combining rectangles, rounded rectangles, and circles.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-full" />
            <Skeleton className="h-8 w-32 rounded-md" />
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Skeleton" rows={SKELETON_ROWS} />
      </section>
    </div>
  )
}
