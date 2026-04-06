"use client"

import { useState } from "react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  Separator,
  SidePanelProvider,
  SidePanelContainer,
  useSidePanel,
  Badge,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"
import { Filter, Info, X } from "lucide-react"

/* ─── API Reference Data ──────────────────────────────────────────────────── */

const PROVIDER_ROWS: PropRow[] = [
  { prop: "pathname", type: "string", description: "When this changes, all panels auto-close. Pass your router's pathname." },
]

const CONTAINER_ROWS: PropRow[] = [
  { prop: "children", type: "ReactNode", required: true, description: "Main content area. Panels push this content to make room." },
  { prop: "className", type: "string", description: "Additional classes on the flex container." },
]

const HOOK_ROWS: PropRow[] = [
  { prop: "openSidePanel", type: "(config: SidePanelConfig) => void", description: "Opens a panel. Pass side, title, subtitle, and content." },
  { prop: "closeSidePanel", type: "(side: 'left' | 'right') => void", description: "Closes the panel on the specified side." },
  { prop: "closeAllSidePanels", type: "() => void", description: "Closes both panels." },
  { prop: "leftPanel", type: "SidePanelConfig | null", description: "Current left panel config (null if closed)." },
  { prop: "rightPanel", type: "SidePanelConfig | null", description: "Current right panel config (null if closed)." },
]

const CONFIG_ROWS: PropRow[] = [
  { prop: "side", type: '"left" | "right"', required: true, description: "Which side to open the panel on." },
  { prop: "title", type: "ReactNode", description: "Panel header title." },
  { prop: "subtitle", type: "ReactNode", description: "Secondary text below the title." },
  { prop: "content", type: "ReactNode", required: true, description: "Panel body content." },
]

/* ─── Demo content ────────────────────────────────────────────────────────── */

function DemoContent() {
  const { openSidePanel, closeSidePanel, leftPanel, rightPanel } = useSidePanel()

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-4">
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (leftPanel) {
              closeSidePanel("left")
            } else {
              openSidePanel({
                side: "left",
                title: "Filters",
                content: (
                  <div className="p-4 space-y-4">
                    <div className="space-y-2">
                      <p className="label-sm">Status</p>
                      <div className="space-y-1">
                        {["Active", "Pending", "Closed"].map((s) => (
                          <label key={s} className="flex items-center gap-2 p-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            {s}
                          </label>
                        ))}
                      </div>
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="label-sm">Priority</p>
                      <div className="space-y-1">
                        {["High", "Medium", "Low"].map((s) => (
                          <label key={s} className="flex items-center gap-2 p-sm">
                            <input type="checkbox" defaultChecked className="rounded" />
                            {s}
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                ),
              })
            }
          }}
        >
          <Filter className="size-4" />
          <span className="ml-2">Filters</span>
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            if (rightPanel) {
              closeSidePanel("right")
            } else {
              openSidePanel({
                side: "right",
                title: "Order Details",
                subtitle: "ORD-2024-1234",
                content: (
                  <div className="p-4 space-y-4">
                    <div className="space-y-1">
                      <p className="label-sm">Customer</p>
                      <p className="p text-muted-foreground">Emily Martinez</p>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="label-sm">Amount</p>
                      <p className="p text-muted-foreground">$450.00</p>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="label-sm">Status</p>
                      <Badge variant="success">Approved</Badge>
                    </div>
                    <Separator />
                    <div className="space-y-1">
                      <p className="label-sm">Integration</p>
                      <p className="p text-muted-foreground">Shopify 2</p>
                    </div>
                  </div>
                ),
              })
            }
          }}
        >
          <Info className="size-4" />
          <span className="ml-2">Details</span>
        </Button>
      </div>

      <p className="p text-muted-foreground">
        Click the buttons above to open panels. The content area shifts to make room —
        no overlay, no scroll lock. Try opening both sides at once.
      </p>

      {/* Placeholder rows */}
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-border p-4">
          <div className="size-8 rounded-md bg-muted" />
          <div className="flex-1 space-y-1">
            <div className="h-3 w-32 rounded bg-muted" />
            <div className="h-3 w-48 rounded bg-muted/60" />
          </div>
          <div className="h-3 w-16 rounded bg-muted" />
        </div>
      ))}
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function SidePanelPage() {
  return (
    <div className="space-y-16">
      <div className="space-y-2">
        <h1 className="h1">Side Panel</h1>
        <p className="p text-muted-foreground">
          An inline panel that pushes page content to the side instead of overlaying it.
          Opens from the left (filters) or right (details). On mobile, becomes a full-width sheet.
        </p>
      </div>

      {/* Live demo */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Example</h2>
          <p className="p text-muted-foreground">
            Open the left panel for filters or the right panel for details.
            Both can be open simultaneously. On screens below 768px, panels render as sheets.
          </p>
        </div>

        <Card level={1} className="overflow-hidden">
          <CardContent className="p-0">
            <SidePanelProvider>
              <SidePanelContainer className="h-[480px]">
                <DemoContent />
              </SidePanelContainer>
            </SidePanelProvider>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/* Usage patterns */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Usage Patterns</h2>
          <p className="p text-muted-foreground">
            Convention: left panels are for filtering/navigation, right panels are for detail/inspection.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card level={1}>
            <CardHeader className="pb-4">
              <CardTitle className="label-md">Left panel — Filters</CardTitle>
              <CardDescription>
                Opens a 288px (w-72) panel for filter controls, table column config, or navigation trees.
                Uses a narrower width since filter controls are compact.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card level={1}>
            <CardHeader className="pb-4">
              <CardTitle className="label-md">Right panel — Details</CardTitle>
              <CardDescription>
                Opens a 384px (w-96) panel for inspecting a selected row, viewing metadata,
                or showing contextual information without leaving the page.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Responsive behavior */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Responsive Behavior</h2>
          <p className="p text-muted-foreground">
            On screens below the md breakpoint (768px), panels render as full-width Sheet drawers
            with a back button instead of inline aside elements. The transition is automatic.
          </p>
        </div>
      </div>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="SidePanelProvider" rows={PROVIDER_ROWS} />
        <PropTable title="SidePanelContainer" rows={CONTAINER_ROWS} />
        <PropTable title="useSidePanel() hook" rows={HOOK_ROWS} />
        <PropTable title="SidePanelConfig" rows={CONFIG_ROWS} />
      </section>
    </div>
  )
}
