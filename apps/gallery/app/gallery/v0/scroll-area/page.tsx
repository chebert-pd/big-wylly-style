"use client"

import {
  ScrollArea,
  ScrollBar,
  Separator,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const SCROLL_AREA_ROWS: PropRow[] = [
  {
    prop: "type",
    type: '"auto" | "always" | "scroll" | "hover"',
    default: '"auto"',
    description:
      "Controls scrollbar visibility. Auto hides when not scrolling; always keeps it visible.",
  },
  {
    prop: "scrollHideDelay",
    type: "number",
    default: "600",
    description:
      'Delay in ms before scrollbars hide after the user stops scrolling (only for type "scroll" and "hover").',
  },
  {
    prop: "dir",
    type: '"ltr" | "rtl"',
    description: "Reading direction for the scroll area.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes applied to the root element.",
  },
]

const SCROLLBAR_ROWS: PropRow[] = [
  {
    prop: "orientation",
    type: '"vertical" | "horizontal"',
    default: '"vertical"',
    description: "Whether the scrollbar handles vertical or horizontal overflow.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes applied to the scrollbar track.",
  },
]

const tags = Array.from({ length: 50 }, (_, i) => `Item ${i + 1}`)

const artworks = [
  { title: "Starry Night", artist: "Van Gogh" },
  { title: "Water Lilies", artist: "Monet" },
  { title: "The Persistence of Memory", artist: "Dali" },
  { title: "Girl with a Pearl Earring", artist: "Vermeer" },
  { title: "The Birth of Venus", artist: "Botticelli" },
  { title: "Guernica", artist: "Picasso" },
  { title: "The Great Wave", artist: "Hokusai" },
  { title: "A Sunday Afternoon", artist: "Seurat" },
  { title: "American Gothic", artist: "Wood" },
  { title: "The Kiss", artist: "Klimt" },
]

export default function ScrollAreaPage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Scroll Area</h1>
        <p className="p text-muted-foreground">
          A custom-styled scrollable container built on Radix UI ScrollArea. Provides
          consistent scrollbar styling across browsers with both vertical and
          horizontal scroll support.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Vertical */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Vertical Scroll</CardTitle>
            <CardDescription>
              A long list of items in a fixed-height scrollable area.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-72 w-full rounded-md border">
              <div className="p-4">
                <h4 className="label-sm mb-4">Tags</h4>
                {tags.map((tag, i) => (
                  <div key={tag}>
                    <div className="p-sm py-2">{tag}</div>
                    {i < tags.length - 1 && <Separator />}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Horizontal */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Horizontal Scroll</CardTitle>
            <CardDescription>
              A horizontally scrollable list of artwork cards.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="w-full whitespace-nowrap rounded-md border">
              <div className="flex w-max space-x-4 p-4">
                {artworks.map((artwork) => (
                  <div
                    key={artwork.title}
                    className="w-40 shrink-0 rounded-md border bg-secondary p-4"
                  >
                    <div className="h-20 rounded-md bg-muted mb-2" />
                    <p className="label-sm truncate">{artwork.title}</p>
                    <p className="p-sm text-muted-foreground">
                      {artwork.artist}
                    </p>
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Both directions */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Both Directions</CardTitle>
            <CardDescription>
              Content that overflows both vertically and horizontally.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-48 w-full rounded-md border">
              <div className="w-[800px] p-4">
                {Array.from({ length: 20 }, (_, i) => (
                  <p key={i} className="p-sm py-1 whitespace-nowrap">
                    Row {i + 1} — This is a wide content area that extends
                    beyond the visible boundary to demonstrate both vertical and
                    horizontal scrolling working simultaneously.
                  </p>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="ScrollArea" rows={SCROLL_AREA_ROWS} />
        <PropTable title="ScrollBar" rows={SCROLLBAR_ROWS} />
      </section>
    </div>
  )
}
