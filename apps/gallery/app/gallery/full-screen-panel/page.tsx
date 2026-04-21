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
  Badge,
  FullScreenSheet,
  FullScreenSheetHeader,
  FullScreenSheetTitle,
  FullScreenSheetDescription,
  FullScreenSheetActions,
  FullScreenSheetBody,
  FullScreenSheetFooter,
  Input,
  Field,
  FieldLabel,
  FieldContent,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

/* ─── API Reference Data ──────────────────────────────────────────────────── */

const SHEET_ROWS: PropRow[] = [
  { prop: "open", type: "boolean", required: true, description: "Controls whether the sheet is visible." },
  { prop: "onClose", type: "() => void", required: true, description: "Called when the sheet should close (Escape key, close button)." },
]

const HEADER_ROWS: PropRow[] = [
  { prop: "onClose", type: "() => void", required: true, description: "Renders the X close button and wires it to this callback." },
]

const BODY_ROWS: PropRow[] = [
  { prop: "className", type: "string", description: "Additional classes. The body is flex-1 overflow-y-auto by default." },
]

const SUB_ROWS: PropRow[] = [
  { prop: "FullScreenSheet", type: "component", description: "Root — controls open/close state. Locks body scroll and listens for Escape." },
  { prop: "FullScreenSheetHeader", type: "component", description: "Sticky header with bg-card and bottom border. Contains title area + close button." },
  { prop: "FullScreenSheetTitle", type: "component", description: "h2 heading inside the header." },
  { prop: "FullScreenSheetDescription", type: "component", description: "Muted metadata line below the title." },
  { prop: "FullScreenSheetActions", type: "component", description: "Action buttons inside the header, to the left of the close button." },
  { prop: "FullScreenSheetBody", type: "component", description: "Scrollable content area with bg-background. Only this section scrolls." },
  { prop: "FullScreenSheetFooter", type: "component", description: "Optional sticky footer with bg-card and top border. Right-aligned content." },
]

/* ─── Page ────────────────────────────────────────────────────────────────── */

export default function FullScreenSheetPage() {
  const [basicOpen, setBasicOpen] = useState(false)
  const [footerOpen, setFooterOpen] = useState(false)

  return (
    <div className="space-y-16">
      <div className="space-y-2">
        <h1 className="h1">Full Screen Sheet</h1>
        <p className="p text-muted-foreground">
          A full-viewport overlay for complex workflows like multi-step forms, rule builders,
          or detail views. Sticky header with close button, scrollable body, and optional sticky footer.
        </p>
      </div>

      {/* Examples */}
      <div className="space-y-6">
        <h2 className="h2">Examples</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">Basic</CardTitle>
              <CardDescription>Header with title, description, actions, and close button.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => setBasicOpen(true)}>
                Open sheet
              </Button>

              <FullScreenSheet open={basicOpen} onClose={() => setBasicOpen(false)}>
                <FullScreenSheetHeader onClose={() => setBasicOpen(false)}>
                  <FullScreenSheetTitle>Create Rule (Advanced)</FullScreenSheetTitle>
                  <FullScreenSheetDescription>
                    <span>Policy: <span className="text-foreground">Fraud Prevention</span></span>
                    <span className="text-border-subtle">·</span>
                    <span>Status: <span className="text-foreground">Draft</span></span>
                  </FullScreenSheetDescription>
                </FullScreenSheetHeader>

                <FullScreenSheetBody>
                  <div className="mx-auto max-w-3xl space-y-8 p-6">
                    <Card level={1}>
                      <CardHeader>
                        <CardTitle>Basic Rule Information</CardTitle>
                        <CardDescription>Give your rule a name and description.</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <Field>
                          <FieldLabel>Rule name</FieldLabel>
                          <FieldContent>
                            <Input placeholder="e.g. Block high-risk countries" />
                          </FieldContent>
                        </Field>
                      </CardContent>
                    </Card>

                    <Card level={1}>
                      <CardHeader>
                        <CardTitle>Triggers</CardTitle>
                        <CardDescription>Define the conditions that will trigger this rule.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="p text-muted-foreground">Trigger configuration goes here.</p>
                      </CardContent>
                    </Card>

                    <Card level={1}>
                      <CardHeader>
                        <CardTitle>Actions</CardTitle>
                        <CardDescription>Choose what happens when this rule fires.</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="p text-muted-foreground">Action configuration goes here.</p>
                      </CardContent>
                    </Card>
                  </div>
                </FullScreenSheetBody>
              </FullScreenSheet>
            </CardContent>
          </Card>

          {/* With footer */}
          <Card level={1}>
            <CardHeader>
              <CardTitle className="label-md">With footer</CardTitle>
              <CardDescription>Sticky footer pinned to the bottom with action buttons.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" onClick={() => setFooterOpen(true)}>
                Open with footer
              </Button>

              <FullScreenSheet open={footerOpen} onClose={() => setFooterOpen(false)}>
                <FullScreenSheetHeader onClose={() => setFooterOpen(false)}>
                  <FullScreenSheetTitle>Review Order</FullScreenSheetTitle>
                  <FullScreenSheetDescription>
                    <span>Order #12345</span>
                    <span className="text-border-subtle">·</span>
                    <Badge variant="warning">Pending Review</Badge>
                  </FullScreenSheetDescription>
                </FullScreenSheetHeader>

                <FullScreenSheetBody>
                  <div className="mx-auto max-w-3xl space-y-6 p-6">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <Card key={i} level={1}>
                        <CardHeader>
                          <CardTitle>Section {i + 1}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="p text-muted-foreground">
                            Scroll down to see the footer stay pinned to the bottom.
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </FullScreenSheetBody>

                <FullScreenSheetFooter>
                  <Button variant="outline" onClick={() => setFooterOpen(false)}>Cancel</Button>
                  <Button variant="destructive">Decline</Button>
                  <Button>Approve</Button>
                </FullScreenSheetFooter>
              </FullScreenSheet>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="FullScreenSheet" rows={SHEET_ROWS} />
        <PropTable title="FullScreenSheetHeader" rows={HEADER_ROWS} />
        <PropTable title="FullScreenSheetBody" rows={BODY_ROWS} />
        <PropTable title="Sub-components" rows={SUB_ROWS} />
      </section>
    </div>
  )
}
