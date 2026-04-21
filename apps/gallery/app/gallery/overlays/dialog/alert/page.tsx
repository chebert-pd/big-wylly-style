"use client"

import {
  Button,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  ResponsiveAlertDialog,
  ResponsiveAlertDialogAction,
  ResponsiveAlertDialogCancel,
  ResponsiveAlertDialogContent,
  ResponsiveAlertDialogDescription,
  ResponsiveAlertDialogFooter,
  ResponsiveAlertDialogHeader,
  ResponsiveAlertDialogTitle,
  ResponsiveAlertDialogTrigger,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const ALERT_DIALOG_ROWS: PropRow[] = [
  { prop: "AlertDialog", type: "component", description: "Root. Same API as Dialog but cannot be dismissed by clicking outside or pressing Escape." },
  { prop: "AlertDialogTrigger", type: "component", description: "Element that opens the alert dialog. Use asChild." },
  { prop: "AlertDialogContent", type: "component", description: "The dialog panel. No X close button — user must choose an action." },
  { prop: "AlertDialogHeader", type: "component", description: "Top section for title and description." },
  { prop: "AlertDialogTitle", type: "component", description: "Accessible title. Required." },
  { prop: "AlertDialogDescription", type: "component", description: "Explains the consequences of the action." },
  { prop: "AlertDialogMedia", type: "component", description: "Optional media slot (icon or illustration) above the header." },
  { prop: "AlertDialogFooter", type: "component", description: "Bottom section with action buttons." },
  { prop: "AlertDialogAction", type: "component", description: "Confirming button. Closes the dialog." },
  { prop: "AlertDialogCancel", type: "component", description: "Cancelling button. Closes the dialog." },
]

const RESPONSIVE_ALERT_ROWS: PropRow[] = [
  { prop: "ResponsiveAlertDialog", type: "component", description: "Root. Renders AlertDialog on desktop, Drawer on mobile." },
  { prop: "ResponsiveAlertDialogTrigger", type: "component", description: "Opens the alert dialog/drawer." },
  { prop: "ResponsiveAlertDialogContent", type: "component", description: "Panel. AlertDialogContent on desktop, DrawerContent on mobile." },
  { prop: "ResponsiveAlertDialogHeader", type: "component", description: "Header section." },
  { prop: "ResponsiveAlertDialogTitle", type: "component", description: "Accessible title." },
  { prop: "ResponsiveAlertDialogDescription", type: "component", description: "Description text." },
  { prop: "ResponsiveAlertDialogMedia", type: "component", description: "Optional media slot." },
  { prop: "ResponsiveAlertDialogFooter", type: "component", description: "Footer with action buttons." },
  { prop: "ResponsiveAlertDialogAction", type: "component", description: "Confirming button." },
  { prop: "ResponsiveAlertDialogCancel", type: "component", description: "Cancelling button." },
]

export default function AlertDialogPage() {
  return (
    <div className="space-y-16 pb-16">
      <div className="space-y-2">
        <h1 className="h1">Alert Dialog</h1>
        <p className="p text-muted-foreground">
          A modal dialog for irreversible or destructive actions. Unlike Dialog, it cannot be
          dismissed by clicking outside or pressing Escape — the user must explicitly choose an action.
        </p>
      </div>

      {/* Basic destructive */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Destructive confirmation</h2>
          <p className="p text-muted-foreground">The most common use case — confirming a deletion or irreversible action.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">Delete account</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete account?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your account and all associated data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* Non-destructive confirmation */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Non-destructive confirmation</h2>
          <p className="p text-muted-foreground">Alert dialogs aren&rsquo;t only for destructive actions — use them for any action that should require explicit confirmation.</p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm">Submit for review</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Submit for review?</AlertDialogTitle>
              <AlertDialogDescription>
                Once submitted, you won&rsquo;t be able to edit this policy until the review is complete.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction>Submit</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </section>

      {/* Responsive */}
      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="h2">Responsive Alert Dialog</h2>
          <p className="p text-muted-foreground">
            On mobile, renders as a bottom drawer instead of a centered dialog. Same blocking behavior — the user must choose an action.
          </p>
        </div>
        <ResponsiveAlertDialog>
          <ResponsiveAlertDialogTrigger asChild>
            <Button variant="outline" size="sm">Revoke access</Button>
          </ResponsiveAlertDialogTrigger>
          <ResponsiveAlertDialogContent>
            <ResponsiveAlertDialogHeader>
              <ResponsiveAlertDialogTitle>Revoke access?</ResponsiveAlertDialogTitle>
              <ResponsiveAlertDialogDescription>
                This team member will immediately lose access to all resources.
              </ResponsiveAlertDialogDescription>
            </ResponsiveAlertDialogHeader>
            <ResponsiveAlertDialogFooter>
              <ResponsiveAlertDialogCancel>Cancel</ResponsiveAlertDialogCancel>
              <ResponsiveAlertDialogAction variant="destructive">Revoke</ResponsiveAlertDialogAction>
            </ResponsiveAlertDialogFooter>
          </ResponsiveAlertDialogContent>
        </ResponsiveAlertDialog>
      </section>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="AlertDialog" rows={ALERT_DIALOG_ROWS} />
        <PropTable title="ResponsiveAlertDialog" rows={RESPONSIVE_ALERT_ROWS} />
      </section>
    </div>
  )
}
