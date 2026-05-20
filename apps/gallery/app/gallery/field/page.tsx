"use client"

import {
  Checkbox,
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldSeparator,
  Input,
} from "@big-wylly-style/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const FIELD_ROWS: PropRow[] = [
  { prop: "orientation", type: '"vertical" | "horizontal" | "responsive"', default: '"vertical"', description: "Layout direction of label and input. Responsive switches from vertical to horizontal at the container breakpoint." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
  { prop: "children", type: "ReactNode", description: "Field sub-components (FieldLabel, FieldContent, Input, FieldError, etc.)." },
]

const FIELD_SUB_ROWS: PropRow[] = [
  { prop: "FieldLabel", type: "component", description: "Renders a <Label> for the field. Accepts all Label props including htmlFor." },
  { prop: "FieldContent", type: "component", description: "Wrapper for the input and helper text area. Provides flex-col layout with gap." },
  { prop: "FieldDescription", type: "component", description: "Help text rendered below the label or input. Renders a <p> with muted styling." },
  { prop: "FieldError", type: "component", description: "Validation error display. Props: errors (Array<{ message?: string }>), or pass children directly." },
  { prop: "FieldTitle", type: "component", description: "Bold title text for card-style fields. Renders a <div> with label-md styling." },
  { prop: "FieldGroup", type: "component", description: "Groups related Field components with consistent vertical spacing." },
  { prop: "FieldSet", type: "component", description: "Semantic <fieldset> wrapper with vertical spacing for grouped fields." },
  { prop: "FieldLegend", type: "component", description: "Legend for a FieldSet. Props: variant ('legend' | 'label', default 'legend')." },
  { prop: "FieldSeparator", type: "component", description: "Horizontal rule between fields. Accepts optional children for an inline label." },
]

export default function FieldPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Field</h1>
        <p className="p text-muted-foreground">
          The wrapper system every form control composes into. Field provides
          the label, description, error slot, and layout — the input primitive
          handles only typing and focus. Wrap Input, Textarea, Select, Checkbox,
          Switch, RadioGroup, and Combobox in a Field for every usage.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="h2">Single Field</h2>
        <Field className="max-w-md">
          <FieldLabel htmlFor="single-name">Workspace name</FieldLabel>
          <FieldContent>
            <Input id="single-name" placeholder="Acme Co." />
          </FieldContent>
          <FieldDescription>Visible to teammates in the org switcher.</FieldDescription>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Field with error</h2>
        <Field className="max-w-md">
          <FieldLabel htmlFor="err-email">Email</FieldLabel>
          <FieldContent>
            <Input id="err-email" defaultValue="not-an-email" aria-invalid />
          </FieldContent>
          <FieldError>Enter a valid email address.</FieldError>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Horizontal orientation</h2>
        <p className="p text-muted-foreground">
          Inline label-input pairs. Use for compact rows like a settings list.
        </p>
        <Field orientation="horizontal" className="max-w-md">
          <FieldLabel htmlFor="h-name">Name</FieldLabel>
          <FieldContent>
            <Input id="h-name" placeholder="Jane Doe" />
          </FieldContent>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">FieldGroup</h2>
        <p className="p text-muted-foreground">
          Groups related Fields with consistent vertical spacing. Use for any
          stack of inputs.
        </p>
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="g-first">First name</FieldLabel>
            <FieldContent>
              <Input id="g-first" placeholder="Jane" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="g-last">Last name</FieldLabel>
            <FieldContent>
              <Input id="g-last" placeholder="Doe" />
            </FieldContent>
          </Field>
          <Field>
            <FieldLabel htmlFor="g-email">Email</FieldLabel>
            <FieldContent>
              <Input id="g-email" type="email" placeholder="jane@acme.co" />
            </FieldContent>
          </Field>
        </FieldGroup>
      </section>

      <section className="space-y-4">
        <h2 className="h2">FieldSet + FieldLegend</h2>
        <p className="p text-muted-foreground">
          Semantic grouping for related controls — checkbox groups, address
          sections, payment methods. Use FieldLegend variant=&quot;label&quot; when
          the legend should visually match a label.
        </p>
        <FieldSet className="max-w-md">
          <FieldLegend variant="label">Notification preferences</FieldLegend>
          <FieldDescription>Choose how you want to be alerted.</FieldDescription>
          <FieldGroup>
            <Field orientation="horizontal">
              <Checkbox id="n-email" defaultChecked />
              <FieldLabel htmlFor="n-email">Email</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="n-sms" />
              <FieldLabel htmlFor="n-sms">SMS</FieldLabel>
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="n-slack" defaultChecked />
              <FieldLabel htmlFor="n-slack">Slack</FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
      </section>

      <section className="space-y-4">
        <h2 className="h2">FieldSeparator</h2>
        <p className="p text-muted-foreground">
          Visually divides one Field from the next. Accepts optional inline
          label text.
        </p>
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="s-name">Workspace name</FieldLabel>
            <FieldContent>
              <Input id="s-name" placeholder="Acme Co." />
            </FieldContent>
          </Field>
          <FieldSeparator>Billing</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="s-address">Billing address</FieldLabel>
            <FieldContent>
              <Input id="s-address" placeholder="123 Market St" />
            </FieldContent>
          </Field>
        </FieldGroup>
      </section>

      <PropTable title="Field" rows={FIELD_ROWS} />
      <PropTable title="Field Sub-components" rows={FIELD_SUB_ROWS} />
    </div>
  )
}
