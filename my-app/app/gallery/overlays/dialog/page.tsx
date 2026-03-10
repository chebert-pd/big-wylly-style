"use client"

import { Button } from "@/components/ui/button"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"
import {
  Dialog,
  DialogAction,
  DialogCancel,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  ResponsiveDialog,
  ResponsiveDialogAction,
  ResponsiveDialogCancel,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@/components/ui/responsive-dialog"

const DIALOG_CONTENT_ROWS: PropRow[] = [
  { prop: "size", type: '"default" | "sm"', default: '"default"', description: 'Controls max-width. "default" = 32rem (lg), "sm" = 20rem (xs).' },
  { prop: "children", type: "ReactNode", required: true, description: "Dialog body. Use DialogHeader and DialogFooter for structured layout." },
  { prop: "className", type: "string", description: "Additional CSS classes applied to the content panel." },
]

const DIALOG_ANATOMY_ROWS: PropRow[] = [
  { prop: "Dialog", type: "component", description: "Root. Accepts all Radix Dialog.Root props (open, onOpenChange, defaultOpen, modal)." },
  { prop: "DialogTrigger", type: "component", description: "Element that opens the dialog. Use asChild to wrap your own button." },
  { prop: "DialogContent", type: "component", description: "The dialog panel. Renders the overlay, glass frame, and X close button automatically." },
  { prop: "DialogHeader", type: "component", description: "Optional top section. Wrap DialogTitle and DialogDescription inside." },
  { prop: "DialogTitle", type: "component", description: "Accessible dialog title. Required for screen readers." },
  { prop: "DialogDescription", type: "component", description: "Accessible supporting description. Optional but recommended." },
  { prop: "DialogFooter", type: "component", description: "Optional bottom section with edge-to-edge styling. Holds action buttons." },
  { prop: "DialogAction", type: "component", description: "Primary button in the footer. Closes the dialog on click." },
  { prop: "DialogCancel", type: "component", description: "Outline button in the footer. Closes the dialog on click. Only render when there is also a DialogAction." },
  { prop: "DialogClose", type: "component", description: "Low-level close primitive. Use when you need a custom dismiss trigger outside the footer." },
]

const RESPONSIVE_DIALOG_ROWS: PropRow[] = [
  { prop: "mobileVariant", type: '"drawer" | "sheet"', default: '"drawer"', description: '"drawer" — vaul drawer with glass-top treatment, natural height, drag-to-dismiss. "sheet" — full-viewport Sheet.' },
  { prop: "open", type: "boolean", description: "Controlled open state." },
  { prop: "onOpenChange", type: "(open: boolean) => void", description: "Called when the open state changes." },
]

const RESPONSIVE_DIALOG_ANATOMY_ROWS: PropRow[] = [
  { prop: "ResponsiveDialog", type: "component", description: "Root. Renders Dialog on ≥ 768px, Drawer or Sheet on < 768px. Accepts mobileVariant prop." },
  { prop: "ResponsiveDialogTrigger", type: "component", description: "Opens the dialog/drawer/sheet. Use asChild to wrap your own button." },
  { prop: "ResponsiveDialogContent", type: "component", description: "Panel. Renders DialogContent on desktop, DrawerContent or SheetContent on mobile." },
  { prop: "ResponsiveDialogHeader", type: "component", description: "Optional header section." },
  { prop: "ResponsiveDialogTitle", type: "component", description: "Accessible title. Required for screen readers." },
  { prop: "ResponsiveDialogDescription", type: "component", description: "Supporting muted text." },
  { prop: "ResponsiveDialogFooter", type: "component", description: "Optional footer with action buttons." },
  { prop: "ResponsiveDialogAction", type: "component", description: "Primary button. Closes on click." },
  { prop: "ResponsiveDialogCancel", type: "component", description: "Outline button. Closes on click. Only render alongside ResponsiveDialogAction." },
  { prop: "ResponsiveDialogClose", type: "component", description: "Low-level close primitive." },
]

export default function DialogPage() {
  return (
    <div className="space-y-16 pb-16">
      <div>
        <h2 className="h2 mb-1">Dialog</h2>
        <p className="p text-muted-foreground">
          A window that overlays the page for non-destructive interactions. Dismissible via the X
          button or clicking outside — use <strong>Alert Dialog</strong> instead when the action
          is irreversible.
        </p>
      </div>

      {/* Full anatomy */}
      <section className="space-y-4">
        <h3 className="h3">Full anatomy</h3>
        <p className="p-sm text-muted-foreground">
          Header, body content, and a two-button footer.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Open dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit merchant details</DialogTitle>
              <DialogDescription>
                Update the name and contact email for this merchant. Changes take effect immediately.
              </DialogDescription>
            </DialogHeader>

            {/* Body content placeholder */}
            <div className="space-y-3">
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Merchant name</p>
                <div className="h-9 rounded-[var(--radius)] border border-border bg-background" />
              </div>
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Contact email</p>
                <div className="h-9 rounded-[var(--radius)] border border-border bg-background" />
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
        <h3 className="h3">Single action</h3>
        <p className="p-sm text-muted-foreground">
          When there is only one action, render only <code>DialogAction</code> — no cancel button.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">View summary</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Payment processed</DialogTitle>
              <DialogDescription>
                The payment of $4,820.00 was successfully captured and sent to the merchant.
              </DialogDescription>
            </DialogHeader>

            <div className="rounded-lg bg-secondary border border-border-subtle px-4 py-3 space-y-1">
              <div className="flex justify-between">
                <span className="p-sm text-muted-foreground">Reference</span>
                <span className="label-sm">TXN-00284917</span>
              </div>
              <div className="flex justify-between">
                <span className="p-sm text-muted-foreground">Merchant</span>
                <span className="label-sm">Acme Corp</span>
              </div>
              <div className="flex justify-between">
                <span className="p-sm text-muted-foreground">Amount</span>
                <span className="label-sm">$4,820.00</span>
              </div>
            </div>

            <DialogFooter>
              <DialogAction>Done</DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Header only — no footer */}
      <section className="space-y-4">
        <h3 className="h3">Header only</h3>
        <p className="p-sm text-muted-foreground">
          Footer is optional. The X button is always present.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Open no-footer dialog</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Keyboard shortcuts</DialogTitle>
              <DialogDescription>
                Use these shortcuts to navigate the dashboard faster.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              {[
                ["⌘ K", "Open command palette"],
                ["⌘ /", "Search"],
                ["⌘ B", "Toggle sidebar"],
                ["⌘ .", "Expand panel"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between py-1.5 border-b border-border-subtle last:border-0">
                  <span className="p-sm text-muted-foreground">{label}</span>
                  <kbd className="label-sm rounded bg-secondary border border-border px-2 py-0.5 font-mono">{key}</kbd>
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </section>

      {/* No header */}
      <section className="space-y-4">
        <h3 className="h3">No header</h3>
        <p className="p-sm text-muted-foreground">
          Header is also optional. Useful for compact confirmations where the body is self-explanatory.
        </p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">Export data</Button>
          </DialogTrigger>
          <DialogContent size="sm">
            <p className="p text-muted-foreground">
              Export all transactions as a CSV file?
            </p>
            <DialogFooter>
              <DialogCancel>Cancel</DialogCancel>
              <DialogAction>Export</DialogAction>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </section>

      {/* Responsive — drawer */}
      <section className="space-y-4">
        <h3 className="h3">Responsive — drawer</h3>
        <p className="p-sm text-muted-foreground">
          On mobile the dialog becomes a vaul drawer: glass-top treatment, natural content height,
          and drag-to-dismiss. On desktop it behaves like a normal dialog.{" "}
          <code>mobileVariant=&quot;drawer&quot;</code> is the default.
        </p>
        <ResponsiveDialog mobileVariant="drawer">
          <ResponsiveDialogTrigger asChild>
            <Button variant="outline" size="sm">Edit payout schedule</Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Payout schedule</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Choose how often funds are transferred to your bank account.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <div className="space-y-2 px-6 py-4">
              {["Daily", "Weekly", "Monthly"].map((option) => (
                <div
                  key={option}
                  className="flex items-center justify-between rounded-lg border border-border px-4 py-3"
                >
                  <span className="p-sm">{option}</span>
                  <div className="size-4 rounded-full border-2 border-border" />
                </div>
              ))}
            </div>

            <ResponsiveDialogFooter>
              <ResponsiveDialogCancel>Cancel</ResponsiveDialogCancel>
              <ResponsiveDialogAction>Save</ResponsiveDialogAction>
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      </section>

      {/* Responsive — sheet */}
      <section className="space-y-4">
        <h3 className="h3">Responsive — sheet</h3>
        <p className="p-sm text-muted-foreground">
          Use <code>mobileVariant=&quot;sheet&quot;</code> when the task needs the full screen on
          mobile — e.g. multi-field forms. The Sheet covers the entire viewport.
        </p>
        <ResponsiveDialog mobileVariant="sheet">
          <ResponsiveDialogTrigger asChild>
            <Button variant="outline" size="sm">Add team member</Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Add team member</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Invite someone to join your workspace. They will receive an email with a sign-in link.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <div className="space-y-3 px-6 py-4">
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Full name</p>
                <div className="h-9 rounded-[var(--radius)] border border-border bg-background" />
              </div>
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Email address</p>
                <div className="h-9 rounded-[var(--radius)] border border-border bg-background" />
              </div>
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Role</p>
                <div className="h-9 rounded-[var(--radius)] border border-border bg-background" />
              </div>
            </div>

            <ResponsiveDialogFooter>
              <ResponsiveDialogCancel>Cancel</ResponsiveDialogCancel>
              <ResponsiveDialogAction>Send invite</ResponsiveDialogAction>
            </ResponsiveDialogFooter>
          </ResponsiveDialogContent>
        </ResponsiveDialog>
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="DialogContent props" rows={DIALOG_CONTENT_ROWS} />
        <PropTable title="Anatomy" rows={DIALOG_ANATOMY_ROWS} />
        <PropTable title="ResponsiveDialog props" rows={RESPONSIVE_DIALOG_ROWS} />
        <PropTable title="ResponsiveDialog anatomy" rows={RESPONSIVE_DIALOG_ANATOMY_ROWS} />
      </section>
    </div>
  )
}
