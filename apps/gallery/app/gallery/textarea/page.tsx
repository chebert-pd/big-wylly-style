"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Textarea,
} from "@big-wylly-style/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const TEXTAREA_ROWS: PropRow[] = [
  { prop: "placeholder", type: "string", description: "Placeholder text shown when the textarea is empty." },
  { prop: "defaultValue", type: "string", description: "Initial value when uncontrolled." },
  { prop: "rows", type: "number", description: "Initial row height. Textarea auto-grows past this via field-sizing-content." },
  { prop: "disabled", type: "boolean", description: "Disables input and applies reduced-opacity styling." },
  { prop: "aria-invalid", type: "boolean", description: "Marks the textarea as invalid — applies the destructive border + ring treatment." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function TextareaPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Textarea</h1>
        <p className="p text-muted-foreground">
          Multi-line freeform text. Auto-grows from a 64px minimum as the user
          types. Always wrap in a Field for form semantics. For single-line
          values use Input.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="h2">Default</h2>
        <div className="max-w-md">
          <Field>
            <FieldLabel htmlFor="ta-default">Description</FieldLabel>
            <FieldContent>
              <Textarea
                id="ta-default"
                placeholder="Tell us what this rule does and when it should fire."
              />
            </FieldContent>
            <FieldDescription>
              Visible to other admins. Supports up to 500 characters.
            </FieldDescription>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">States</h2>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel htmlFor="ta-filled">Filled</FieldLabel>
            <FieldContent>
              <Textarea
                id="ta-filled"
                defaultValue="Block orders shipping to PO boxes when the order total exceeds $500."
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="ta-disabled">Disabled</FieldLabel>
            <FieldContent>
              <Textarea
                id="ta-disabled"
                disabled
                defaultValue="This rule is managed by the platform team."
              />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="ta-invalid">Invalid</FieldLabel>
            <FieldContent>
              <Textarea
                id="ta-invalid"
                aria-invalid
                defaultValue=""
                placeholder="Required"
              />
            </FieldContent>
            <FieldError>This field is required.</FieldError>
          </Field>
        </div>
      </section>

      <PropTable rows={TEXTAREA_ROWS} />
    </div>
  )
}
