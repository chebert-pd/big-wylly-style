"use client"

import {
  AspectRatio,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const ASPECT_RATIO_ROWS: PropRow[] = [
  {
    prop: "ratio",
    type: "number",
    default: "1",
    description:
      "The desired width-to-height ratio. For example, 16/9 for widescreen or 1 for a square.",
  },
  {
    prop: "asChild",
    type: "boolean",
    default: "false",
    description:
      "When true, the component renders its child directly, merging props and behavior.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes applied to the root element.",
  },
]

export default function AspectRatioPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Aspect Ratio</h1>
        <p className="p text-muted-foreground">
          Displays content within a desired ratio. Built on Radix UI
          AspectRatio, this component maintains a consistent width-to-height
          ratio regardless of the container size.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 16:9 */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">16:9 Ratio</CardTitle>
            <CardDescription>
              A common widescreen ratio for video and hero images.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={16 / 9} className="overflow-hidden rounded-md">
              <img
                src="https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=800&dpr=2&q=80"
                alt="Landscape photo"
                className="h-full w-full object-cover"
              />
            </AspectRatio>
          </CardContent>
        </Card>

        {/* 1:1 Square */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">1:1 Square</CardTitle>
            <CardDescription>
              A square ratio, commonly used for avatars and thumbnails.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-48">
              <AspectRatio ratio={1} className="overflow-hidden rounded-md">
                <div className="flex h-full w-full items-center justify-center bg-muted">
                  <span className="text-muted-foreground text-sm">1:1</span>
                </div>
              </AspectRatio>
            </div>
          </CardContent>
        </Card>

        {/* 4:3 */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">4:3 Ratio</CardTitle>
            <CardDescription>
              A classic display ratio, often used for photos and cards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={4 / 3} className="overflow-hidden rounded-md">
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">4:3</span>
              </div>
            </AspectRatio>
          </CardContent>
        </Card>

        {/* 21:9 Ultra-wide */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">21:9 Ultra-wide</CardTitle>
            <CardDescription>
              An ultra-wide ratio for cinematic content or banners.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AspectRatio ratio={21 / 9} className="overflow-hidden rounded-md">
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <span className="text-muted-foreground text-sm">21:9</span>
              </div>
            </AspectRatio>
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="AspectRatio" rows={ASPECT_RATIO_ROWS} />
      </section>
    </div>
  )
}
