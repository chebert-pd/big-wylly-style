"use client"

import {
  Button,
  ResponsiveDialog,
  ResponsiveDialogAction,
  ResponsiveDialogCancel,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogFooter,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogTrigger,
} from "@wyllo/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const RESPONSIVE_DIALOG_ROWS: PropRow[] = [
  { prop: "mobileVariant", type: '"drawer" | "sheet"', default: '"drawer"', description: '"drawer" — vaul drawer with glass-top, natural height, drag-to-dismiss. "sheet" — full-viewport Sheet.' },
  { prop: "open", type: "boolean", description: "Controlled open state." },
  { prop: "onOpenChange", type: "(open: boolean) => void", description: "Called when the open state changes." },
]

const RESPONSIVE_ANATOMY_ROWS: PropRow[] = [
  { prop: "ResponsiveDialog", type: "component", description: "Root. Renders Dialog on desktop (≥ 768px), Drawer or Sheet on mobile." },
  { prop: "ResponsiveDialogTrigger", type: "component", description: "Opens the dialog. Use asChild." },
  { prop: "ResponsiveDialogContent", type: "component", description: "Panel. DialogContent on desktop, DrawerContent or SheetContent on mobile." },
  { prop: "ResponsiveDialogHeader", type: "component", description: "Header section." },
  { prop: "ResponsiveDialogTitle", type: "component", description: "Accessible title." },
  { prop: "ResponsiveDialogDescription", type: "component", description: "Supporting description text." },
  { prop: "ResponsiveDialogFooter", type: "component", description: "Footer with action buttons." },
  { prop: "ResponsiveDialogAction", type: "component", description: "Primary button. Closes on click." },
  { prop: "ResponsiveDialogCancel", type: "component", description: "Outline button. Closes on click." },
  { prop: "ResponsiveDialogClose", type: "component", description: "Low-level close primitive." },
]

export default function ResponsiveDialogPage() {
  return (
    <div className="space-y-16 pb-16">
      <div className="space-y-2">
        <h1 className="h1">Responsive Dialog</h1>
        <p className="p text-muted-foreground">
          A dialog that adapts to screen size. On desktop it renders as a centered Dialog.
          On mobile it becomes either a bottom drawer (default) or a full-screen sheet.
        </p>
      </div>

      {/* Drawer variant */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Drawer variant (default)</h2>
          <p className="p text-muted-foreground">
            On mobile, the dialog becomes a vaul drawer with glass-top treatment, natural content
            height, and drag-to-dismiss. Best for short interactions.
          </p>
        </div>
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

      {/* Sheet variant */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Sheet variant</h2>
          <p className="p text-muted-foreground">
            Use <code className="text-xs font-mono bg-secondary px-1.5 py-0.5 rounded border border-border-subtle">mobileVariant=&quot;sheet&quot;</code> when
            the task needs the full screen on mobile — multi-field forms, detailed views, etc.
          </p>
        </div>
        <ResponsiveDialog mobileVariant="sheet">
          <ResponsiveDialogTrigger asChild>
            <Button variant="outline" size="sm">Add team member</Button>
          </ResponsiveDialogTrigger>
          <ResponsiveDialogContent>
            <ResponsiveDialogHeader>
              <ResponsiveDialogTitle>Add team member</ResponsiveDialogTitle>
              <ResponsiveDialogDescription>
                Invite someone to join your workspace.
              </ResponsiveDialogDescription>
            </ResponsiveDialogHeader>

            <div className="space-y-3 px-6 py-4">
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Full name</p>
                <div className="h-9 rounded-lg border border-border bg-background" />
              </div>
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Email address</p>
                <div className="h-9 rounded-lg border border-border bg-background" />
              </div>
              <div className="space-y-1">
                <p className="label-sm text-muted-foreground">Role</p>
                <div className="h-9 rounded-lg border border-border bg-background" />
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
        <PropTable title="ResponsiveDialog" rows={RESPONSIVE_DIALOG_ROWS} />
        <PropTable title="Sub-components" rows={RESPONSIVE_ANATOMY_ROWS} />
      </section>
    </div>
  )
}
