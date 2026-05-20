"use client"

import { useState } from "react"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxCollection,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  useComboboxAnchor,
} from "@big-wylly-style/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const INDUSTRY_OPTIONS = [
  { label: "Retail", value: "retail" },
  { label: "Digital Goods", value: "digital-goods" },
  { label: "SaaS", value: "saas" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Subscription Services", value: "subscription" },
  { label: "Travel & Hospitality", value: "travel" },
  { label: "Food & Beverage", value: "food-beverage" },
  { label: "Health & Beauty", value: "health-beauty" },
  { label: "Financial Services", value: "financial" },
  { label: "Education", value: "education" },
  { label: "Gaming", value: "gaming" },
  { label: "Media & Entertainment", value: "media" },
  { label: "Automotive", value: "automotive" },
  { label: "Nonprofit", value: "nonprofit" },
  { label: "Other", value: "other" },
]

const TAG_OPTIONS = [
  { label: "Fraud", value: "fraud" },
  { label: "Refund", value: "refund" },
  { label: "Chargeback", value: "chargeback" },
  { label: "VIP", value: "vip" },
  { label: "New customer", value: "new-customer" },
  { label: "Returning", value: "returning" },
  { label: "Wholesale", value: "wholesale" },
  { label: "Subscription", value: "subscription-tag" },
]

const COMBOBOX_ROWS: PropRow[] = [
  { prop: "options", type: "{ label: string; value: string }[]", description: "Simple-mode options. For chip/multi layouts, use the composed sub-components (ComboboxChips, ComboboxChip, ComboboxChipsInput) instead." },
  { prop: "value", type: "string | string[]", description: "Controlled value. String for single, string[] for multi." },
  { prop: "defaultValue", type: "string | string[]", description: "Initial value when uncontrolled." },
  { prop: "onValueChange", type: "(value: string | string[]) => void", description: "Fires when the selection changes." },
  { prop: "multiple", type: "boolean", description: "Allow multiple selections. With composed chips, renders selected values as removable chips." },
  { prop: "placeholder", type: "string", description: "Trigger placeholder when nothing is selected." },
  { prop: "disabled", type: "boolean", description: "Disables the control. Propagated to the underlying input + trigger." },
  { prop: "aria-invalid", type: "boolean", description: "Marks the control as invalid. Renders the destructive ring/border on the field shell and turns the FieldLabel destructive." },
  { prop: "className", type: "string", description: "Additional CSS classes on the input shell." },
]

export default function ComboboxPage() {
  const tagAnchor = useComboboxAnchor()
  const [tags, setTags] = useState<string[]>(["vip"])

  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Combobox</h1>
        <p className="p text-muted-foreground">
          Search and select from a large or dynamic list. Use when discovery
          matters more than recognition. For short, recognizable lists, use
          Select.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="h2">Single select</h2>
        <Field className="max-w-md">
          <FieldLabel htmlFor="industry">Industry</FieldLabel>
          <FieldContent>
            <Combobox
              options={INDUSTRY_OPTIONS}
              placeholder="Search industries"
              className="w-full"
            />
          </FieldContent>
          <FieldDescription>15 industries. Start typing to filter.</FieldDescription>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Multi-select with chips</h2>
        <p className="p text-muted-foreground">
          Composed mode using <code>ComboboxChips</code>, <code>ComboboxChipsInput</code>,
          and a content anchor. Selected tags render as removable chips inside the field.
        </p>
        <Field className="max-w-md">
          <FieldLabel htmlFor="tags">Tags</FieldLabel>
          <FieldContent>
            <Combobox
              multiple
              items={TAG_OPTIONS}
              itemToStringLabel={(item) => (item as { label: string }).label}
              value={tags}
              onValueChange={(v) => setTags(Array.isArray(v) ? v : [v])}
            >
              <ComboboxChips ref={tagAnchor}>
                <ComboboxValue>
                  {(values: string[]) =>
                    values.map((v) => (
                      <ComboboxChip key={v}>
                        {TAG_OPTIONS.find((o) => o.value === v)?.label ?? v}
                      </ComboboxChip>
                    ))
                  }
                </ComboboxValue>
                <ComboboxChipsInput id="tags" placeholder="Add tags" />
              </ComboboxChips>
              <ComboboxContent anchor={tagAnchor}>
                <ComboboxList>
                  <ComboboxCollection>
                    {(option: { label: string; value: string }) => (
                      <ComboboxItem key={option.value} value={option.value}>
                        {option.label}
                      </ComboboxItem>
                    )}
                  </ComboboxCollection>
                </ComboboxList>
              </ComboboxContent>
            </Combobox>
          </FieldContent>
          <FieldDescription>Selected tags appear as removable chips inside the field.</FieldDescription>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">States</h2>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel htmlFor="state-disabled">Disabled</FieldLabel>
            <FieldContent>
              <Combobox
                disabled
                options={INDUSTRY_OPTIONS}
                placeholder="Locked"
                className="w-full"
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="state-invalid">Invalid</FieldLabel>
            <FieldContent>
              <Combobox
                aria-invalid
                options={INDUSTRY_OPTIONS}
                placeholder="Required"
                className="w-full"
              />
            </FieldContent>
            <FieldError>Select an industry to continue.</FieldError>
          </Field>
        </div>
      </section>

      <PropTable rows={COMBOBOX_ROWS} />
    </div>
  )
}
