"use client"

import {
  Button,
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const DIALOG_CONTENT_ROWS: PropRow[] = [
  { prop: "size", type: '"default" | "sm"', default: '"default"', description: 'Controls max-width. "default" = 32rem (lg), "sm" = 20rem (xs).' },
  { prop: "children", type: "ReactNode", required: true, description: "Dialog body." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

const DIALOG_ANATOMY_ROWS: PropRow[] = [
  { prop: "Dialog", type: "component", description: "Root. Accepts open, onOpenChange, defaultOpen, modal." },
  { prop: "DialogTrigger", type: "component", description: "Element that opens the dialog. Use asChild to wrap your own button." },
  { prop: "DialogContent", type: "component", description: "The dialog panel. Renders overlay, glass frame, and X close button." },
  { prop: "DialogHeader", type: "component", description: "Optional top section for title and description." },
  { prop: "DialogTitle", type: "component", description: "Accessible dialog title." },
  { prop: "DialogDescription", type: "component", description: "Supporting description text." },
  { prop: "DialogFooter", type: "component", description: "Optional bottom section with action buttons." },
  { prop: "DialogAction", type: "component", description: "Primary button. Closes on click." },
  { prop: "DialogCancel", type: "component", description: "Outline button. Closes on click." },
  { prop: "DialogClose", type: "component", description: "Low-level close primitive for custom dismiss triggers." },
]

export default function DialogPage() {
  return (
    <div className="space-y-16 pb-16">
      <div className="space-y-2">
        <h1 className="h1">Dialog</h1>
        <p className="p text-muted-foreground">
          A window that overlays the page for non-destructive interactions. Dismissible via X
          or clicking outside. For irreversible actions, use{" "}
          <a href="/gallery/overlays/dialog/alert" className="link">Alert Dialog</a> instead.
          For responsive mobile behavior, see{" "}
          <a href="/gallery/overlays/dialog/responsive" className="link">Responsive Dialog</a>.
        </p>
      </div>

      {/* Full anatomy */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Full anatomy</h2>
          <p className="p text-muted-foreground">Header, body content, and a two-button footer.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit merchant details</DialogTitle>
              <DialogDescription>
                Update the name and contact email for this merchant.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Merchant name</p>
                <div className="h-9 rounded-lg border border-border bg-background" />
              </div>
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Contact email</p>
                <div className="h-9 rounded-lg border border-border bg-background" />
              </div>
            </div>
            <DialogFooter>
              <DialogCancel>Cancel</DialogCancel>
              <DialogAction>Save changes</DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Single action */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Single action</h2>
          <p className="p text-muted-foreground">When there is only one action, omit the cancel button.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">View summary</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment processed</DialogTitle>
              <DialogDescription>
                The payment of $4,820.00 was successfully captured.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogAction>Done</DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* No footer */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Header only</h2>
          <p className="p text-muted-foreground">Footer is optional. The X button is always present.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Open</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard shortcuts</DialogTitle>
              <DialogDescription>Navigate the dashboard faster.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              {[["⌘ K", "Command palette"], ["⌘ /", "Search"], ["⌘ B", "Toggle sidebar"]].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0">
                  <span className="p-sm text-muted-foreground">{label}</span>
                  <kbd className="label-sm rounded bg-secondary border border-border px-2 py-0.5 font-mono">{key}</kbd>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* Small size */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Small size</h2>
          <p className="p text-muted-foreground">Compact dialog for simple confirmations.</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Export data</Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <p className="p text-muted-foreground">Export all transactions as a CSV file?</p>
            <DialogFooter>
              <DialogCancel>Cancel</DialogCancel>
              <DialogAction>Export</DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="DialogContent" rows={DIALOG_CONTENT_ROWS} />
        <PropTable title="Sub-components" rows={DIALOG_ANATOMY_ROWS} />
      </section>
    </div>
  )
}
