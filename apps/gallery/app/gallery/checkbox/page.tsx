"use client"

import { useState } from "react"
import {
  Checkbox,
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const CHECKBOX_ROWS: PropRow[] = [
  { prop: "checked", type: 'boolean | "indeterminate"', description: "Controlled checked state. Pass \"indeterminate\" for partial-selection rows like a select-all parent." },
  { prop: "defaultChecked", type: "boolean", description: "Initial checked state when uncontrolled." },
  { prop: "onCheckedChange", type: "(checked: boolean | \"indeterminate\") => void", description: "Fires when the checked state changes." },
  { prop: "disabled", type: "boolean", description: "Disables the checkbox." },
  { prop: "id", type: "string", description: "DOM id — pair with FieldLabel htmlFor for accessible labeling." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function CheckboxPage() {
  const [selectAll, setSelectAll] = useState<boolean | "indeterminate">("indeterminate")
  const [items, setItems] = useState({ orders: true, returns: false, chargebacks: true })

  function setItem(key: keyof typeof items, value: boolean) {
    setItems((prev) => {
      const next = { ...prev, [key]: value }
      const all = Object.values(next)
      setSelectAll(all.every(Boolean) ? true : all.some(Boolean) ? "indeterminate" : false)
      return next
    })
  }

  function setAll(value: boolean | "indeterminate") {
    const resolved = value === true
    setSelectAll(value)
    setItems({ orders: resolved, returns: resolved, chargebacks: resolved })
  }

  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Checkbox</h1>
        <p className="p text-muted-foreground">
          For independent boolean selections. Does not imply immediate effect —
          changes apply on form submission. For system on/off toggles, use
          Switch instead.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="h2">Single checkbox</h2>
        <Field orientation="horizontal" className="max-w-md">
          <Checkbox id="terms" />
          <FieldLabel htmlFor="terms">I agree to the terms of service</FieldLabel>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">States</h2>
        <div className="flex flex-wrap gap-8">
          <Field orientation="horizontal">
            <Checkbox id="state-unchecked" />
            <FieldLabel htmlFor="state-unchecked">Unchecked</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="state-checked" defaultChecked />
            <FieldLabel htmlFor="state-checked">Checked</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="state-indeterminate" checked="indeterminate" onCheckedChange={() => {}} />
            <FieldLabel htmlFor="state-indeterminate">Indeterminate</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="state-disabled" disabled />
            <FieldLabel htmlFor="state-disabled">Disabled</FieldLabel>
          </Field>

          <Field orientation="horizontal">
            <Checkbox id="state-disabled-checked" disabled defaultChecked />
            <FieldLabel htmlFor="state-disabled-checked">Disabled & checked</FieldLabel>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Group with select-all</h2>
        <FieldSet className="max-w-md">
          <FieldLegend variant="label">Screening products</FieldLegend>
          <FieldDescription>Choose which feeds run through Wyllo screening.</FieldDescription>

          <Field orientation="horizontal" className="pt-2 border-b border-border-subtle pb-2">
            <Checkbox id="all" checked={selectAll} onCheckedChange={setAll} />
            <FieldLabel htmlFor="all">All products</FieldLabel>
          </Field>

          <div className="flex flex-col gap-2 pl-6">
            <Field orientation="horizontal">
              <Checkbox
                id="g-orders"
                checked={items.orders}
                onCheckedChange={(v) => setItem("orders", v === true)}
              />
              <FieldLabel htmlFor="g-orders">Orders</FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="g-returns"
                checked={items.returns}
                onCheckedChange={(v) => setItem("returns", v === true)}
              />
              <FieldLabel htmlFor="g-returns">Returns</FieldLabel>
            </Field>

            <Field orientation="horizontal">
              <Checkbox
                id="g-chargebacks"
                checked={items.chargebacks}
                onCheckedChange={(v) => setItem("chargebacks", v === true)}
              />
              <FieldLabel htmlFor="g-chargebacks">Chargebacks</FieldLabel>
            </Field>
          </div>
        </FieldSet>
      </section>

      <PropTable rows={CHECKBOX_ROWS} />
    </div>
  )
}
