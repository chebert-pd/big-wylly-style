"use client"

import { useState } from "react"
import { Search, Mail } from "lucide-react"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@big-wylly-style/ui"
import { PropTable, type PropRow } from "@/app/gallery/_components/prop-table"

const CURRENCIES = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "GBP", symbol: "£" },
  { code: "JPY", symbol: "¥" },
  { code: "AUD", symbol: "A$" },
  { code: "CAD", symbol: "C$" },
] as const

const COUNTRY_CODES = [
  { code: "us", dial: "+1", label: "US (+1)" },
  { code: "ca", dial: "+1", label: "Canada (+1)" },
  { code: "uk", dial: "+44", label: "UK (+44)" },
  { code: "fr", dial: "+33", label: "France (+33)" },
  { code: "de", dial: "+49", label: "Germany (+49)" },
  { code: "es", dial: "+34", label: "Spain (+34)" },
  { code: "jp", dial: "+81", label: "Japan (+81)" },
  { code: "au", dial: "+61", label: "Australia (+61)" },
  { code: "br", dial: "+55", label: "Brazil (+55)" },
  { code: "mx", dial: "+52", label: "Mexico (+52)" },
] as const

const INPUT_ROWS: PropRow[] = [
  { prop: "size", type: '"default" | "sm" | "inline"', default: '"default"', description: "Controls the height, padding, and treatment. Inline removes the box and uses a bottom border for editable values inline with text." },
  { prop: "type", type: "string", description: "HTML input type — text (default), email, password, number, search, tel, url, etc." },
  { prop: "placeholder", type: "string", description: "Placeholder text shown when the input is empty." },
  { prop: "disabled", type: "boolean", description: "Disables the input and applies reduced-opacity styling." },
  { prop: "aria-invalid", type: "boolean", description: "Marks the input as invalid — applies the destructive border + ring treatment." },
  { prop: "className", type: "string", description: "Additional CSS classes." },
]

export default function InputPage() {
  const [currency, setCurrency] = useState<string>("USD")
  const [country, setCountry] = useState<string>("us")
  const currencySymbol = CURRENCIES.find((c) => c.code === currency)?.symbol ?? "$"
  const countryDial = COUNTRY_CODES.find((c) => c.code === country)?.dial ?? "+1"

  return (
    <div className="space-y-10">
      <div className="space-y-2 max-w-3xl">
        <h1 className="h1">Input</h1>
        <p className="p text-muted-foreground">
          Single-line text or numeric entry. Always wrap in a Field for form
          semantics. Use InputGroup when you need an inline icon, prefix, or
          button.
        </p>
      </div>

      <section className="space-y-4">
        <h2 className="h2">Sizes</h2>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel htmlFor="size-default">Default</FieldLabel>
            <FieldContent>
              <Input id="size-default" placeholder="Standard form input" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="size-sm">Small</FieldLabel>
            <FieldContent>
              <Input id="size-sm" size="sm" placeholder="Compact input" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="size-inline">Inline</FieldLabel>
            <FieldContent>
              <Input
                id="size-inline"
                size="inline"
                placeholder="Borderless underline input"
              />
            </FieldContent>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">States</h2>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel htmlFor="state-default">Default</FieldLabel>
            <FieldContent>
              <Input id="state-default" placeholder="Type something" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="state-disabled">Disabled</FieldLabel>
            <FieldContent>
              <Input id="state-disabled" disabled placeholder="Locked" />
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="state-invalid">Invalid</FieldLabel>
            <FieldContent>
              <Input
                id="state-invalid"
                aria-invalid
                defaultValue="not-an-email"
              />
            </FieldContent>
            <FieldError>Enter a valid email address.</FieldError>
          </Field>

          <Field>
            <FieldLabel htmlFor="state-helper">With description</FieldLabel>
            <FieldContent>
              <Input id="state-helper" placeholder="acme-co" />
            </FieldContent>
            <FieldDescription>
              Used in the subdomain. Letters, numbers, and hyphens only.
            </FieldDescription>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">With InputGroup</h2>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel htmlFor="ig-search">Leading icon</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Search className="size-4" />
                </InputGroupAddon>
                <InputGroupInput id="ig-search" placeholder="Search merchants" />
              </InputGroup>
            </FieldContent>
          </Field>

          <Field>
            <FieldLabel htmlFor="ig-email">Trailing prefix text</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Mail className="size-4" />
                </InputGroupAddon>
                <InputGroupInput id="ig-email" placeholder="you" />
                <InputGroupAddon align="inline-end">
                  <InputGroupText>@wyllo.com</InputGroupText>
                </InputGroupAddon>
              </InputGroup>
            </FieldContent>
          </Field>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="h2">With dropdown addons</h2>
        <p className="p text-muted-foreground">
          A Select inside an <code>InputGroupAddon</code> stays borderless so
          the field reads as one control. Use a leading + trailing addon to
          let the user change the unit; lookups can keep the leading addon
          (symbol, prefix) in sync with the trailing dropdown.
        </p>
        <div className="max-w-md space-y-4">
          <Field>
            <FieldLabel htmlFor="amount">Amount</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <InputGroupText>{currencySymbol}</InputGroupText>
                </InputGroupAddon>
                <InputGroupInput
                  id="amount"
                  type="number"
                  inputMode="decimal"
                  placeholder="0.00"
                />
                <InputGroupAddon align="inline-end">
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger
                      size="sm"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      aria-label="Currency"
                    >
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCIES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.code}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputGroupAddon>
              </InputGroup>
            </FieldContent>
            <FieldDescription>
              The currency symbol on the left updates from the selector on the right.
            </FieldDescription>
          </Field>

          <Field>
            <FieldLabel htmlFor="phone">Phone number</FieldLabel>
            <FieldContent>
              <InputGroup>
                <InputGroupAddon align="inline-start">
                  <Select value={country} onValueChange={setCountry}>
                    <SelectTrigger
                      size="sm"
                      className="border-0 bg-transparent shadow-none focus-visible:ring-0"
                      aria-label="Country code"
                    >
                      <SelectValue>{countryDial}</SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_CODES.map((c) => (
                        <SelectItem key={c.code} value={c.code}>
                          {c.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </InputGroupAddon>
                <InputGroupInput
                  id="phone"
                  type="tel"
                  placeholder="(555) 123-4567"
                />
              </InputGroup>
            </FieldContent>
          </Field>
        </div>
      </section>

      <PropTable rows={INPUT_ROWS} />
    </div>
  )
}
