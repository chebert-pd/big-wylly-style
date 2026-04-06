"use client"

import {
  Toaster,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@wyllo/ui"
import { toast } from "sonner"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const TOASTER_ROWS: PropRow[] = [
  {
    prop: "theme",
    type: '"light" | "dark" | "system"',
    default: '"system"',
    description:
      "Color theme for the toasts. System follows the user's OS preference.",
  },
  {
    prop: "position",
    type: '"top-left" | "top-center" | "top-right" | "bottom-left" | "bottom-center" | "bottom-right"',
    default: '"bottom-right"',
    description: "Where toasts appear on screen.",
  },
  {
    prop: "expand",
    type: "boolean",
    default: "false",
    description: "Whether toasts are expanded by default.",
  },
  {
    prop: "richColors",
    type: "boolean",
    default: "false",
    description:
      "Enables richer, more prominent colors for success, error, warning, and info toasts.",
  },
  {
    prop: "duration",
    type: "number",
    default: "4000",
    description: "Default duration in ms before a toast auto-dismisses.",
  },
  {
    prop: "closeButton",
    type: "boolean",
    default: "false",
    description: "Shows a close button on each toast.",
  },
]

const TOAST_FN_ROWS: PropRow[] = [
  {
    prop: "toast(message)",
    type: "(message: string) => void",
    description: "Shows a default toast notification.",
  },
  {
    prop: "toast.success(message)",
    type: "(message: string) => void",
    description: "Shows a success toast with a green accent.",
  },
  {
    prop: "toast.error(message)",
    type: "(message: string) => void",
    description: "Shows an error toast with a red accent.",
  },
  {
    prop: "toast.warning(message)",
    type: "(message: string) => void",
    description: "Shows a warning toast with a yellow accent.",
  },
  {
    prop: "toast.info(message)",
    type: "(message: string) => void",
    description: "Shows an informational toast with a blue accent.",
  },
  {
    prop: "toast.promise(promise, opts)",
    type: "(promise: Promise, opts: object) => void",
    description:
      "Tracks a promise and shows loading, success, and error states automatically.",
  },
]

export default function ToastPage() {
  return (
    <div className="space-y-16">
      <Toaster />

      {/* Header */}
      <div className="space-y-2">
        <h1 className="h1">Toast</h1>
        <p className="p text-muted-foreground">
          Ephemeral notifications displayed at the edge of the viewport. Uses{" "}
          <code className="font-mono p-sm">sonner</code> under the hood with a
          themed <code className="font-mono p-sm">Toaster</code> wrapper from
          the design system.
        </p>
      </div>

      {/* Examples */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Default */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Default Toast</CardTitle>
            <CardDescription>
              A simple text notification with automatic dismiss.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => toast("Event has been created.")}
            >
              Show Toast
            </Button>
          </CardContent>
        </Card>

        {/* Success */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Success</CardTitle>
            <CardDescription>
              Confirmation that an action completed successfully.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => toast.success("Changes saved successfully.")}
            >
              Show Success
            </Button>
          </CardContent>
        </Card>

        {/* Error */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Error</CardTitle>
            <CardDescription>
              Alerts the user to a failed operation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => toast.error("Something went wrong.")}
            >
              Show Error
            </Button>
          </CardContent>
        </Card>

        {/* Warning */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Warning</CardTitle>
            <CardDescription>
              Cautionary notification for non-blocking issues.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() =>
                toast.warning("Your session will expire in 5 minutes.")
              }
            >
              Show Warning
            </Button>
          </CardContent>
        </Card>

        {/* Info */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Info</CardTitle>
            <CardDescription>
              Informational message that does not require action.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() => toast.info("A new version is available.")}
            >
              Show Info
            </Button>
          </CardContent>
        </Card>

        {/* With description */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">With Description</CardTitle>
            <CardDescription>
              Toast with a title and additional description text.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() =>
                toast("Event Created", {
                  description: "Monday, January 3rd at 6:00 PM",
                })
              }
            >
              Show with Description
            </Button>
          </CardContent>
        </Card>

        {/* With action */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">With Action</CardTitle>
            <CardDescription>
              Toast with an inline action button.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() =>
                toast("File deleted", {
                  action: {
                    label: "Undo",
                    onClick: () => toast.success("File restored."),
                  },
                })
              }
            >
              Show with Action
            </Button>
          </CardContent>
        </Card>

        {/* Promise */}
        <Card level={1}>
          <CardHeader>
            <CardTitle className="label-md">Promise</CardTitle>
            <CardDescription>
              Tracks a promise through loading, success, and error states.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              variant="outline"
              onClick={() =>
                toast.promise(
                  new Promise<string>((resolve) =>
                    setTimeout(() => resolve("Data loaded"), 2000)
                  ),
                  {
                    loading: "Loading data...",
                    success: (data: string) => data,
                    error: "Failed to load data.",
                  }
                )
              }
            >
              Show Promise Toast
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* API Reference */}
      <section className="space-y-6">
        <h2 className="h2">API Reference</h2>
        <PropTable title="Toaster" rows={TOASTER_ROWS} />
        <PropTable title="toast() function" rows={TOAST_FN_ROWS} />
      </section>
    </div>
  )
}
