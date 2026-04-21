"use client"

import { useState } from "react"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@chebert-pd/ui"
import { ChevronsUpDown } from "lucide-react"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const COLLAPSIBLE_ROWS: PropRow[] = [
  { prop: "open", type: "boolean", description: "Controlled open state." },
  { prop: "defaultOpen", type: "boolean", default: "false", description: "Initial open state for uncontrolled usage." },
  { prop: "onOpenChange", type: "(open: boolean) => void", description: "Callback fired when the open state changes." },
  { prop: "disabled", type: "boolean", default: "false", description: "Prevents the trigger from toggling content." },
]

const COLLAPSIBLE_SUB_ROWS: PropRow[] = [
  { prop: "CollapsibleTrigger", type: "component", description: "The element that toggles the collapsible. Supports asChild for custom trigger elements." },
  { prop: "CollapsibleContent", type: "component", description: "The content region that shows/hides when the collapsible is toggled." },
]

export default function CollapsibleGalleryPage() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Collapsible</h1>
        <p className="p text-muted-foreground">
          A component that expands and collapses a content panel. Use for
          progressive disclosure of additional details, settings, or secondary
          content.
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="h2">Examples</h2>
          <p className="p text-muted-foreground">
            Basic collapsible patterns with triggers and expandable content.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Basic</CardTitle>
              <CardDescription>A simple collapsible with a button trigger and hidden content.</CardDescription>
            </CardHeader>
            <CardContent>
              <Collapsible>
                <div className="flex items-center justify-between space-x-4">
                  <h4 className="label-sm">3 items tagged</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="size-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <Card level={2} size="xs">
                  <CardContent><span className="font-mono text-sm">@chebert-pd/ui</span></CardContent>
                </Card>
                <CollapsibleContent className="space-y-2 mt-2">
                  <Card level={2} size="xs">
                    <CardContent><span className="font-mono text-sm">@wyllo/tokens</span></CardContent>
                  </Card>
                  <Card level={2} size="xs">
                    <CardContent><span className="font-mono text-sm">@wyllo/icons</span></CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Controlled */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Controlled</CardTitle>
              <CardDescription>Use open and onOpenChange for controlled state management.</CardDescription>
            </CardHeader>
            <CardContent>
              <Collapsible open={isOpen} onOpenChange={setIsOpen}>
                <div className="flex items-center justify-between space-x-4">
                  <h4 className="label-sm">
                    {isOpen ? "Expanded" : "Collapsed"}
                  </h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="size-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2">
                  <Card level={2} size="xs">
                    <CardContent>
                      <p className="p-sm text-muted-foreground">
                        This section is controlled externally. The parent component
                        manages the open state, which enables programmatic
                        toggling or integration with other UI state.
                      </p>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Default open */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Default Open</CardTitle>
              <CardDescription>Content visible on first render using defaultOpen.</CardDescription>
            </CardHeader>
            <CardContent>
              <Collapsible defaultOpen>
                <div className="flex items-center justify-between space-x-4">
                  <h4 className="label-sm">Release notes</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <ChevronsUpDown className="size-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2 space-y-2">
                  <Card level={2} size="xs">
                    <CardContent><span className="text-sm">v2.1.0 &mdash; Added Collapsible gallery page</span></CardContent>
                  </Card>
                  <Card level={2} size="xs">
                    <CardContent><span className="text-sm">v2.0.0 &mdash; Migrated to Radix primitives</span></CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>

          {/* Disabled */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Disabled</CardTitle>
              <CardDescription>The trigger cannot be interacted with when disabled.</CardDescription>
            </CardHeader>
            <CardContent>
              <Collapsible disabled>
                <div className="flex items-center justify-between space-x-4">
                  <h4 className="label-sm text-muted-foreground">Locked section</h4>
                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm" disabled>
                      <ChevronsUpDown className="size-4" />
                      <span className="sr-only">Toggle</span>
                    </Button>
                  </CollapsibleTrigger>
                </div>
                <CollapsibleContent className="mt-2">
                  <Card level={2} size="xs">
                    <CardContent>
                      <span className="text-sm">This content is hidden and the trigger is disabled.</span>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Collapsible" rows={COLLAPSIBLE_ROWS} />
        <PropTable title="Sub-components" rows={COLLAPSIBLE_SUB_ROWS} />
      </section>
    </div>
  )
}
