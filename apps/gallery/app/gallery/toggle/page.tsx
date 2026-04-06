"use client"

import { useState } from "react"
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify } from "lucide-react"
import { Toggle, ToggleGroup, ToggleGroupItem, Card, CardContent } from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const TOGGLE_ROWS: PropRow[] = [
  {
    prop: "variant",
    type: '"default" | "outline"',
    default: '"outline"',
    description: 'Visual style. Outline (default) shows a border; "default" is transparent with no border.',
  },
  {
    prop: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Controls height and padding of the toggle.",
  },
  {
    prop: "pressed",
    type: "boolean",
    description: "Controlled pressed state.",
  },
  {
    prop: "defaultPressed",
    type: "boolean",
    description: "Initial pressed state when uncontrolled.",
  },
  {
    prop: "onPressedChange",
    type: "(pressed: boolean) => void",
    description: "Callback fired when the pressed state changes.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Prevents interaction and renders the toggle at reduced opacity.",
  },
]

const TOGGLE_GROUP_ROWS: PropRow[] = [
  {
    prop: "type",
    type: '"single" | "multiple"',
    required: true,
    description:
      'Whether one or multiple items can be active at a time. Single renders a connected strip (gap-0); multiple renders spaced standalone pills (gap-1).',
  },
  {
    prop: "value",
    type: "string | string[]",
    description: "Controlled active value. Use string for single, string[] for multiple.",
  },
  {
    prop: "defaultValue",
    type: "string | string[]",
    description: "Initial value when uncontrolled.",
  },
  {
    prop: "onValueChange",
    type: "(value: string | string[]) => void",
    description: "Callback when the active selection changes.",
  },
  {
    prop: "size",
    type: '"sm" | "default" | "lg"',
    default: '"default"',
    description: "Size passed to all child ToggleGroupItems via React context.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables all items in the group.",
  },
]

const TOGGLE_GROUP_ITEM_ROWS: PropRow[] = [
  {
    prop: "value",
    type: "string",
    required: true,
    description: "Unique identifier for this item within the group.",
  },
  {
    prop: "disabled",
    type: "boolean",
    description: "Disables this specific item independently of the group.",
  },
]

const sizes = ["sm", "default", "lg"] as const

