"use client"

import {
  Button,
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
  DrawerClose,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const DRAWER_CONTENT_ROWS: PropRow[] = [
  { prop: "showHandle", type: "boolean", default: "true", description: "Show the drag handle pill at the top of the drawer." },
  { prop: "children", type: "ReactNode", required: true, description: "Drawer body content." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const DRAWER_ANATOMY_ROWS: PropRow[] = [
  { prop: "Drawer", type: "component", description: "Root. Accepts open, onOpenChange, shouldScaleBackground." },
  { prop: "DrawerTrigger", type: "component", description: "Element that opens the drawer. Use asChild." },
  { prop: "DrawerContent", type: "component", description: "The drawer panel. Slides up from the bottom with glass treatment on top edge." },
  { prop: "DrawerHeader", type: "component", description: "Top section for title and description." },
  { prop: "DrawerTitle", type: "component", description: "Accessible title." },
  { prop: "DrawerDescription", type: "component", description: "Supporting description text." },
  { prop: "DrawerFooter", type: "component", description: "Bottom section with action buttons. Has top border." },
  { prop: "DrawerClose", type: "component", description: "Low-level close primitive for custom dismiss triggers." },
]

export default function DrawerPage() {
  return (
    <div className="space-y-16 pb-16">
      <div className="space-y-2">
        <h1 className="h1">Drawer</h1>
        <p className="p text-muted-foreground">
          A bottom sheet that slides up from the screen edge. Built on vaul with glass treatment
          on the top edge and a drag handle for touch interaction. Best for mobile-first
          interactions and short forms.
        </p>
      </div>

      {/* Basic */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Basic drawer</h2>
          <p className="p text-muted-foreground">
            Header, body content, and a footer with actions. The drag handle appears by default.
          </p>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">Open drawer</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Edit profile</DrawerTitle>
              <DrawerDescription>
                Make changes to your profile here. Click save when you&rsquo;re done.
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-6 py-4 space-y-3">
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Name</p>
                <div className="h-9 rounded-lg border border-border bg-background" />
              </div>
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Email</p>
                <div className="h-9 rounded-lg border border-border bg-background" />
              </div>
            </div>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </DrawerClose>
              <Button variant="primary" size="sm">Save changes</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </section>

      {/* No handle */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Without handle</h2>
          <p className="p text-muted-foreground">
            Set <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">showHandle=false</code> to
            hide the drag pill. The drawer can still be dismissed by dragging or clicking the overlay.
          </p>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">No handle</Button>
          </DrawerTrigger>
          <DrawerContent showHandle={false}>
            <DrawerHeader>
              <DrawerTitle>Confirmation</DrawerTitle>
              <DrawerDescription>
                Are you sure you want to proceed?
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter>
              <DrawerClose asChild>
                <Button variant="outline" size="sm">Cancel</Button>
              </DrawerClose>
              <Button variant="primary" size="sm">Confirm</Button>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </section>

      {/* Header only */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">With content only</h2>
          <p className="p text-muted-foreground">
            A drawer with just a header and inline content. Footer is optional.
          </p>
        </div>
        <Drawer>
          <DrawerTrigger asChild>
            <Button variant="outline" size="sm">View details</Button>
          </DrawerTrigger>
          <DrawerContent>
            <DrawerHeader>
              <DrawerTitle>Order #12345</DrawerTitle>
              <DrawerDescription>
                Placed on April 3, 2026
              </DrawerDescription>
            </DrawerHeader>
            <div className="px-6 py-4 space-y-2">
              {[
                ["Status", "Shipped"],
                ["Tracking", "1Z999AA10123456784"],
                ["Estimated delivery", "April 8, 2026"],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0">
                  <span className="p-sm text-muted-foreground">{label}</span>
                  <span className="label-sm">{value}</span>
                </div>
              ))}
            </div>
          </DrawerContent>
        </Drawer>
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="DrawerContent" rows={DRAWER_CONTENT_ROWS} />
        <PropTable title="Sub-components" rows={DRAWER_ANATOMY_ROWS} />
      </section>
    </div>
  )
}
