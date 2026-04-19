"use client"

import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import { Plus, Settings, Trash, Info } from "lucide-react"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const TOOLTIP_PROVIDER_ROWS: PropRow[] = [
  { prop: "delayDuration", type: "number", default: "0", description: "Milliseconds before the tooltip opens. Overridden default from Radix (normally 700ms)." },
  { prop: "skipDelayDuration", type: "number", default: "300", description: "Time between leaving one trigger and entering another without delay." },
  { prop: "disableHoverableContent", type: "boolean", default: "false", description: "When true, the tooltip closes immediately on pointer leave." },
]

const TOOLTIP_ROWS: PropRow[] = [
  { prop: "open", type: "boolean", description: "Controlled open state." },
  { prop: "defaultOpen", type: "boolean", default: "false", description: "Initial open state for uncontrolled usage." },
  { prop: "onOpenChange", type: "(open: boolean) => void", description: "Callback fired when the open state changes." },
  { prop: "delayDuration", type: "number", description: "Override the provider delay for this specific tooltip." },
]

const TOOLTIP_CONTENT_ROWS: PropRow[] = [
  { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"top"', description: "Preferred side of the trigger to render the tooltip." },
  { prop: "sideOffset", type: "number", default: "0", description: "Distance in pixels from the trigger." },
  { prop: "align", type: '"start" | "center" | "end"', default: '"center"', description: "Alignment along the trigger edge." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function TooltipGalleryPage() {
  return (
    <TooltipProvider>
      <div className="space-y-16">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="h1">Tooltip</h1>
          <p className="p text-muted-foreground">
            A floating label that appears on hover or focus to provide brief,
            supplemental information about an element. Includes an arrow
            indicator pointing back to the trigger.
          </p>
        </div>

        {/* Examples */}
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="h2">Examples</h2>
            <p className="p text-muted-foreground">
              Tooltips on buttons, icon buttons, and positioned on different
              sides.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic */}
            <Card level={1}>
              <CardHeader>
                <CardTitle className="label-md">Basic</CardTitle>
                <CardDescription>
                  Hover over the button to reveal a tooltip with descriptive text.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline">Hover me</Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>This is a tooltip</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Add new item</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Sides */}
            <Card level={1}>
              <CardHeader>
                <CardTitle className="label-md">Sides</CardTitle>
                <CardDescription>
                  Position the tooltip on any side of the trigger.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-center gap-4 py-8">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Top</Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Top tooltip</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Right</Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Right tooltip</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Bottom</Button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    <p>Bottom tooltip</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="sm">Left</Button>
                  </TooltipTrigger>
                  <TooltipContent side="left">
                    <p>Left tooltip</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Icon buttons */}
            <Card level={1}>
              <CardHeader>
                <CardTitle className="label-md">Icon Button Labels</CardTitle>
                <CardDescription>
                  Essential for accessibility: tooltips provide visible labels for
                  icon-only buttons.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex items-center gap-3">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Plus className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Create new</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Settings className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Trash className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete</p>
                  </TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Info className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>More information</p>
                  </TooltipContent>
                </Tooltip>
              </CardContent>
            </Card>

            {/* Inline text */}
            <Card level={1}>
              <CardHeader>
                <CardTitle className="label-md">Inline Text</CardTitle>
                <CardDescription>
                  Tooltips can attach to inline text elements for definitions or
                  abbreviations.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="p-sm text-muted-foreground leading-relaxed">
                  The design system uses{" "}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="underline decoration-dotted cursor-help font-medium text-foreground">
                        CVA
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Class Variance Authority</p>
                    </TooltipContent>
                  </Tooltip>{" "}
                  for variant management and{" "}
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="underline decoration-dotted cursor-help font-medium text-foreground">
                        Radix
                      </span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unstyled, accessible UI primitives</p>
                    </TooltipContent>
                  </Tooltip>{" "}
                  for accessible primitives.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* API Reference */}
        <section className="space-y-6">
          <h2 className="h2">API Reference</h2>
          <PropTable title="TooltipProvider" rows={TOOLTIP_PROVIDER_ROWS} />
          <PropTable title="Tooltip" rows={TOOLTIP_ROWS} />
          <PropTable title="TooltipContent" rows={TOOLTIP_CONTENT_ROWS} />
        </section>
      </div>
    </TooltipProvider>
  )
}
