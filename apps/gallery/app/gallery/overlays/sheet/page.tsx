"use client"

import * as React from "react"

import {
  Button,
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const SIDES = ["right", "left", "top", "bottom"] as const

const SHEET_CONTENT_ROWS: PropRow[] = [
  { prop: "side", type: '"top" | "right" | "bottom" | "left"', default: '"right"', description: "Which edge of the viewport the panel slides in from." },
  { prop: "className", type: "string", description: "Additional CSS classes applied to the panel." },
  { prop: "children", type: "ReactNode", description: "Panel content. Use SheetHeader, SheetBody, and SheetFooter for consistent layout." },
]

const SHEET_ANATOMY_ROWS: PropRow[] = [
  { prop: "Sheet", type: "component", description: "Root. Wraps the trigger and content. Accepts all Radix Dialog.Root props (open, onOpenChange, defaultOpen, modal)." },
  { prop: "SheetTrigger", type: "component", description: "The element that opens the sheet. Use asChild to wrap your own button." },
  { prop: "SheetContent", type: "component", description: "The sliding panel. Accepts side prop and renders the overlay automatically." },
  { prop: "SheetHeader", type: "component", description: "Top section with consistent padding. Wrap SheetTitle and SheetDescription inside." },
  { prop: "SheetBody", type: "component", description: "Scrollable middle section (flex-1 overflow-y-auto). Place the main content here." },
  { prop: "SheetFooter", type: "component", description: "Bottom section pinned to the panel's edge. Holds action buttons." },
  { prop: "SheetTitle", type: "component", description: "Accessible panel title. Required for screen readers." },
  { prop: "SheetDescription", type: "component", description: "Accessible panel description. Optional but recommended." },
  { prop: "SheetClose", type: "component", description: "Programmatic close trigger. Use asChild to wrap a custom button." },
]

export default function SheetGalleryPage() {
  return (
    <div className="space-y-16 pb-16">
      <div>
        <h2 className="h2 mb-1">Sheet</h2>
        <p className="p text-muted-foreground">
          A panel that slides in from any edge of the screen. Built on Radix
          Dialog — accessible, focus-trapped, and keyboard-dismissible.
        </p>
      </div>

      {/* Sides */}
      <section className="space-y-4">
        <h3 className="h3">Side</h3>
        <p className="p-sm text-muted-foreground">
          Open from any edge of the viewport using the <code>side</code> prop.
        </p>
        <div className="flex flex-wrap gap-3">
          {SIDES.map((side) => (
            <Sheet key={side}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="capitalize">
                  Open {side}
                </Button>
              </SheetTrigger>
              <SheetContent side={side}>
                <SheetHeader>
                  <SheetTitle className="capitalize">
                    Sheet — {side}
                  </SheetTitle>
                  <SheetDescription>
                    This sheet slides in from the {side}. Use{" "}
                    <code>SheetBody</code> for scrollable content and{" "}
                    <code>SheetFooter</code> for actions.
                  </SheetDescription>
                </SheetHeader>
                <SheetBody>
                  <div className="space-y-3">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="h-8 rounded bg-border-subtle" />
                    ))}
                  </div>
                </SheetBody>
                <SheetFooter>
                  <Button variant="outline" size="sm">
                    Cancel
                  </Button>
                  <Button variant="primary" size="sm">
                    Save changes
                  </Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </section>

      {/* Anatomy */}
      <section className="space-y-4">
        <h3 className="h3">Anatomy</h3>
        <p className="p-sm text-muted-foreground">
          A full example showing Header, Body (scrollable), and Footer with
          actions.
        </p>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="primary" size="sm">
              Open full example
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>
                Make changes to your profile here. Click save when you are done.
              </SheetDescription>
            </SheetHeader>
            <SheetBody>
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="label-sm text-muted-foreground">Name</p>
                  <div className="h-9 rounded-[var(--radius)] border border-border bg-background" />
                </div>
                <div className="space-y-1">
                  <p className="label-sm text-muted-foreground">Email</p>
                  <div className="h-9 rounded-[var(--radius)] border border-border bg-background" />
                </div>
                <div className="space-y-1">
                  <p className="label-sm text-muted-foreground">Bio</p>
                  <div className="h-20 rounded-[var(--radius)] border border-border bg-background" />
                </div>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="h-8 rounded bg-border-subtle" />
                ))}
              </div>
            </SheetBody>
            <SheetFooter>
              <Button variant="outline" size="sm">
                Cancel
              </Button>
              <Button variant="primary" size="sm">
                Save changes
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="SheetContent props" rows={SHEET_CONTENT_ROWS} />
        <PropTable title="Anatomy" rows={SHEET_ANATOMY_ROWS} />
      </section>
    </div>
  )
}
