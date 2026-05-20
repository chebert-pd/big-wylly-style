"use client"

import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
  Switch,
} from "@big-wylly-style/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const SWITCH_ROWS: PropRow[] = [
  { prop: "checked", type: "boolean", description: "Controlled checked state." },
  { prop: "defaultChecked", type: "boolean", description: "Initial state when uncontrolled." },
  { prop: "onCheckedChange", type: "(checked: boolean) => void", description: "Fires when the state changes." },
  { prop: "disabled", type: "boolean", description: "Disables interaction." },
  { prop: "size", type: '"sm" | "default"', default: '"default"', description: "Track and thumb size." },
  { prop: "id", type: "string", description: "DOM id — pair with FieldLabel htmlFor for accessible labeling." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function SwitchPage() {
  const [notifications, setNotifications] = useState(true)

  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Switch</h1>
        <p className="p text-muted-foreground">
          For binary system settings with immediate effect. If the label reads
          as a sentence ("Enable notifications"), use Switch. For values that
          apply on form submit, use Checkbox.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="h2">Default</h2>
        <Field orientation="horizontal" className="max-w-md">
          <Switch
            id="notifications"
            checked={notifications}
            onCheckedChange={setNotifications}
          />
          <FieldLabel htmlFor="notifications">Enable email notifications</FieldLabel>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Sizes</h2>
        <div className="flex flex-wrap gap-8">
          <Field orientation="horizontal">
            <Switch id="size-default" defaultChecked />
            <FieldLabel htmlFor="size-default">Default</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Switch id="size-sm" size="sm" defaultChecked />
            <FieldLabel htmlFor="size-sm">Small</FieldLabel>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">States</h2>
        <div className="flex flex-wrap gap-8">
          <Field orientation="horizontal">
            <Switch id="state-off" />
            <FieldLabel htmlFor="state-off">Off</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Switch id="state-on" defaultChecked />
            <FieldLabel htmlFor="state-on">On</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Switch id="state-disabled-off" disabled />
            <FieldLabel htmlFor="state-disabled-off">Disabled & off</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Switch id="state-disabled-on" disabled defaultChecked />
            <FieldLabel htmlFor="state-disabled-on">Disabled & on</FieldLabel>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">With description</h2>
        <Field orientation="horizontal" className="max-w-md items-start">
          <Switch id="beta" defaultChecked />
          <div className="flex flex-col gap-1">
            <FieldLabel htmlFor="beta">Beta features</FieldLabel>
            <FieldDescription>
              Get early access. Things may change without notice.
            </FieldDescription>
          </div>
        </Field>
      </section>

      <PropTable rows={SWITCH_ROWS} />
    </div>
  )
}