export default function TogglePage() {
  const [formatting, setFormatting] = useState<string[]>([])
  const [alignment, setAlignment] = useState<string>("left")

  return (
    <div className="space-y-6">

      {/* ── CARD 1: TOGGLE ──────────────────────────────────────── */}
      <Card level={1}>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <h2 className="h2">Toggle</h2>
            <p className="p text-muted-foreground">
              A two-state button for toggling a single feature on or off.
            </p>
          </div>

          {/* Size */}
          <div className="space-y-3">
            <p className="label-md text-muted-foreground">Size</p>
            <div className="flex flex-wrap gap-3 items-center">
              {sizes.map((size) => (
                <Toggle key={size} size={size}>
                  <Bold className="size-4" />
                  <span className="capitalize">{size}</span>
                </Toggle>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3">
            <p className="label-md text-muted-foreground">Content</p>
            <div className="flex flex-wrap gap-3 items-center">
              <Toggle aria-label="Bold">
                <Bold className="size-4" />
              </Toggle>
              <Toggle>Bold</Toggle>
              <Toggle>
                <Bold className="size-4" /> Bold
              </Toggle>
            </div>
          </div>

          {/* States */}
          <div className="space-y-3">
            <p className="label-md text-muted-foreground">States</p>
            <div className="flex flex-wrap gap-6 items-start">
              <div className="flex flex-col items-center gap-1.5">
                <Toggle defaultPressed={false}>
                  <Italic className="size-4" /> Italic
                </Toggle>
                <span className="p-sm text-muted-foreground">off</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Toggle defaultPressed={true}>
                  <Italic className="size-4" /> Italic
                </Toggle>
                <span className="p-sm text-muted-foreground">on</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Toggle disabled>
                  <Italic className="size-4" /> Italic
                </Toggle>
                <span className="p-sm text-muted-foreground">disabled</span>
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <Toggle defaultPressed={true} disabled>
                  <Italic className="size-4" /> Italic
                </Toggle>
                <span className="p-sm text-muted-foreground">disabled on</span>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* ── CARD 2: TOGGLE GROUP ────────────────────────────────── */}
      <Card level={1}>
        <CardContent className="space-y-8">
          <div className="space-y-2">
            <h2 className="h2">Toggle Group</h2>
            <p className="p text-muted-foreground">
              A set of related toggles that share selection state. Use{" "}
              <code className="font-mono p-sm">type="single"</code> for mutually
              exclusive options and{" "}
              <code className="font-mono p-sm">type="multiple"</code> for
              independent multi-select options.
            </p>
          </div>

          {/* Size */}
          <div className="space-y-3">
            <p className="label-md text-muted-foreground">Size</p>
            <div className="flex flex-col gap-4">
              {sizes.map((size) => (
                <div key={size} className="flex items-center gap-4">
                  <span className="label-sm text-muted-foreground w-16 shrink-0 capitalize">
                    {size}
                  </span>
                  <ToggleGroup type="single" size={size} defaultValue="left">
                    <ToggleGroupItem value="left" aria-label="Align left">
                      <AlignLeft className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center">
                      <AlignCenter className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right">
                      <AlignRight className="size-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="justify" aria-label="Justify">
                      <AlignJustify className="size-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                </div>
              ))}
            </div>
          </div>

          {/* Selection Mode */}
          <div className="space-y-6">
            <p className="label-md text-muted-foreground">Selection Mode</p>

            <div className="space-y-3">
              <div className="space-y-0.5">
                <p className="p-sm font-medium text-foreground">Single</p>
                <p className="p-sm text-muted-foreground">
                  Only one item can be active at a time. Items render as a
                  connected strip with shared borders and no gap.
                </p>
              </div>
              <ToggleGroup
                type="single"
                value={alignment}
                onValueChange={(v) => {
                  if (v) setAlignment(v)
                }}
              >
                <ToggleGroupItem value="left">
                  <AlignLeft className="size-4" /> Left
                </ToggleGroupItem>
                <ToggleGroupItem value="center">
                  <AlignCenter className="size-4" /> Center
                </ToggleGroupItem>
                <ToggleGroupItem value="right">
                  <AlignRight className="size-4" /> Right
                </ToggleGroupItem>
                <ToggleGroupItem value="justify">
                  <AlignJustify className="size-4" /> Justify
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="p-sm text-muted-foreground">
                Active:{" "}
                <span className="font-medium text-foreground capitalize">
                  {alignment}
                </span>
              </p>
            </div>

            <div className="space-y-3">
              <div className="space-y-0.5">
                <p className="p-sm font-medium text-foreground">Multiple</p>
                <p className="p-sm text-muted-foreground">
                  Any combination of items can be active. Items render as
                  independent pills with a 0.25rem gap between them.
                </p>
              </div>
              <ToggleGroup
                type="multiple"
                value={formatting}
                onValueChange={setFormatting}
              >
                <ToggleGroupItem value="bold">
                  <Bold className="size-4" /> Bold
                </ToggleGroupItem>
                <ToggleGroupItem value="italic">
                  <Italic className="size-4" /> Italic
                </ToggleGroupItem>
                <ToggleGroupItem value="underline">
                  <Underline className="size-4" /> Underline
                </ToggleGroupItem>
              </ToggleGroup>
              <p className="p-sm text-muted-foreground">
                Active:{" "}
                <span className="font-medium text-foreground">
                  {formatting.length ? formatting.join(", ") : "none"}
                </span>
              </p>
            </div>
          </div>

          {/* States */}
          <div className="space-y-3">
            <p className="label-md text-muted-foreground">States</p>
            <div className="flex flex-wrap gap-8 items-start">
              <div className="space-y-2">
                <ToggleGroup type="single" disabled>
                  <ToggleGroupItem value="left" aria-label="Align left">
                    <AlignLeft className="size-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center">
                    <AlignCenter className="size-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Align right">
                    <AlignRight className="size-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="p-sm text-muted-foreground">Group disabled</p>
              </div>

              <div className="space-y-2">
                <ToggleGroup type="single" defaultValue="left">
                  <ToggleGroupItem value="left" aria-label="Align left">
                    <AlignLeft className="size-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="center" aria-label="Align center" disabled>
                    <AlignCenter className="size-4" />
                  </ToggleGroupItem>
                  <ToggleGroupItem value="right" aria-label="Align right">
                    <AlignRight className="size-4" />
                  </ToggleGroupItem>
                </ToggleGroup>
                <p className="p-sm text-muted-foreground">Item disabled</p>
              </div>
            </div>
          </div>

        </CardContent>
      </Card>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Toggle" rows={TOGGLE_ROWS} />
        <PropTable title="ToggleGroup" rows={TOGGLE_GROUP_ROWS} />
        <PropTable title="ToggleGroupItem" rows={TOGGLE_GROUP_ITEM_ROWS} />
      </section>

    </div>
  )
}
