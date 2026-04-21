"use client"

import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const PANEL_GROUP_ROWS: PropRow[] = [
  {
    prop: "direction",
    type: '"horizontal" | "vertical"',
    required: true,
    description:
      "The direction in which the panels are laid out and resized.",
  },
  {
    prop: "autoSaveId",
    type: "string",
    description:
      "Unique ID for persisting panel sizes to localStorage. Panels restore their sizes on mount when set.",
  },
  {
    prop: "onLayout",
    type: "(sizes: number[]) => void",
    description:
      "Callback fired when the layout changes, receiving an array of panel size percentages.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes applied to the panel group container.",
  },
]

const PANEL_ROWS: PropRow[] = [
  {
    prop: "defaultSize",
    type: "number",
    description:
      "Initial size of the panel as a percentage (0-100). Panels without a defaultSize split remaining space equally.",
  },
  {
    prop: "minSize",
    type: "number",
    description: "Minimum size of the panel as a percentage.",
  },
  {
    prop: "maxSize",
    type: "number",
    description: "Maximum size of the panel as a percentage.",
  },
  {
    prop: "collapsible",
    type: "boolean",
    default: "false",
    description: "Whether the panel can be collapsed by dragging past its minimum size.",
  },
  {
    prop: "collapsedSize",
    type: "number",
    description:
      "The size of the panel when collapsed, as a percentage.",
  },
  {
    prop: "onCollapse",
    type: "() => void",
    description: "Callback fired when the panel is collapsed.",
  },
  {
    prop: "onExpand",
    type: "() => void",
    description: "Callback fired when the panel is expanded.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes applied to the panel.",
  },
]

const HANDLE_ROWS: PropRow[] = [
  {
    prop: "withHandle",
    type: "boolean",
    default: "false",
    description:
      "When true, renders a visible grip icon on the handle for better affordance.",
  },
  {
    prop: "disabled",
    type: "boolean",
    default: "false",
    description: "Prevents the handle from being dragged when true.",
  },
  {
    prop: "className",
    type: "string",
    description: "Additional CSS classes applied to the resize handle.",
  },
]

export default function ResizablePage() {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Resizable</h1>
        <p className="p text-muted-foreground">
          Resizable panel groups built on react-resizable-panels. Create
          horizontally or vertically resizable layouts with draggable handles,
          optional grip icons, and persistent sizing via localStorage.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 gap-6">
        {/* Horizontal */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Horizontal Layout</CardTitle>
            <CardDescription>
              Two panels side by side with a draggable handle.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[200px] max-w-full rounded-lg border"
            >
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Panel One</span>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Panel Two</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </CardContent>
        </Card>

        {/* With Handle */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">With Grip Handle</CardTitle>
            <CardDescription>
              The withHandle prop renders a visible drag grip for better
              discoverability.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[200px] max-w-full rounded-lg border"
            >
              <ResizablePanel defaultSize={30} minSize={20}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Sidebar</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={70}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Content</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </CardContent>
        </Card>

        {/* Vertical */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Vertical Layout</CardTitle>
            <CardDescription>
              Panels stacked vertically, useful for top/bottom split views.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResizablePanelGroup
              direction="vertical"
              className="min-h-[300px] max-w-full rounded-lg border"
            >
              <ResizablePanel defaultSize={40}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Top</span>
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel defaultSize={60}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Bottom</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </CardContent>
        </Card>

        {/* Three-panel */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Three Panels</CardTitle>
            <CardDescription>
              A common IDE-style layout with three resizable panels.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResizablePanelGroup
              direction="horizontal"
              className="min-h-[200px] max-w-full rounded-lg border"
            >
              <ResizablePanel defaultSize={25} minSize={15}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Explorer</span>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={50}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Editor</span>
                </div>
              </ResizablePanel>
              <ResizableHandle />
              <ResizablePanel defaultSize={25} minSize={15}>
                <div className="flex h-full items-center justify-center p-6">
                  <span className="text-sm font-medium">Properties</span>
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="ResizablePanelGroup" rows={PANEL_GROUP_ROWS} />
        <PropTable title="ResizablePanel" rows={PANEL_ROWS} />
        <PropTable title="ResizableHandle" rows={HANDLE_ROWS} />
      </section>
    </div>
  )
}
