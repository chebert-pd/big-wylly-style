"use client"

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@chebert-pd/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const SELECT_ROWS: PropRow[] = [
  { prop: "value", type: "string", description: "Controlled selected value." },
  { prop: "defaultValue", type: "string", description: "Initial selected value when uncontrolled." },
  { prop: "onValueChange", type: "(value: string) => void", description: "Fires when the selection changes." },
  { prop: "disabled", type: "boolean", description: "Disables the entire control." },
  { prop: "name", type: "string", description: "Form field name." },
]

const SELECT_TRIGGER_ROWS: PropRow[] = [
  { prop: "size", type: '"sm" | "default" | "inline"', default: '"default"', description: "Trigger height and treatment. Inline removes the box for editable values in text or tables." },
  { prop: "aria-invalid", type: "boolean", description: "Marks the trigger as invalid — destructive border + ring treatment." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function SelectPage() {
  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Select</h1>
        <p className="p text-muted-foreground">
          A single value from a known, finite list. For long or dynamic option
          lists where the user needs to type to filter, use Combobox. For 2-5
          options where comparison matters, consider RadioGroup or ChoiceCard.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="h2">Default</h2>
        <Field className="max-w-md">
          <FieldLabel htmlFor="region">Region</FieldLabel>
          <FieldContent>
            <Select>
              <SelectTrigger id="region">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="us-east">US East</SelectItem>
                <SelectItem value="us-west">US West</SelectItem>
                <SelectItem value="eu-west">EU West</SelectItem>
                <SelectItem value="ap-south">AP South</SelectItem>
              </SelectContent>
            </Select>
          </FieldContent>
          <FieldDescription>Where merchant data is stored.</FieldDescription>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Sizes</h2>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel htmlFor="size-default">Default</FieldLabel>
            <FieldContent>
              <Select>
                <SelectTrigger id="size-default">
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">One</SelectItem>
                  <SelectItem value="two">Two</SelectItem>
                  <SelectItem value="three">Three</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="size-sm">Small</FieldLabel>
            <FieldContent>
              <Select>
                <SelectTrigger id="size-sm" size="sm">
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">One</SelectItem>
                  <SelectItem value="two">Two</SelectItem>
                  <SelectItem value="three">Three</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="size-inline">Inline</FieldLabel>
            <FieldContent>
              <Select>
                <SelectTrigger id="size-inline" size="inline">
                  <SelectValue placeholder="Choose an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="one">One</SelectItem>
                  <SelectItem value="two">Two</SelectItem>
                  <SelectItem value="three">Three</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">Grouped options</h2>
        <Field className="max-w-md">
          <FieldLabel htmlFor="industry">Industry</FieldLabel>
          <FieldContent>
            <Select>
              <SelectTrigger id="industry">
                <SelectValue placeholder="Select an industry" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Commerce</SelectLabel>
                  <SelectItem value="retail">Retail</SelectItem>
                  <SelectItem value="marketplace">Marketplace</SelectItem>
                  <SelectItem value="subscription">Subscription</SelectItem>
                </SelectGroup>
                <SelectSeparator />
                <SelectGroup>
                  <SelectLabel>Services</SelectLabel>
                  <SelectItem value="saas">SaaS</SelectItem>
                  <SelectItem value="travel">Travel & Hospitality</SelectItem>
                  <SelectItem value="financial">Financial</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </FieldContent>
        </Field>
      </section>

      <section className="space-y-4">
        <h2 className="h2">States</h2>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel htmlFor="state-disabled">Disabled</FieldLabel>
            <FieldContent>
              <Select disabled>
                <SelectTrigger id="state-disabled">
                  <SelectValue placeholder="Locked" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">A</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="state-invalid">Invalid</FieldLabel>
            <FieldContent>
              <Select>
                <SelectTrigger id="state-invalid" aria-invalid>
                  <SelectValue placeholder="Required" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">A</SelectItem>
                  <SelectItem value="b">B</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
            <FieldError>Choose a region to continue.</FieldError>
          </Field>
        </div>
      </section>

      <PropTable title="Select" rows={SELECT_ROWS} />
      <PropTable title="SelectTrigger" rows={SELECT_TRIGGER_ROWS} />
    </div>
  )
}
