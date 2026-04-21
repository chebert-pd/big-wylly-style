"use client"

import {
  Spinner,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const SPINNER_ROWS: PropRow[] = [
  {
    prop: "className",
    type: "string",
    description:
      'Additional CSS classes. Use size utilities (e.g. "size-6", "size-8") to change dimensions. Default size is size-4.',
  },
  {
    prop: "aria-label",
    type: "string",
    default: '"Loading"',
    description: "Accessible label for the spinner.",
  },
]

const sizes = [
  { label: "Extra Small", className: "size-3", code: "size-3" },
  { label: "Default", className: "size-4", code: "size-4" },
  { label: "Medium", className: "size-5", code: "size-5" },
  { label: "Large", className: "size-6", code: "size-6" },
  { label: "Extra Large", className: "size-8", code: "size-8" },
]

export default function SpinnerPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Spinner</h1>
        <p className="p text-muted-foreground">
          An animated loading indicator using the Loader2 icon from Lucide with
          a continuous spin animation. Size is controlled via className
          utilities.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sizes */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Sizes</CardTitle>
            <CardDescription>
              Control spinner size using Tailwind size utilities.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              {sizes.map((size) => (
                <div
                  key={size.label}
                  className="flex flex-col items-center gap-2"
                >
                  <Spinner className={size.className} />
                  <span className="p-sm text-muted-foreground">
                    {size.code}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Default */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Default</CardTitle>
            <CardDescription>
              The spinner at its default size (size-4) with no additional
              className.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Spinner />
            <span className="p-sm text-muted-foreground">Loading...</span>
          </CardContent>
        </Card>

        {/* Inline with text */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Inline with Text</CardTitle>
            <CardDescription>
              Spinner placed alongside text content in a loading message.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Spinner className="size-4" />
              <p className="p-sm text-muted-foreground">
                Fetching results...
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Centered in container */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Centered in Container</CardTitle>
            <CardDescription>
              A large spinner centered in a container, typical for full-section
              loading states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-32 items-center justify-center rounded-md border border-dashed">
              <Spinner className="size-8" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Spinner" rows={SPINNER_ROWS} />
      </section>
    </div>
  )
}
