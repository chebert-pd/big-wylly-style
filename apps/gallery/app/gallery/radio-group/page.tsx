"use client"

import { useState } from "react"
import {
  Field,
  FieldDescription,
  FieldLabel,
  FieldLegend,
  FieldSet,
  RadioGroup,
  RadioGroupItem,
} from "@big-wylly-style/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const RADIO_GROUP_ROWS: PropRow[] = [
  { prop: "value", type: "string", description: "Controlled active value." },
  { prop: "defaultValue", type: "string", description: "Initial value when uncontrolled." },
  { prop: "onValueChange", type: "(value: string) => void", description: "Fires when the selection changes." },
  { prop: "disabled", type: "boolean", description: "Disables every item in the group." },
  { prop: "name", type: "string", description: "Form field name shared across items in the group." },
  { prop: "className", type: "string", description: "Additional CSS classes on the root container." },
]

const RADIO_GROUP_ITEM_ROWS: PropRow[] = [
  { prop: "value", type: "string", required: true, description: "Unique identifier for the item within the group." },
  { prop: "id", type: "string", description: "DOM id — pair with FieldLabel htmlFor for accessible labeling." },
  { prop: "disabled", type: "boolean", description: "Disables this specific item." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function RadioGroupPage() {
  const [plan, setPlan] = useState("starter")

  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Radio Group</h1>
        <p className="p text-muted-foreground">
          Exactly one option from a small visible set. For more than 5-6
          options use Select. For binary on/off use Switch. For
          comparison-heavy options with descriptions, use ChoiceCard.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="h2">Vertical</h2>
        <FieldSet className="max-w-md">
          <FieldLegend variant="label">Plan</FieldLegend>
          <FieldDescription>Pick the tier that fits your team today. You can upgrade later.</FieldDescription>
          <RadioGroup value={plan} onValueChange={setPlan}>
            <Field orientation="horizontal">
              <RadioGroupItem value="starter" id="plan-starter" />
              <FieldLabel htmlFor="plan-starter">Starter</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="pro" id="plan-pro" />
              <FieldLabel htmlFor="plan-pro">Pro</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="enterprise" id="plan-enterprise" />
              <FieldLabel htmlFor="plan-enterprise">Enterprise</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Horizontal</h2>
        <FieldSet className="max-w-md">
          <FieldLegend variant="label">Risk threshold</FieldLegend>
          <RadioGroup defaultValue="medium" className="flex flex-row gap-6">
            <Field orientation="horizontal">
              <RadioGroupItem value="low" id="risk-low" />
              <FieldLabel htmlFor="risk-low">Low</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="medium" id="risk-medium" />
              <FieldLabel htmlFor="risk-medium">Medium</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="high" id="risk-high" />
              <FieldLabel htmlFor="risk-high">High</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      </section>

      <section className="space-y-4">
        <h2 className="h2">States</h2>
        <FieldSet className="max-w-md">
          <FieldLegend variant="label">Status</FieldLegend>
          <RadioGroup defaultValue="active">
            <Field orientation="horizontal">
              <RadioGroupItem value="active" id="status-active" />
              <FieldLabel htmlFor="status-active">Active (selected)</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="archived" id="status-archived" />
              <FieldLabel htmlFor="status-archived">Archived</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="legacy" id="status-legacy" disabled />
              <FieldLabel htmlFor="status-legacy">Legacy (disabled)</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <RadioGroupItem value="locked" id="status-locked" disabled />
              <FieldLabel htmlFor="status-locked">Locked & selected (disabled)</FieldLabel>
            </Field>
          </RadioGroup>
        </FieldSet>
      </section>

      <PropTable title="RadioGroup" rows={RADIO_GROUP_ROWS} />
      <PropTable title="RadioGroupItem" rows={RADIO_GROUP_ITEM_ROWS} />
    </div>
  )
}
